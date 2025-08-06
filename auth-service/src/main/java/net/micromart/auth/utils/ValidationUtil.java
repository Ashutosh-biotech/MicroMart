package net.micromart.auth.utils;

import java.util.regex.Pattern;

public class ValidationUtil {
    
    private static final String PASSWORD_PATTERN = 
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>:_.-])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>:_.-]{8,}$";
    
    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);
    
    public static boolean isValidPassword(String password) {
        boolean result = password != null && pattern.matcher(password).matches();
        return result;
    }
    
    public static boolean isValidEmail(String email) {
        boolean result = email != null && email.contains("@") && email.contains(".");
        return result;
    }
    
    public static boolean isValidName(String name) {
        boolean result = name != null && !name.trim().isEmpty() && name.trim().length() >= 2;
        return result;
    }
    
    public static boolean isValidOptionalName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return true; // Optional field
        }
        return name.trim().length() >= 2;
    }
}