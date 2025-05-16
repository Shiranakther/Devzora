package com.devzora.devzora.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

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
    private String provider; // The OAuth2 provider (e.g., "google", "facebook")
    private String providerId; // The user ID from the OAuth2 provider
    private String name;
    private String email; // Optional: Store user's email
    private String phone;
    private String profilePictureUrl;
    private List<String> roles;
    private List<String> following = new ArrayList<>(); // Users this user follows
    private List<String> followers = new ArrayList<>(); // Users who follow this user
}