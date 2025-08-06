package net.micromart.api.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("http://localhost:9000"))
                .route("product-images", r -> r
                        .path("/api/images/**")
                        .uri("http://localhost:9001"))
                .route("product-service", r -> r
                        .path("/api/products/**")
                        .uri("http://localhost:9001"))
                .route("order-service", r -> r
                        .path("/api/orders/**")
                        .uri("http://localhost:9002"))
                .route("user-service", r -> r
                        .path("/api/users/**")
                        .uri("http://localhost:9003"))
                .build();
    }
}