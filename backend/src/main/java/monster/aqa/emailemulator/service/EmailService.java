package monster.aqa.emailemulator.service;

import lombok.RequiredArgsConstructor;
import monster.aqa.emailemulator.dto.SendEmailRequest;
import monster.aqa.emailemulator.entity.Email;
import monster.aqa.emailemulator.entity.EmailFolder;
import monster.aqa.emailemulator.entity.User;
import monster.aqa.emailemulator.repository.EmailRepository;
import monster.aqa.emailemulator.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

        Email email = new Email();
        email.setSender(sender);
        email.setReceiver(receiver);
        email.setSubject(request.getSubject());
        email.setBody(request.getBody());
        email.setFolder(SENT);

        emailRepository.save(email);

        // копия для получателя
        Email received = new Email();
        received.setSender(sender);
        received.setReceiver(receiver);
        received.setSubject(request.getSubject());
        received.setBody(request.getBody());
        received.setFolder(INBOX);

        emailRepository.save(received);
    }

    public List<Email> getInbox(User user) {
        return emailRepository.findByReceiver_LoginOrderBySentAtDesc(user.getLogin())
                .stream()
                .filter(email -> email.getFolder().equals("INBOX"))
                .toList();
    }

    public List<Email> getSent(User user) {
        return emailRepository.findBySender_LoginOrderBySentAtDesc(user.getLogin())
                .stream()
                .filter(email -> email.getFolder().equals("SENT"))
                .toList();
    }
}
