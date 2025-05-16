package com.devzora.devzora.service;

import com.devzora.devzora.model.Users;
import com.devzora.devzora.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        if (repo.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists.");
        }
        if (repo.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists.");
        }
        // Set default roles if not provided
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(List.of("USER"));
        }
        // Encode password
        user.setPassword(encoder.encode(user.getPassword()));
        // Save to DB
        return repo.save(user);
    }

    public String verify(Users user) {
        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );
            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(user.getUsername(), user.getEmail());
                System.out.println("Generated Token: " + token);
                return token;
            }
        } catch (Exception e) {
            System.err.println("Authentication failed: " + e.getMessage());
            return "failed";
        }
        return "failed";
    }

    public Users findByUsername(String username) {
        return repo.findByUsername(username);
    }

    public Users findById(String id) {
        return repo.findById(id).orElse(null);
    }

    public Users updateUser(Users user) {
        return repo.save(user);
    }

    public boolean deleteByUsername(String username) {
        Users user = repo.findByUsername(username);
        if (user != null) {
            repo.delete(user);
            return true;
        }
        return false;
    }

    public Users followUser(String followeeId, Authentication authentication) {
        String username = authentication.getName();
        Users follower = repo.findByUsername(username);
        if (follower == null) {
            throw new RuntimeException("Follower user not found");
        }
        Optional<Users> optionalFollowee = repo.findById(followeeId);
        if (!optionalFollowee.isPresent()) {
            throw new RuntimeException("Followee user not found with id: " + followeeId);
        }
        Users followee = optionalFollowee.get();

        // Prevent self-follow
        if (follower.getId().equals(followeeId)) {
            throw new RuntimeException("Cannot follow yourself");
        }

        // Initialize lists if null
        if (follower.getFollowing() == null) {
            follower.setFollowing(new ArrayList<>());
        }
        if (followee.getFollowers() == null) {
            followee.setFollowers(new ArrayList<>());
        }

        // Add followee to follower's following list
        if (!follower.getFollowing().contains(followeeId)) {
            follower.getFollowing().add(followeeId);
            repo.save(follower);
        }

        // Add follower to followee's followers list
        if (!followee.getFollowers().contains(follower.getId())) {
            followee.getFollowers().add(follower.getId());
            repo.save(followee);
        }

        return follower;
    }

    public Users unfollowUser(String followeeId, Authentication authentication) {
        String username = authentication.getName();
        Users follower = repo.findByUsername(username);
        if (follower == null) {
            throw new RuntimeException("Follower user not found");
        }
        Optional<Users> optionalFollowee = repo.findById(followeeId);
        if (!optionalFollowee.isPresent()) {
            throw new RuntimeException("Followee user not found with id: " + followeeId);
        }
        Users followee = optionalFollowee.get();

        // Remove followee from follower's following list
        if (follower.getFollowing() != null && follower.getFollowing().contains(followeeId)) {
            follower.getFollowing().remove(followeeId);
            repo.save(follower);
        }

        // Remove follower from followee's followers list
        if (followee.getFollowers() != null && followee.getFollowers().contains(follower.getId())) {
            followee.getFollowers().remove(follower.getId());
            repo.save(followee);
        }

        return follower;
    }

    public List<Users> getFollowing(String userId) {
        Optional<Users> optionalUser = repo.findById(userId);
        if (!optionalUser.isPresent()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        Users user = optionalUser.get();
        if (user.getFollowing() == null || user.getFollowing().isEmpty()) {
            return new ArrayList<>();
        }
        return repo.findAllById(user.getFollowing());
    }

    public List<Users> getFollowers(String userId) {
        Optional<Users> optionalUser = repo.findById(userId);
        if (!optionalUser.isPresent()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        Users user = optionalUser.get();
        if (user.getFollowers() == null || user.getFollowers().isEmpty()) {
            return new ArrayList<>();
        }
        return repo.findAllById(user.getFollowers());
    }
}