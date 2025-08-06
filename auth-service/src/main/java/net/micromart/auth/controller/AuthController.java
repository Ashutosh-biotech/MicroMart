package net.micromart.auth.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.micromart.auth.dto.LoginRequest;
import net.micromart.auth.dto.LoginResponse;
import net.micromart.auth.dto.LogoutRequest;
import net.micromart.auth.dto.RefreshTokenRequest;
import net.micromart.auth.dto.RegisterRequest;
import net.micromart.auth.dto.RegisterResponse;
import net.micromart.auth.model.User;
import net.micromart.auth.services.AuthService;
import net.micromart.auth.services.TokenBlacklistService;
import net.micromart.auth.utils.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthController(AuthService authService, TokenBlacklistService tokenBlacklistService) {
        this.authService = authService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginData) {
        User user = authService.login(loginData);
        if (user != null) {
            String encryptedToken = jwtUtil.generateEncryptedToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);
            String fullname = user.getFirstName() + " " + user.getLastName();
            LoginResponse response = new LoginResponse(encryptedToken, refreshToken, fullname, user.getEmail());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerData) {
        try {
            authService.register(registerData);
            return ResponseEntity.status(HttpStatus.CREATED).body(new RegisterResponse("Registration successful"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new RegisterResponse(e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String encryptedToken = authHeader.substring(7);

            if (tokenBlacklistService.isTokenBlacklisted(encryptedToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            try {
                if (jwtUtil.validateEncryptedToken(encryptedToken)) {
                    String email = jwtUtil.getSubjectFromEncryptedToken(encryptedToken);
                    String userId = jwtUtil.getUserIdFromEncryptedToken(encryptedToken);

                    Map<String, Object> userDetails = new HashMap<>();
                    userDetails.put("id", userId);
                    userDetails.put("username", email);
                    userDetails.put("email", email);
                    userDetails.put("permissions", List.of());
                    userDetails.put("active", true);

                    return ResponseEntity.ok(userDetails);
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody LogoutRequest request) {
        // Blacklist both tokens if provided
        if (request.getToken() != null && !request.getToken().isEmpty()) {
            tokenBlacklistService.blacklistToken(request.getToken());
        }
        if (request.getRefreshToken() != null && !request.getRefreshToken().isEmpty()) {
            tokenBlacklistService.blacklistToken(request.getRefreshToken());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        if (tokenBlacklistService.isTokenBlacklisted(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            if (jwtUtil.validateRefreshToken(refreshToken)) {
                String email = jwtUtil.getSubjectFromEncryptedToken(refreshToken);
                User user = authService.getUserByEmail(email);
                String newAccessToken = jwtUtil.generateEncryptedToken(user);
                String newRefreshToken = jwtUtil.generateRefreshToken(user);
                tokenBlacklistService.blacklistToken(refreshToken);
                LoginResponse response = new LoginResponse(newAccessToken, newRefreshToken, null, email);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        boolean verified = authService.verifyEmail(token);
        if (verified) {
            return ResponseEntity.ok().body("Email verified successfully");
        }
        return ResponseEntity.badRequest().body("Invalid or expired verification token");
    }

    @GetMapping("/wishlist")
    public ResponseEntity<List<String>> getWishlist(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtUtil.getSubjectFromEncryptedToken(token);
                List<String> wishlist = authService.getUserWishlist(email);
                return ResponseEntity.ok(wishlist);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/wishlist/{productId}")
    public ResponseEntity<Void> addToWishlist(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String productId) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtUtil.getSubjectFromEncryptedToken(token);
                boolean added = authService.addToWishlist(email, productId);
                return added ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @DeleteMapping("/wishlist/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String productId) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtUtil.getSubjectFromEncryptedToken(token);
                boolean removed = authService.removeFromWishlist(email, productId);
                return removed ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth service is running");
    }
}
