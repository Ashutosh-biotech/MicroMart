package net.micromart.auth.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${micromart.internal.secret}")
    private String internalSecret;
    
    private static final String EMAIL_SERVICE_URL = "http://localhost:9004/api/email";

    public void sendVerificationEmail(String email, String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Internal-Token", internalSecret);
            
            String url = EMAIL_SERVICE_URL + "/send-verification?email=" + email + "&verificationToken=" + token;
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            restTemplate.postForEntity(url, entity, String.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}