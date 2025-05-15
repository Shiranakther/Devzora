package com.devzora.devzora.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.devzora.devzora.model.Users;
import com.devzora.devzora.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.security.core.Authentication;




@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService service;

        @PostMapping("/register")
        public Users register(@RequestBody  Users user) {
            return service.register(user);
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody Users user) {
        String result = service.verify(user);

        if (result == null || "failed".equals(result)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body("Invalid username or password");
        }

            return ResponseEntity.ok().body(result); // token as body
}


            @GetMapping("/me")
            public ResponseEntity<?> getCurrentUser(Authentication authentication) {
                String username = authentication.getName(); // from JWT context
                Users user = service.findByUsername(username);

                if (user == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }

                user.setPassword(null); // Hide sensitive data

                return ResponseEntity.ok(user);
            }

        @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody Users updatedUser, Authentication authentication) {
        String username = authentication.getName();
        Users user = service.findByUsername(username);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        user.setProfilePictureUrl(updatedUser.getProfilePictureUrl());

        Users savedUser = service.updateUser(user);
        savedUser.setPassword(null); // hide password again
        return ResponseEntity.ok(savedUser);
    }

    
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(Authentication authentication) {
        String username = authentication.getName();
        boolean deleted = service.deleteByUsername(username);

        if (!deleted) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok("User deleted successfully.");
    }
}



