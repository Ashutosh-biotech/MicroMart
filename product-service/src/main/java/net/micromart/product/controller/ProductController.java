package net.micromart.product.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import net.micromart.product.model.Product;
import net.micromart.product.service.ProductService;
import net.micromart.product.dto.PageInfo;
import net.micromart.product.dto.PagedResponse;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "false") boolean includeInactive) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = includeInactive ? 
            productService.getAllProducts(pageable) : 
            productService.getActiveProducts(pageable);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<Page<Product>> getProductsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getProductsByCategory(category, pageable);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam String name,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.searchProducts(name, category, pageable);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/tags")
    public ResponseEntity<Page<Product>> getProductsByTags(
            @RequestParam List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getProductsByTags(tags, pageable);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/all-tags")
    public ResponseEntity<List<String>> getAllTags() {
        List<String> tags = productService.getAllTags();
        return ResponseEntity.ok(tags);
    }
    
    @GetMapping("/filter")
    public ResponseEntity<PagedResponse<Product>> filterProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<String> brands,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false, defaultValue = "false") boolean inStock) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productService.filterProducts(
            page, size, maxPrice, brands, minRating, tags, inStock, pageable);
        
        PagedResponse<Product> response = new PagedResponse<>(
            productPage.getContent(),
            new PageInfo(
                productPage.getSize(),
                productPage.getNumber(),
                productPage.getTotalElements(),
                productPage.getTotalPages()
            )
        );
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        try {            
            Product createdProduct = productService.createProduct(product);            
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Product> updateStock(@PathVariable String id, @RequestParam Integer quantity) {
        try {
            Product updatedProduct = productService.updateStock(id, quantity);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{id}/related")
    public ResponseEntity<List<Product>> getRelatedProducts(
            @PathVariable String id,
            @RequestParam(defaultValue = "8") int limit) {
        List<Product> relatedProducts = productService.getRelatedProducts(id, limit);
        return ResponseEntity.ok(relatedProducts);
    }
}