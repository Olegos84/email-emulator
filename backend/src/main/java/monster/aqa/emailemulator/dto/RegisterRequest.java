package monster.aqa.emailemulator.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String login;
    private String firstName;
    private String lastName;
    private String password;
    private String groupName;
}
