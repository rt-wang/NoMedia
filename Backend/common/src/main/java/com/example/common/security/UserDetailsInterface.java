package com.example.common.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public interface UserDetailsInterface extends UserDetails {
    Long getId();
    String getEmail();
    List<SimpleGrantedAuthority> getAuthorities();
}
