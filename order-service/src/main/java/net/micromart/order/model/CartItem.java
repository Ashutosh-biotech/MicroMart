package net.micromart.order.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItem {
    private String productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private String primaryImage;
}