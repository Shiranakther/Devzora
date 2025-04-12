// package com.devzora.devzora.service;

// import java.security.Key;
// import java.security.NoSuchAlgorithmException;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.Base64.Decoder;

// import javax.crypto.KeyGenerator;

// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.stereotype.Service;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.core.userdetails.UserDetails;

// @Service
// public class  JWTService {

//     private String secretKey = "";

//     public JWTService(){
//         try{
//             KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
//             SecretKey sk = keyGen.generateKey();
//             secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
//         }catch (NoSuchAlgorithmException e){
//             throw new RuntimeException("Error generating secret key", e);
//         }
        
//     }



//     public String generateToken(){
        
//         Map<String ,Object> claims = new HashMap<>();
        
//         return Jwts.builder()
//                 .claims(claims)
//                 .add(claims)
//                 .subject(username)
//                 .issuedAt(new Date(System.currentTimeMillis()*60*60*30))
//                 .and()
//                 .signWith(getKey())
//                 .compact();
//         return "token";
//     }

//     private Key getKey() {
//         byte[] keyBytes = Decoder.Base64.decode(secretKey);
//         return Keys.hmacShaKeyFor(keyBytes);
//     }

// }


// package com.devzora.devzora.service;

// import java.security.Key;
// import java.security.NoSuchAlgorithmException;
// import java.util.Base64;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;

// import javax.crypto.KeyGenerator;
// import javax.crypto.SecretKey;

// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.security.Keys;

// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.stereotype.Service;

// @Service
// public class JWTService {

//     private String secretKey;

//     public JWTService() {
//         try {
//             KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
//             SecretKey sk = keyGen.generateKey();
//             secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
//         } catch (NoSuchAlgorithmException e) {
//             throw new RuntimeException("Error generating secret key", e);
//         }
//     }

//     public String generateToken(String username) {
//         Map<String, Object> claims = new HashMap<>();

//         return Jwts.builder()
//                 .claims(claims)
//                 .subject(username)
//                 .issuedAt(new Date(System.currentTimeMillis()+ 60*60*30))
//                 // Removed the invalid .and() method
//                 .signWith(getKey())
//                 .compact();
//     }

//     private Key getKey() {
//         byte[] keyBytes = Base64.getDecoder().decode(secretKey);
//         return Keys.hmacShaKeyFor(keyBytes);
//     }

//     public String extractUsername(String token) {
//         return "";
//     }

//     public boolean validateToken(String token, UserDetails userDetails) {
//         return true;
//     }
// }


package com.devzora.devzora.service;

import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JWTService {

    private String secretKey;

    public JWTService() {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();
            secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating secret key", e);
        }
    }
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
    
        // Adding claims if needed, you can customize the claims map
        // Example: claims.put("role", "admin");
    
        return Jwts.builder()
                .setClaims(claims) // Add claims to the JWT builder
                .setSubject(username) // Set the username as the subject
                .setIssuedAt(new Date(System.currentTimeMillis())) // Set issue date
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Set expiration time (10 hours)
                .signWith(getKey()) // Sign with the secret key
                .compact(); // Generate the JWT token as a string
    }
    

    private Key getKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        final Date expiration = getClaims(token).getExpiration();
        return expiration.before(new Date());
    }

    private Claims getClaims(String token) {
        JwtParser parser = Jwts
                .parserBuilder()
                .setSigningKey(getKey())
                .build();
                
        return parser
                .parseClaimsJws(token)
                .getBody();
    }
}
