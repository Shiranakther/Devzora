package com.devzora.devzora.service;

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

    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
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
    
}
