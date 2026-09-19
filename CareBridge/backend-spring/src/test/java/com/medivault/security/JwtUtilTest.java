package com.medivault.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class JwtUtilTest {

    private JwtUtil jwtUtil;
    private UserDetails userDetails;
    private final String testEmail = "test@example.com";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // Inject properties via reflection since we are instantiating manually
        ReflectionTestUtils.setField(jwtUtil, "secret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationInMs", 86400000L);

        userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn(testEmail);
    }

    @Test
    void testGenerateToken() {
        String token = jwtUtil.generateToken(userDetails);
        assertNotNull(token);
    }

    @Test
    void testExtractUsername() {
        String token = jwtUtil.generateToken(userDetails);
        String extractedEmail = jwtUtil.extractUsername(token);
        assertEquals(testEmail, extractedEmail);
    }

    @Test
    void testIsTokenValid() {
        String token = jwtUtil.generateToken(userDetails);
        assertTrue(jwtUtil.isTokenValid(token, userDetails));
    }
}
