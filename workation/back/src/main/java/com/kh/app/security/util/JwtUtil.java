package com.kh.app.security.util;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    private final SecretKey secretKey;

    @Value("${jwt.expiration}")
    private Long expirationMs;

    public JwtUtil(@Value("${jwt.secret}") String secretStr) {

        byte[] bytes = secretStr.getBytes(StandardCharsets.UTF_8);

        String algorithm = Jwts.SIG.HS256
                .key()
                .build()
                .getAlgorithm();

        this.secretKey = new SecretKeySpec(bytes, algorithm);
    }

    public String createJwt(Long memberId, String username, List<String> roles) {

        return Jwts.builder()
                .claim("memberId", memberId)
                .claim("username", username)
                .claim("roles", roles)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    public String getUsername(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("username", String.class);
    }

    public List<String> getRoles(String token) {

        List<?> roles = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("roles", List.class);

        return roles.stream()
                .map(String::valueOf)
                .toList();
    }

    public Boolean isExpired(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }

    public Long getMemberId(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("memberId", Long.class);
    }
}