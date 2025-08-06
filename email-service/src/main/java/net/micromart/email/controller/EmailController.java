package net.micromart.email.controller;

import net.micromart.email.dto.EmailRequest;
import net.micromart.email.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Value("${micromart.internal.secret}")
    private String internalSecret;

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(
            @RequestHeader("X-Internal-Token") String token,
            @RequestBody EmailRequest request) {
        
        if (!internalSecret.equals(token)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            emailService.sendEmail(request);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email");
        }
    }

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerification(
            @RequestHeader("X-Internal-Token") String token,
            @RequestParam String email,
            @RequestParam String verificationToken) {
        
        if (!internalSecret.equals(token)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            emailService.sendVerificationEmail(email, verificationToken);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send verification email");
        }
    }

    @PostMapping("/send-password-reset")
    public ResponseEntity<?> sendPasswordReset(
            @RequestHeader("X-Internal-Token") String token,
            @RequestParam String email,
            @RequestParam String resetLink) {
        
        if (!internalSecret.equals(token)) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            emailService.sendPasswordResetEmail(email, resetLink);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send password reset email");
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Email service is running");
    }
}