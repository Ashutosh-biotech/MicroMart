package net.micromart.order.controller;

import lombok.RequiredArgsConstructor;
import net.micromart.order.model.Cart;
import net.micromart.order.model.CartItem;
import net.micromart.order.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String AUTH_SERVICE_URL = "http://localhost:9000/api/auth/validate";
    
    private String validateTokenAndGetEmail(String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                AUTH_SERVICE_URL, HttpMethod.POST, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("email");
            }
        } catch (Exception e) {
            // Token validation failed
        }
        return null;
    }
    
    @PostMapping("/get")
    public ResponseEntity<Cart> getCart(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = validateTokenAndGetEmail(token);
        
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        
        Cart cart = cartService.getCartByUserId(email);
        return ResponseEntity.ok(cart);
    }
    
    @PostMapping("/items")
    public ResponseEntity<Cart> addToCart(@RequestHeader("Authorization") String authHeader, @RequestBody CartItem item) {
        String token = authHeader.replace("Bearer ", "");
        String email = validateTokenAndGetEmail(token);
        
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        
        Cart cart = cartService.addToCart(email, item);
        return ResponseEntity.ok(cart);
    }
    
    @PutMapping("/items/{productId}")
    public ResponseEntity<Cart> updateCartItem(@RequestHeader("Authorization") String authHeader,
                                               @PathVariable String productId, 
                                               @RequestParam Integer quantity) {
        String token = authHeader.replace("Bearer ", "");
        String email = validateTokenAndGetEmail(token);
        
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        
        Cart cart = cartService.updateCartItem(email, productId, quantity);
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeFromCart(@RequestHeader("Authorization") String authHeader, @PathVariable String productId) {
        String token = authHeader.replace("Bearer ", "");
        String email = validateTokenAndGetEmail(token);
        
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        
        Cart cart = cartService.removeFromCart(email, productId);
        return ResponseEntity.ok(cart);
    }
    
    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = validateTokenAndGetEmail(token);
        
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        
        cartService.clearCart(email);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/sync")
    public ResponseEntity<Cart> syncCart(@RequestHeader("Authorization") String authHeader, @RequestBody List<CartItem> items) {
        String token = authHeader.replace("Bearer ", "");
        String email = validateTokenAndGetEmail(token);
        
        if (email == null) {
            return ResponseEntity.status(401).build();
        }
        
        Cart cart = cartService.syncCart(email, items);
        return ResponseEntity.ok(cart);
    }
}