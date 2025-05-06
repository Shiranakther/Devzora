
// package com.devzora.devzora.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.*;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.AuthenticationProvider;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.*;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.*;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import com.devzora.devzora.component.CustomOAuth2SuccessHandler;
// import com.devzora.devzora.filter.JWTFilter;
// import com.devzora.devzora.service.CustomOAuth2UserService;
// import com.devzora.devzora.service.MyUserDetailsService;
// import org.springframework.web.cors.CorsConfigurationSource;


// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     private final CustomOAuth2UserService customOAuth2UserService;

//     @Autowired
//     private MyUserDetailsService userDetailsService;

//     @Autowired
//     private JWTFilter jwtFilter;

//     @Autowired
//     private CorsConfigurationSource corsConfigurationSource;

//     @Autowired
//     private CustomOAuth2SuccessHandler successHandler;


//     SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
//         this.customOAuth2UserService = customOAuth2UserService;
//     } // Assuming you have a JWTFilter class for token validation

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         return http
//              .cors(cors -> cors.configurationSource(corsConfigurationSource))
//             .csrf(csrf -> csrf.disable())
       
//                 .authorizeHttpRequests(auth -> auth
//             .requestMatchers("/register", "/login", "/").permitAll()
//             .requestMatchers("api/admin/**").hasRole("ADMIN")
//             .requestMatchers("api/instructor/**").hasAnyRole("INSTRUCTOR", "ADMIN")
//             .requestMatchers("api/user/**").hasAnyRole("USER", "ADMIN")
//             .anyRequest().authenticated()
//         )



//         .oauth2Login(oauth2 -> oauth2
//         .userInfoEndpoint(userInfo -> userInfo
//             .userService(customOAuth2UserService)
            
//         ) .successHandler(successHandler)// You can change this to any success URL
//         )
        
        
//             .httpBasic(Customizer.withDefaults())
//             .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//             .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter before the authentication filter
//             .build();
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder(12); // Set strength to 13
//     }

//     @Bean
//     public AuthenticationProvider authenticationProvider() {
//         DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//         provider.setUserDetailsService(userDetailsService);
//         provider.setPasswordEncoder(passwordEncoder());
//         return provider;
//     }

//     @Bean
//     public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
//         return config.getAuthenticationManager();
//     }
    
// }

package com.devzora.devzora.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.devzora.devzora.component.CustomOAuth2SuccessHandler;
import com.devzora.devzora.filter.JWTFilter;
import com.devzora.devzora.service.CustomOAuth2UserService;
import com.devzora.devzora.service.MyUserDetailsService;
import org.springframework.web.cors.*;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Autowired
    private JWTFilter jwtFilter;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource; // Injecting custom CORS configuration

    @Autowired
    private CustomOAuth2SuccessHandler successHandler;

    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))  // Apply CORS configuration
            .csrf(csrf -> csrf.disable()) // Disable CSRF protection for stateless APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/register", "/login", "/","/oauth2/**","/login/oauth2/**").permitAll()  // Allow these endpoints to be accessed without authentication
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Only users with the "ADMIN" role can access these endpoints
                .requestMatchers("/api/instructor/**").hasAnyRole("INSTRUCTOR", "ADMIN") // Allow both "INSTRUCTOR" and "ADMIN" roles
                .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN") // Allow "USER" and "ADMIN" roles
                .anyRequest().authenticated()  // Require authentication for any other request
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService)) // Custom OAuth2 user service
                .successHandler(successHandler) // Custom OAuth2 success handler
            )
            .httpBasic(Customizer.withDefaults()) // Enable HTTP Basic Authentication
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless sessions
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // JWT filter before authentication
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);  // Using BCryptPasswordEncoder with a strength of 12
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);  // Use custom user details service
        provider.setPasswordEncoder(passwordEncoder());  // Use the password encoder
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();  // Get the AuthenticationManager
    }
}
