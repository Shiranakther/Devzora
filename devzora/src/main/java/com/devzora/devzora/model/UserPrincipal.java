package com.devzora.devzora.model;

import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class UserPrincipal implements UserDetails {

    private Users user;

    public UserPrincipal(Users user) {  
        this.user = user;
    }

   

    // @Override
    // public Collection<? extends GrantedAuthority> getAuthorities() {
    //     // Return the authorities granted to the user
    //     return Collections.singleton(new SimpleGrantedAuthority("USER")); // Implement this method based on your requirements
    // }

     @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
            .collect(Collectors.toList());
    }


    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    

   
    // Implement other methods from UserDetails interface as needed
    



}
