package com.example.demo.controller;

import com.example.demo.dto.PasswordDto;
import com.example.demo.entities.User;
import com.example.demo.services.Userservice;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Locale;
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

    @PostMapping("/user/resetpassword")
    public ResponseEntity<?> resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) {
        User user = userservice.findUserByEmail(userEmail);

        if (user != null) {
            final String token = UUID.randomUUID().toString();
            userservice.createPasswordResetTokenForUser(user, token);
            mailSender.send(constructResetTokenEmail(getAppUrl(request), request.getLocale(), token, user));
        } else {
            return ResponseEntity.badRequest().body("User not found");
        }

        Map<String, String> response = new HashMap<>();
        response.put("Réinitialisation du mot de passe envoyée à", userEmail);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/passwordupdate")
    public ResponseEntity<?> updatePassword(final Locale locale, final PasswordDto passwordDto) {
        User user = userservice.findUserByEmail(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getMail());

        if (!userservice.checkIfValidOldPassword(user, passwordDto.getOldPassword())) {
            return ResponseEntity.badRequest().body("Invalid old password");
        }

        userservice.changeUserPassword(user, passwordDto.getNewPassword());
        return ResponseEntity.ok("Password is changed successfully");
    }

    private SimpleMailMessage constructResetTokenEmail(final String contextPath, final Locale locale, final String token, final User user) {
        final String url = contextPath + "/user/changePassword?token=" + token;
        final String message = messages.getMessage("message.resetPassword", null, locale);
        return constructEmail("Reset Password", message + " \r\n" + url, user);
    }

    private SimpleMailMessage constructEmail(String subject, String body, User user) {
        final SimpleMailMessage email = new SimpleMailMessage();
        email.setSubject(subject);
        email.setText(body);
        email.setTo(user.getMail());
        email.setFrom(env.getProperty("support.email"));
        return email;
    }

    private String getAppUrl(HttpServletRequest request) {
        return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
    }
}
