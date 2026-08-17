package com.smartfit.service;

import com.smartfit.dto.AuthResponse;
import com.smartfit.dto.LoginRequest;
import com.smartfit.dto.RegisterRequest;
import com.smartfit.model.User;
import com.smartfit.repository.UserRepository;
import com.smartfit.security.JwtUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public AuthService(UserService userService, UserRepository userRepository, JwtUtils jwtUtils) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse register(RegisterRequest request) {
        User registeredUser = userService.registerUser(request);
        registeredUser.setLoggedIn(true);
        registeredUser.setLastLoginTime(LocalDateTime.now().format(FORMATTER));
        userRepository.save(registeredUser);

        String token = jwtUtils.generateJwtToken(registeredUser.getEmail());
        return new AuthResponse(token, registeredUser);
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Email address and password cannot be empty.");
        }

        Optional<User> userOpt = userService.findByEmail(request.getEmail());
        if (userOpt.isPresent() && userService.verifyPassword(request.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            user.setLoggedIn(true);
            user.setLastLoginTime(LocalDateTime.now().format(FORMATTER));
            userRepository.save(user);

            String token = jwtUtils.generateJwtToken(user.getEmail());
            return new AuthResponse(token, user);
        } else {
            throw new IllegalArgumentException("Invalid email or password. Please verify your credentials.");
        }
    }
}
