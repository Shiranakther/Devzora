

package com.devzora.devzora.service;

import com.devzora.devzora.model.Users;
import com.devzora.devzora.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    @Lazy
    private JWTService jwtService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        // Get OAuth2 user info from the OAuth2 provider
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Log all attributes (optional, useful for debugging)
        Map<String, Object> attributes = oAuth2User.getAttributes();
        System.out.println("🔐 OAuth2User attributes: " + attributes);

        // Extract provider (Google, Facebook, etc.) and user details
        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("sub");  // Google: "sub", Facebook: "id"
        
        if (providerId == null) {
            providerId = oAuth2User.getAttribute("id");  // Facebook id
        }

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        if (email == null || providerId == null) {
            System.out.println("⚠️ Missing email or providerId. Cannot register user.");
            return oAuth2User;  // Let login continue, but skip user creation
        }

        // Generate a username from the email (part before '@')
        String username = email.split("@")[0];  // Use the part before '@' in the email

        // Check if user exists in the database using the email
        Users user = repo.findByEmail(email);

        if (user == null) {
            // Register a new user if they don't exist
            Users newUser = new Users();
            newUser.setUsername(username);  // Set the generated username
            newUser.setEmail(email);
            newUser.setProvider(provider);
            newUser.setProviderId(providerId);
            newUser.setPassword(null);  // No password needed for OAuth2
            repo.save(newUser);
            System.out.println("✅ New OAuth2 user created: " + email);
        } else {
            System.out.println("🔁 Existing OAuth2 user found: " + email);
        }

        // Generate a JWT token using the username (instead of email) and name
        String jwtToken = jwtService.generateToken(username, name); // Use username for the token
        System.out.println("✅ JWT Token generated: " + jwtToken);

        // Return the OAuth2User object, but you can also attach additional data like the token
        oAuth2User.getAttributes().put("jwtToken", jwtToken);  // Optional: add JWT token to the user attributes

        return oAuth2User;
    }
}




