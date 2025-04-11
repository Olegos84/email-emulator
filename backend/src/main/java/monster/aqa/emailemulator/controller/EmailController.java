package monster.aqa.emailemulator.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import monster.aqa.emailemulator.dto.SendEmailRequest;
import monster.aqa.emailemulator.entity.User;
import monster.aqa.emailemulator.repository.UserRepository;
import monster.aqa.emailemulator.security.JwtService;
import monster.aqa.emailemulator.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    private User getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        String login = jwtService.extractUsername(token);
        return userRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestBody SendEmailRequest request,
                                       HttpServletRequest httpRequest) {
        User sender = getCurrentUser(httpRequest);
        emailService.sendEmail(sender, request);
        return ResponseEntity.ok("Email sent");
    }

    @GetMapping("/inbox")
    public ResponseEntity<?> getInbox(HttpServletRequest httpRequest) {
        User user = getCurrentUser(httpRequest);
        return ResponseEntity.ok(emailService.getInbox(user));
    }

    @GetMapping("/sent")
    public ResponseEntity<?> getSent(HttpServletRequest httpRequest) {
        User user = getCurrentUser(httpRequest);
        return ResponseEntity.ok(emailService.getSent(user));
    }
}
