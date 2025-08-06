package net.micromart.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import net.micromart.api.model.UserDetails;
import reactor.core.publisher.Mono;

@Service
public class AuthService {

    private final WebClient webClient;
    private final String validateEndpoint;

    public AuthService(WebClient.Builder webClientBuilder, 
                      @Value("${auth.service.url}") String authServiceUrl,
                      @Value("${auth.service.validate.endpoint}") String validateEndpoint) {
        this.webClient = webClientBuilder.baseUrl(authServiceUrl).build();
        this.validateEndpoint = validateEndpoint;
    }

    public Mono<UserDetails> validateToken(String token) {
        return webClient.get()
                .uri(validateEndpoint)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(UserDetails.class)
                .onErrorResume(e -> Mono.empty());
    }
}