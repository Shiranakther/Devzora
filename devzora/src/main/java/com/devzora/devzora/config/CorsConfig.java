package com.devzora.devzora.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Adjust your frontend URL here
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("*"));
        config.setAllowCredentials(true); 
        config.setExposedHeaders(List.of("Authorization"));

        // Use the correct UrlBasedCorsConfigurationSource from the standard package
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);  // Apply CORS to all endpoints

        return source;  // Return as CorsConfigurationSource
    }
}
