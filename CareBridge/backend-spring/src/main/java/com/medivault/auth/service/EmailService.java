package com.medivault.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String to, String token) {
        log.info("Sending verification email to {} with token {}", to, token);
        if (mailSender == null) {
            log.warn("JavaMailSender is not configured. Skipping sending email.");
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("MediVault - Verify your email");
        message.setText("Please use this token to verify your email address: " + token);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}", to, e);
        }
    }

    public void sendPasswordResetEmail(String to, String token) {
        log.info("Sending password reset email to {} with token {}", to, token);
        if (mailSender == null) {
            log.warn("JavaMailSender is not configured. Skipping sending email.");
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("MediVault - Password Reset Request");
        message.setText("Please use this token to reset your password: " + token);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}", to, e);
        }
    }
}
