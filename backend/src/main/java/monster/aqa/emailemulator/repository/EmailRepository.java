package monster.aqa.emailemulator.repository;

import monster.aqa.emailemulator.entity.Email;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmailRepository extends JpaRepository<Email, Long> {
    List<Email> findByReceiver_LoginOrderBySentAtDesc(String receiverLogin);

    List<Email> findBySender_LoginOrderBySentAtDesc(String senderLogin);

    @Query("""
                SELECT e FROM Email e
                WHERE
                    (e.receiver.id = :userId AND e.folder = monster.aqa.emailemulator.entity.EmailFolder.DELETED_FROM_INBOX)
                    OR
                    (e.sender.id = :userId AND e.folder = monster.aqa.emailemulator.entity.EmailFolder.DELETED_FROM_SENT)
                ORDER BY e.inboxTime DESC
            """)
    List<Email> findTrashForUser(@Param("userId") Long userId);
}
