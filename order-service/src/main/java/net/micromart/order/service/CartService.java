package net.micromart.order.service;

import lombok.RequiredArgsConstructor;
import net.micromart.order.model.Cart;
import net.micromart.order.model.CartItem;
import net.micromart.order.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartRepository cartRepository;
    
    public Cart getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId));
    }
    
    public Cart addToCart(String userId, CartItem item) {
        Cart cart = getCartByUserId(userId);
        
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(cartItem -> cartItem.getProductId().equals(item.getProductId()))
                .findFirst();
        
        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + item.getQuantity());
        } else {
            cart.getItems().add(item);
        }
        
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }
    
    public Cart updateCartItem(String userId, String productId, Integer quantity) {
        Cart cart = getCartByUserId(userId);
        
        if (quantity <= 0) {
            cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        } else {
            cart.getItems().stream()
                    .filter(item -> item.getProductId().equals(productId))
                    .findFirst()
                    .ifPresent(item -> item.setQuantity(quantity));
        }
        
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }
    
    public Cart removeFromCart(String userId, String productId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }
    
    public void clearCart(String userId) {
        cartRepository.deleteByUserId(userId);
    }
    
    public Cart syncCart(String userId, List<CartItem> items) {
        Cart cart = getCartByUserId(userId);
        cart.setItems(items);
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }
    
    private Cart createEmptyCart(String userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setItems(new ArrayList<>());
        cart.setCreatedAt(LocalDateTime.now());
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }
}