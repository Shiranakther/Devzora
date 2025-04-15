package com.devzora.devzora.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.devzora.devzora.model.Users;
import com.devzora.devzora.repo.UserRepo;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    // public Users register(Users user) {
    //     user.setPassword(encoder.encode(user.getPassword()));
    //     return repo.save(user);
    // }

    public Users register(Users user) {

        if (repo.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists.");
        }
        
        if (repo.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists.");
        }
        

    // Set default role if not provided
    if (user.getRoles() == null || user.getRoles().isEmpty()) {
        user.setRoles(List.of("USER")); // You can set ADMIN or INSTRUCTOR too
    }

    // Encode password
    user.setPassword(encoder.encode(user.getPassword()));

    // Save to DB
    return repo.save(user);
}

    public String verify(Users user){
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );
    
            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(user.getUsername(),user.getEmail());
                System.out.println("Generated Token: " + token); // ✅ Debug log
                return token;
            }
        } catch (Exception e) {
            // Log or handle authentication failure
            return "failed";
        }
    
        return "failed";
    }

    public Users findByUsername(String username) {
        return repo.findByUsername(username);
    }
    
    
}
