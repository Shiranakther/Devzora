package com.devzora.devzora.model;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@Document(collection = "users")
@Getter
@Setter
@ToString

public class Users {

    @Id
    private String id;
    
    private String username;
    private String password;
    private String provider;  // The OAuth2 provider (e.g., "google", "facebook")
    private String providerId; // The user ID from the OAuth2 provider
    private String name; 
    private String email;  // Optional: Store user's email
    private String phone;
    private String profilePictureUrl;
    private List<String> roles;
    private List<String> purchasedCourses;


}
