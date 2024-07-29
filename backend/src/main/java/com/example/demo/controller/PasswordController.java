package com.example.demo.controller;

import com.example.demo.Repository.PasswordResetTokenRepository;
import com.example.demo.dto.PasswordDto;
import com.example.demo.entities.PasswordResetToken;
import com.example.demo.entities.User;
import com.example.demo.services.PasswordResetTokenService;
import com.example.demo.services.Userservice;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
public class PasswordController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MessageSource messages;

    @Autowired
    private Userservice userservice;

    @Autowired
    private Environment env;

    @Autowired
    PasswordResetTokenService passwordResetTokenService;

    @Autowired
    PasswordResetTokenRepository passwordResetTokenRepository;

    @PostMapping("/user/resetpassword")
    public ResponseEntity<?> resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) {
        User user = userservice.findUserByEmail(userEmail);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(passwordResetToken);

        mailSender.send(constructResetTokenEmail(token, user));

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset link sent to " + userEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/changePassword")
    public ResponseEntity<Map<String, String>> validateToken(@RequestParam("token") String token) {
        String result = passwordResetTokenService.validatePasswordResetToken(token);
        Map<String, String> response = new HashMap<>();
        if (result != null) {
            response.put("status", "error");
            response.put("message", "Invalid or expired token");
            return ResponseEntity.badRequest().body(response);
        } else {
            response.put("status", "success");
            response.put("token", token);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/user/passwordupdate")
    public ResponseEntity<?> updatePassword(@RequestParam("token") String token, @Valid @RequestBody PasswordDto passwordDto) {
        String result = passwordResetTokenService.validatePasswordResetToken(token);
        if (result != null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        User user = userservice.getUserByPasswordResetToken(token);
        if (user == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        userservice.changeUserPassword(user, passwordDto.getNewPassword());
        return ResponseEntity.ok("Password is changed successfully");
    }

    private SimpleMailMessage constructResetTokenEmail(final String token, final User user) {
        final String frontendUrl = "http://localhost:3001/changePassword";
        final String url = frontendUrl + "?token=" + token;
        final String message = "Please click the link below to reset your password: \r\n" + url;
        return constructEmail("Reset Password", message, user);
    }

    private SimpleMailMessage constructEmail(String subject, String body, User user) {
        final SimpleMailMessage email = new SimpleMailMessage();
        email.setSubject(subject);
        email.setText(body);
        email.setTo(user.getMail());
        email.setFrom(env.getProperty("support.email"));
        return email;
    }
}
