
// package com.devzora.devzora.service;

// import com.devzora.devzora.model.Users;
// import com.devzora.devzora.repo.UserRepo;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
// import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.stereotype.Service;

// @Service
// public class CustomOAuth2UserService extends DefaultOAuth2UserService {

//     @Autowired
//     private UserRepo repo;

//     @Override
//     public OAuth2User loadUser(OAuth2UserRequest userRequest) {
//         OAuth2User oAuth2User = super.loadUser(userRequest);

//         // Log all attributes
//         System.out.println("🔐 OAuth2User attributes: " + oAuth2User.getAttributes());

//         // Extract provider (e.g., "google")
//         String provider = userRequest.getClientRegistration().getRegistrationId();

//         // Try different key names to support various providers
//         String providerId = oAuth2User.getAttribute("sub");  // for Google
//         if (providerId == null) {
//             providerId = oAuth2User.getAttribute("id");      // for GitHub, Facebook
//         }

//         String email = oAuth2User.getAttribute("email");

//         if (email == null || providerId == null) {
//             System.out.println("⚠️ Missing email or providerId. Cannot register user.");
//             return oAuth2User;  // Let login continue, but skip user creation
//         }

//         // Check if user exists
//         Users user = repo.findByEmail(email);
     
//         if (user == null) {
//             // Register new user
//             Users newUser = new Users();
//             newUser.setUsername(email);
//             newUser.setEmail(email);
//             newUser.setProvider(provider);
//             newUser.setProviderId(providerId);
//             newUser.setPassword(null); // No password needed for OAuth2

//             repo.save(newUser);
//             System.out.println("✅ New OAuth2 user created: " + email);
//         } else {
//             System.out.println("🔁 Existing OAuth2 user found: " + email);
//         }

//         return oAuth2User;
//     }
// }

package com.devzora.devzora.service;

import com.devzora.devzora.model.Users;
import com.devzora.devzora.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepo repo;

    @Override
public OAuth2User loadUser(OAuth2UserRequest userRequest) {
    OAuth2User oAuth2User = super.loadUser(userRequest);

    // Log all attributes
    Map<String, Object> attributes = oAuth2User.getAttributes();
    System.out.println("🔐 OAuth2User attributes: " + attributes);

    // Extract provider and user details
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

    // Check if user exists in DB
    Users user = repo.findByEmail(email);

    if (user == null) {
        // Register new user
        Users newUser = new Users();
        newUser.setUsername(name);  // Store name as username or as needed
        newUser.setEmail(email);
        newUser.setProvider(provider);
        newUser.setProviderId(providerId);
        newUser.setPassword(null); // No password needed for OAuth2
        repo.save(newUser);
        System.out.println("✅ New OAuth2 user created: " + email);
    } else {
        System.out.println("🔁 Existing OAuth2 user found: " + email);
    }

    return oAuth2User;
}

    
}



