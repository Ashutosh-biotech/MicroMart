package net.micromart.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String refreshToken;
    private String fullname;
    private String email;
    
    public LoginResponse(String token, String fullname) {
        this.token = token;
        this.fullname = fullname;
    }
}
