package monster.aqa.emailemulator.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import monster.aqa.emailemulator.dto.SendEmailRequest;
import monster.aqa.emailemulator.entity.Email;
import monster.aqa.emailemulator.entity.User;
import monster.aqa.emailemulator.repository.EmailRepository;
import monster.aqa.emailemulator.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import static monster.aqa.emailemulator.entity.EmailFolder.DELETED_FROM_INBOX;
import static monster.aqa.emailemulator.entity.EmailFolder.DELETED_FROM_SENT;
import static monster.aqa.emailemulator.entity.EmailFolder.INBOX;
import static monster.aqa.emailemulator.entity.EmailFolder.SENT;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final UserRepository userRepository;
    private final EmailRepository emailRepository;

    public void sendEmail(User sender, SendEmailRequest request) {
        User receiver = userRepository.findByLogin(request.getReceiver())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        LocalDateTime now = LocalDateTime.now();
        int sendDelay = new Random().nextInt(4) + 2; // 2–5 секунд
        int inboxDelay = new Random().nextInt(13) + 3; // 3–15 секунд

        Email email = new Email();
        email.setSender(sender);
        email.setReceiver(receiver);
        email.setSubject(request.getSubject());
        email.setBody(request.getBody());
        email.setFolder(SENT);
        email.setSendTime(now.plusSeconds(sendDelay));
        email.setInboxTime(now.plusSeconds(inboxDelay));

        emailRepository.save(email);

        // копия для получателя
        Email received = new Email();
        received.setSender(sender);
        received.setReceiver(receiver);
        received.setSubject(request.getSubject());
        received.setBody(request.getBody());
        received.setFolder(INBOX);
        received.setSendTime(now.plusSeconds(sendDelay));
        received.setInboxTime(now.plusSeconds(inboxDelay));

        emailRepository.save(received);
    }

    public List<Email> getInbox(User user) {
        LocalDateTime now = LocalDateTime.now();
        return emailRepository.findByReceiver_LoginOrderBySentAtDesc(user.getLogin())
                .stream()
                .filter(email -> email.getFolder().equals(INBOX))
                .filter(email -> email.getInboxTime().isBefore(now))
                .toList();
    }

    public List<Email> getSent(User user) {
        LocalDateTime now = LocalDateTime.now();
        return emailRepository.findBySender_LoginOrderBySentAtDesc(user.getLogin())
                .stream()
                .filter(email -> email.getFolder().equals(SENT))
                .filter(email -> email.getSendTime().isBefore(now))
                .toList();
    }

    public List<Email> getTrash(User user) {
        return emailRepository.findTrashForUser(user.getId());
    }

    public void markAsDeleted(User user, Long emailId) {
        Email email = emailRepository.findById(emailId)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        boolean isReceiverAndInbox = email.getReceiver().getId().equals(user.getId())
                && email.getFolder() == INBOX;

        boolean isSenderAndSent = email.getSender().getId().equals(user.getId())
                && email.getFolder() == SENT;

        if (isReceiverAndInbox) {
            email.setFolder(DELETED_FROM_INBOX);
        } else if (isSenderAndSent) {
            email.setFolder(DELETED_FROM_SENT);
        } else {
            throw new RuntimeException("Forbidden to delete this email");
        }

        emailRepository.save(email);
    }

    @Transactional
    public void deleteAllFromTrash(User user) {
        List<Email> trashEmails = emailRepository.findTrashForUser(user.getId());
        emailRepository.deleteAll(trashEmails);
    }
}
