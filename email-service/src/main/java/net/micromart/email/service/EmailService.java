package net.micromart.email.service;

import net.micromart.email.dto.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendEmail(EmailRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(request.getBody(), true); // true = HTML content
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendVerificationEmail(String email, String token) {
        String subject = "Verify Your Email - MicroMart";
        String verificationLink = frontendUrl + "/verify-email?token=" + token;
        
        String body = createVerificationEmailTemplate(verificationLink);
        
        EmailRequest request = new EmailRequest(email, subject, body);
        sendEmail(request);
    }
    
    private String createVerificationEmailTemplate(String verificationLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Email</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
                    <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #e0e0e0;">
                        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">MicroMart</h1>
                    </div>
                    
                    <div style="padding: 40px 20px; text-align: center;">
                        <h2 style="color: #333333; margin-bottom: 20px;">Welcome to MicroMart!</h2>
                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Thank you for signing up! Please verify your email address to complete your registration.
                        </p>
                        
                        <a href="%s" style="display: inline-block; background-color: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0;">
                            Verify Email Address
                        </a>
                        
                        <p style="color: #888888; font-size: 14px; margin-top: 30px;">
                            This link will expire in 24 hours.
                        </p>
                        
                        <p style="color: #888888; font-size: 12px; margin-top: 20px;">
                            If you didn't create an account, you can safely ignore this email.
                        </p>
                    </div>
                    
                    <div style="border-top: 2px solid #e0e0e0; padding: 20px; text-align: center; background-color: #f8f9fa;">
                        <p style="color: #888888; font-size: 12px; margin: 0;">
                            © 2024 MicroMart. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(verificationLink);
    }

    public void sendPasswordResetEmail(String email, String resetLink) {
        String subject = "Password Reset - MicroMart";
        String body = createPasswordResetEmailTemplate(resetLink);
        
        EmailRequest request = new EmailRequest(email, subject, body);
        sendEmail(request);
    }
    
    private String createPasswordResetEmailTemplate(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
                    <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #e0e0e0;">
                        <h1 style="color: #2563eb; margin: 0; font-size: 28px;">MicroMart</h1>
                    </div>
                    
                    <div style="padding: 40px 20px; text-align: center;">
                        <h2 style="color: #333333; margin-bottom: 20px;">Password Reset Request</h2>
                        <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            We received a request to reset your password. Click the button below to create a new password.
                        </p>
                        
                        <a href="%s" style="display: inline-block; background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0;">
                            Reset Password
                        </a>
                        
                        <p style="color: #888888; font-size: 14px; margin-top: 30px;">
                            This link will expire in 1 hour.
                        </p>
                        
                        <p style="color: #888888; font-size: 12px; margin-top: 20px;">
                            If you didn't request a password reset, you can safely ignore this email.
                        </p>
                    </div>
                    
                    <div style="border-top: 2px solid #e0e0e0; padding: 20px; text-align: center; background-color: #f8f9fa;">
                        <p style="color: #888888; font-size: 12px; margin: 0;">
                            © 2024 MicroMart. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink);
    }
}