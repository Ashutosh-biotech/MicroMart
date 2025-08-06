package net.micromart.auth.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import net.micromart.auth.model.User;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String SECRET_KEY;
    
    @Value("${app.jwt.expiration}")
    private long EXPIRATION_MS;
    
    @Value("${app.jwt.refresh-expiration}")
    private long REFRESH_EXPIRATION_MS;
    
    @Autowired
    private TokenEncryptionUtil tokenEncryptionUtil;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Generate plain JWT token (internal method)
    private String generatePlainToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());

        return Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(getSigningKey())
                .compact();
    }

    // Generate and encrypt JWT token - Main method to use
    public String generateEncryptedToken(User user) {
        String jwtToken = generatePlainToken(user);
        return tokenEncryptionUtil.encryptToken(jwtToken);
    }
    
    // Generate refresh token
    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("type", "refresh");

        String refreshToken = Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_MS))
                .signWith(getSigningKey())
                .compact();
                
        return tokenEncryptionUtil.encryptToken(refreshToken);
    }
    
    // Validate refresh token
    public boolean validateRefreshToken(String encryptedRefreshToken) {
        try {
            String plainToken = tokenEncryptionUtil.decryptToken(encryptedRefreshToken);
            Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(plainToken)
                .getPayload();
            return "refresh".equals(claims.get("type"));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Validate encrypted token
    public boolean validateEncryptedToken(String encryptedToken) {
        try {
            // Decrypt the token first
            String plainToken = tokenEncryptionUtil.decryptToken(encryptedToken);
            
            // Then validate the JWT
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(plainToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Get subject from encrypted token
    public String getSubjectFromEncryptedToken(String encryptedToken) {
        try {
            // First decrypt the token
            String plainToken = tokenEncryptionUtil.decryptToken(encryptedToken);
            
            // Then extract subject from JWT
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(plainToken)
                    .getPayload();
            return claims.getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid encrypted token", e);
        }
    }

    // Get user ID from encrypted token
    public String getUserIdFromEncryptedToken(String encryptedToken) {
        try {
            // First decrypt the token
            String plainToken = tokenEncryptionUtil.decryptToken(encryptedToken);
            
            // Then extract userId from JWT
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(plainToken)
                    .getPayload();
            Object userId = claims.get("userId");
            return userId != null ? userId.toString() : null;
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid encrypted token", e);
        }
    }

    // Keep legacy methods for backward compatibility (if needed)
    @Deprecated
    public String generateToken(User user) {
        return generatePlainToken(user);
    }

    @Deprecated
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    @Deprecated
    public String getSubject(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    @Deprecated
    public String getUserId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        Object userId = claims.get("userId");
        return userId != null ? userId.toString() : null;
    }
}
