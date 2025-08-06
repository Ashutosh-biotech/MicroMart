package net.micromart.auth.dto;

import lombok.Data;

@Data
public class LogoutRequest {
    private String token;
    private String refreshToken;
}