package com.devzora.devzora.component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

import com.devzora.devzora.service.JWTService;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JWTService jwtService;

    
    public CustomOAuth2SuccessHandler(JWTService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Extract user email or username
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Generate token using the injected service
        String token = jwtService.generateToken(email,name);

        // Redirect with token
        response.sendRedirect("http://localhost:5173/callback?token=" + token);
    }
}
