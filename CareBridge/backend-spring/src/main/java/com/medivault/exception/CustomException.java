package com.medivault.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base custom exception for the application.
 */
@Getter
public class CustomException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus status;

    public CustomException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }
}
