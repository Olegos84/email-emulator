package monster.aqa.emailemulator.controller;

import lombok.RequiredArgsConstructor;
import monster.aqa.emailemulator.dto.AuthResponse;
import monster.aqa.emailemulator.dto.LoginRequest;
import monster.aqa.emailemulator.dto.RegisterRequest;
import monster.aqa.emailemulator.security.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
