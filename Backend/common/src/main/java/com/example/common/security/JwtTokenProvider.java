package com.example.common.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import io.jsonwebtoken.io.Decoders;
import java.util.Collections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.annotation.PostConstruct;

@Component
public class JwtTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.expiration}")
    private int jwtExpirationInMs;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private Key key;

    @PostConstruct
    public void init() {
        // Remove any whitespace from the secret
        String cleanedSecret = jwtSecret.replaceAll("\\s+", "");
        // Decode the Base64 encoded secret
        byte[] keyBytes = Decoders.BASE64.decode(cleanedSecret);
        // Create the key
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserDetailsInterface userPrincipal = (UserDetailsInterface) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .claim("username", userPrincipal.getUsername())
                .claim("email", userPrincipal.getEmail())
                .claim("authorities", userPrincipal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String subjectString = claims.getSubject();
        return Long.parseLong(subjectString);
    }

    public boolean validateToken(String authToken) {
        logger.info("Validating token: {}", authToken);
        logger.info("JWT Secret: {}", jwtSecret);
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }

    public List<SimpleGrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        List<?> authorities = claims.get("authorities", List.class);
        if (authorities != null) {
            return authorities.stream()
                    .map(auth -> new SimpleGrantedAuthority(auth.toString()))
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

}
