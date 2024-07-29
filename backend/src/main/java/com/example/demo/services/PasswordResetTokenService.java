package com.example.demo.services;

public interface PasswordResetTokenService {
    String validatePasswordResetToken(String token);
}
