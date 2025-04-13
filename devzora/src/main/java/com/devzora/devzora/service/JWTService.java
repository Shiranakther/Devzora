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
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JWTService {

    private final CustomOAuth2UserService customOAuth2UserService;

    private String secretKey;

    public JWTService(CustomOAuth2UserService customOAuth2UserService) {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey sk = keyGen.generateKey();
            secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating secret key", e);
        }
        this.customOAuth2UserService = customOAuth2UserService;
    }
    
    public String generateToken(String email, String name) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("name", name); // ✅ Include name
    
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
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
