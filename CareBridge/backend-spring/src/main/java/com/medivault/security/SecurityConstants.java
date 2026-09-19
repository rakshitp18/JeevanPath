package com.medivault.security;

/**
 * Security-specific constants.
 */
public final class SecurityConstants {

    private SecurityConstants() {
        // Prevent instantiation
    }

    public static final String[] PUBLIC_URLS = {
            "/",
            "/index.html",
            "/hospital.png",
            "/*.png",
            "/*.jpg",
            "/*.svg",
            "/swagger-ui-custom.css",
            "/favicon.ico",
            "/api/auth/**",
            "/api/public/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };
}
