package com.example.common.security;

import org.springframework.security.core.userdetails.UserDetails;


public interface UserDetailsInterface extends UserDetails {
    Long getId();
    String getEmail();
}
