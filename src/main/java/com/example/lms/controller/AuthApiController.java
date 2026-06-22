package com.example.lms.controller;

import com.example.lms.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {
    private final UserRepository users;

    public AuthApiController(UserRepository users) {
        this.users = users;
    }

    @GetMapping("/me")
    Map<String, Object> me(Authentication authentication) {
        return users.findByUsername(authentication.getName())
            .map(user -> Map.<String, Object>of(
                "username", user.getUsername(),
                "fullName", user.getFullName(),
                "role", user.getRole().name()
            ))
            .orElse(Map.<String, Object>of("username", authentication.getName()));
    }
}
