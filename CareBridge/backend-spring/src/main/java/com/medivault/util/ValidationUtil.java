package com.medivault.util;

import java.util.regex.Pattern;

/**
 * Utility class for common validation logic.
 */
public final class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@(.+)$"
    );

    private ValidationUtil() {
        // Prevent instantiation
    }

    /**
     * Basic email format validation.
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }
}
