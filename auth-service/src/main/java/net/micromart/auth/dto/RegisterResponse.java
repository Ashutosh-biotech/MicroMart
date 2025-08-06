package net.micromart.auth.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterResponse {
    private String message;
    
    public RegisterResponse(String message) {
        this.message = message;
    }
}