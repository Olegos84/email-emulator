package monster.aqa.emailemulator.security;

import lombok.RequiredArgsConstructor;
import monster.aqa.emailemulator.dto.AuthResponse;
import monster.aqa.emailemulator.dto.LoginRequest;
import monster.aqa.emailemulator.dto.RegisterRequest;
import monster.aqa.emailemulator.entity.User;
import monster.aqa.emailemulator.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .login(request.getLogin())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .groupName(request.getGroupName())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

}
