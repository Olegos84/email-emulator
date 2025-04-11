package monster.aqa.emailemulator.repository;

import monster.aqa.emailemulator.entity.Email;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmailRepository extends JpaRepository<Email, Long> {
    List<Email> findByReceiver_LoginOrderBySentAtDesc(String receiverLogin);
    List<Email> findBySender_LoginOrderBySentAtDesc(String senderLogin);
}
