package net.micromart.auth.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "blacklisted_tokens")
public class BlacklistedToken {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String token;
    
    @Indexed(expireAfter = "1d") // 24 hours TTL
    private LocalDateTime createdAt;
    
    public BlacklistedToken(String token) {
        this.token = token;
        this.createdAt = LocalDateTime.now();
    }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}