package net.micromart.product.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.micromart.product.model.Product;
import net.micromart.product.repository.ProductRepository;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryAttributeService categoryAttributeService;
    
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    
    public Page<Product> getActiveProducts(Pageable pageable) {
        return productRepository.findByActiveTrueOrderByIdDesc(pageable);
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> getActiveProducts() {
        return productRepository.findByActiveTrue();
    }
    
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }
    
    public Page<Product> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategoryAndActiveTrue(category, pageable);
    }
    
    public Page<Product> searchProducts(String name, String category, Pageable pageable) {
        if (category != null && !category.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCaseAndCategoryAndActiveTrueOrTagsContainingIgnoreCaseAndCategoryAndActiveTrue(name, category, name, category, pageable);
        } else {
            return productRepository.findByNameContainingIgnoreCaseOrTagsContainingIgnoreCaseAndActiveTrue(name, name, pageable);
        }
    }
    
    public Page<Product> searchProducts(String name, Pageable pageable) {
        return searchProducts(name, null, pageable);
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndActiveTrue(category);
    }
    
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Page<Product> getProductsByTags(List<String> tags, Pageable pageable) {
        return productRepository.findByTagsInAndActiveTrue(tags, pageable);
    }
    
    public List<String> getAllTags() {
        return productRepository.findDistinctTagsByActiveTrue();
    }
    
    public Page<Product> filterProducts(int page, int size, Double maxPrice, 
            List<String> brands, Double minRating, List<String> tags, boolean inStock, Pageable pageable) {
        
        return productRepository.findFilteredProducts(
            maxPrice, brands, minRating, tags, inStock, pageable);
    }
    
    public Product createProduct(Product product) {
        
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product.setActive(true);
        
        // Set default attributes based on category if not provided
        if (product.getAttributes() == null || product.getAttributes().isEmpty()) {
            product.setAttributes(categoryAttributeService.getDefaultAttributes(product.getCategory()));
        }
        
        Product savedProduct = productRepository.save(product);
        
        // Verify the product was saved by fetching it
        Optional<Product> verifyProduct = productRepository.findById(savedProduct.getId());
        
        return savedProduct;
    }
    
    public Product updateProduct(String id, Product product) {
        product.setId(id);
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }
    
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
    
    public Product updateStock(String id, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStockQuantity(quantity);
            product.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found");
    }
    
    public List<Product> getRelatedProducts(String productId, int limit) {
        Optional<Product> currentProductOpt = productRepository.findById(productId);
        if (!currentProductOpt.isPresent()) {
            return List.of();
        }
        
        Product currentProduct = currentProductOpt.get();
        
        // Get products from same category (excluding current product)
        List<Product> categoryProducts = productRepository.findByCategoryAndActiveTrueAndIdNot(
            currentProduct.getCategory(), productId
        ).stream().limit(limit / 2).toList();
        
        // Get products with matching tags (excluding current product and already selected)
        List<String> productIds = categoryProducts.stream().map(Product::getId).toList();
        List<Product> tagProducts = List.of();
        
        if (currentProduct.getTags() != null && !currentProduct.getTags().isEmpty()) {
            tagProducts = productRepository.findByTagsInAndActiveTrueAndIdNotIn(
                currentProduct.getTags(), 
                java.util.stream.Stream.concat(
                    productIds.stream(), 
                    java.util.stream.Stream.of(productId)
                ).toList()
            ).stream().limit(limit - categoryProducts.size()).toList();
        }
        
        // Combine and return
        return java.util.stream.Stream.concat(
            categoryProducts.stream(), 
            tagProducts.stream()
        ).limit(limit).toList();
    }
}