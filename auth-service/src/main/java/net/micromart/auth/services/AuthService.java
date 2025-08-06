package net.micromart.auth.services;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

import net.micromart.auth.dto.LoginRequest;
import net.micromart.auth.dto.RegisterRequest;
import net.micromart.auth.model.User;
import net.micromart.auth.repository.UserRepository;
import net.micromart.auth.utils.JwtUtil;
import net.micromart.auth.utils.ValidationUtil;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final EmailServiceClient emailServiceClient;
	private final EmailVerificationService emailVerificationService;

    public AuthService(UserRepository repository, BCryptPasswordEncoder encoder, JwtUtil jwtUtil, 
                      EmailServiceClient emailServiceClient, EmailVerificationService emailVerificationService) {
        this.userRepo = repository;
        this.passwordEncoder = encoder;
		this.jwtUtil = jwtUtil;
		this.emailServiceClient = emailServiceClient;
		this.emailVerificationService = emailVerificationService;
    }

    public User authenticate(String email, String password) {
        User user = userRepo.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public User login(LoginRequest loginData) {
        User user = authenticate(loginData.getEmail(), loginData.getPassword());
        if (user != null) {
            if (!user.isEmailVerified()) {
                throw new IllegalArgumentException("Please verify your email before logging in");
            }
            return user;
        }
        return null;
    }

    // In your AuthService class, if you have this method:
    public String generateToken(User user) {
        // Remove this method or make it use JwtUtil
        return jwtUtil.generateEncryptedToken(user);
    }

    public User register(RegisterRequest registerData) {
        // Validate input fields
        if (!ValidationUtil.isValidName(registerData.getFirstName()) ||
            !ValidationUtil.isValidOptionalName(registerData.getLastName()) ||
            !ValidationUtil.isValidEmail(registerData.getEmail()) ||
            !ValidationUtil.isValidPassword(registerData.getPassword())) {
            throw new IllegalArgumentException("Invalid input data");
        }
        
        // Check password confirmation
        if (!registerData.getPassword().equals(registerData.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        
        // Check if user already exists
        if (userRepo.findByEmail(registerData.getEmail()) != null) {
            throw new IllegalArgumentException("User already exists");
        }

        User user = User.builder()
                .firstName(registerData.getFirstName().trim())
                .lastName(registerData.getLastName() != null ? registerData.getLastName().trim() : "")
                .email(registerData.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(registerData.getPassword()))
                .build();

        User savedUser = userRepo.save(user);
        
        // Send verification email
        String verificationToken = emailVerificationService.generateVerificationToken(user.getEmail());
        emailServiceClient.sendVerificationEmail(user.getEmail(), verificationToken);
        
        return savedUser;
    }

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }
    
    public boolean verifyEmail(String token) {
        String email = emailVerificationService.validateTokenAndGetEmail(token);
        if (email != null) {
            User user = userRepo.findByEmail(email);
            if (user != null && !user.isEmailVerified()) {
                user.setEmailVerified(true);
                userRepo.save(user);
                return true;
            }
        }
        return false;
    }
    
    public List<String> getUserWishlist(String email) {
        User user = userRepo.findByEmail(email);
        return user != null ? user.getWishlist() : new ArrayList<>();
    }
    
    public boolean addToWishlist(String email, String productId) {
        User user = userRepo.findByEmail(email);
        if (user != null && !user.getWishlist().contains(productId)) {
            user.getWishlist().add(productId);
            userRepo.save(user);
            return true;
        }
        return false;
    }
    
    public boolean removeFromWishlist(String email, String productId) {
        User user = userRepo.findByEmail(email);
        if (user != null && user.getWishlist().remove(productId)) {
            userRepo.save(user);
            return true;
        }
        return false;
    }
}
