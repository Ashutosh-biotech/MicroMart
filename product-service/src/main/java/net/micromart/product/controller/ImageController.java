package net.micromart.product.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
    
    @Value("${app.upload.dir:uploads/images}")
    private String uploadDir;
    
    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);
            
            // Always ensure directory exists
            Files.createDirectories(uploadPath);
            
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);
            
            return ResponseEntity.ok("/api/images/" + filename);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Upload failed");
        }
    }
    
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<String>> uploadMultipleImages(@RequestParam("files") MultipartFile[] files) {
        List<String> imageUrls = new ArrayList<>();
        
        try {
            Path uploadPath = Paths.get(uploadDir);
            // Always ensure directory exists
            Files.createDirectories(uploadPath);
            
            for (MultipartFile file : files) {
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                
                Path filePath = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), filePath);
                imageUrls.add("/api/images/" + filename);
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(imageUrls);
    }
    
    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            byte[] image = Files.readAllBytes(filePath);
            return ResponseEntity.ok().body(image);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}