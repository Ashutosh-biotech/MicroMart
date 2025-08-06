package net.micromart.auth.services;

import net.micromart.auth.model.BlacklistedToken;
import net.micromart.auth.repository.BlacklistedTokenRepository;
import org.springframework.stereotype.Service;

@Service
public class TokenBlacklistService {
    
    private final BlacklistedTokenRepository repository;
    
    public TokenBlacklistService(BlacklistedTokenRepository repository) {
        this.repository = repository;
    }
    
    public void blacklistToken(String token) {
        repository.save(new BlacklistedToken(token));
    }
    
    public boolean isTokenBlacklisted(String token) {
        return repository.existsByToken(token);
    }
}