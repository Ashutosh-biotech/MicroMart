package net.micromart.product.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CategoryAttributeService {
    
    public Map<String, Object> getDefaultAttributes(String category) {
        return switch (category.toLowerCase()) {
            case "electronics" -> getElectronicsAttributes();
            case "clothing" -> getClothingAttributes();
            case "home" -> getHomeAttributes();
            case "sports" -> getSportsAttributes();
            default -> new HashMap<>();
        };
    }
    
    private Map<String, Object> getElectronicsAttributes() {
        Map<String, Object> attrs = new HashMap<>();
        attrs.put("warranty", "");
        attrs.put("model", "");
        attrs.put("specifications", new HashMap<String, String>());
        attrs.put("color", "");
        return attrs;
    }
    
    private Map<String, Object> getClothingAttributes() {
        Map<String, Object> attrs = new HashMap<>();
        attrs.put("size", "");
        attrs.put("color", "");
        attrs.put("material", "");
        attrs.put("fabric", "");
        attrs.put("careInstructions", "");
        return attrs;
    }
    
    private Map<String, Object> getHomeAttributes() {
        Map<String, Object> attrs = new HashMap<>();
        attrs.put("dimensions", "");
        attrs.put("weight", "");
        attrs.put("material", "");
        attrs.put("color", "");
        return attrs;
    }
    
    private Map<String, Object> getSportsAttributes() {
        Map<String, Object> attrs = new HashMap<>();
        attrs.put("size", "");
        attrs.put("color", "");
        attrs.put("material", "");
        attrs.put("sportType", "");
        return attrs;
    }
}