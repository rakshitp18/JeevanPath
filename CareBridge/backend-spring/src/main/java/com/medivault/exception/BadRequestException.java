package com.medivault.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when a request is malformed or invalid.
 */
public class BadRequestException extends CustomException {
    public BadRequestException(String message) {
        super(message, "BAD_REQUEST", HttpStatus.BAD_REQUEST);
    }
}
