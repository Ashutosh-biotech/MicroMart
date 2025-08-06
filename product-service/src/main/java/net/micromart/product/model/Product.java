package net.micromart.product.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "products")
public class Product {
    
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String category;
    private String brand;
    private Integer stockQuantity;
    private String sku;
    private String primaryImage;
    private List<String> additionalImages;
    private Map<String, Object> attributes; // Dynamic attributes based on category
    private Double rating;
    private Integer reviewCount;
    private List<String> tags;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}