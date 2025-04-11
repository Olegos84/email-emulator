package monster.aqa.emailemulator.dto;

import lombok.Data;

@Data
public class SendEmailRequest {
    private String receiver;        // логин получателя
    private String subject;
    private String body;
}
