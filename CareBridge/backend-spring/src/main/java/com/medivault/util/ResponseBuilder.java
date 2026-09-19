package com.medivault.util;

import com.medivault.common.ApiResponse;
import com.medivault.common.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

/**
 * Utility class to build consistent API responses.
 */
public final class ResponseBuilder {

    private ResponseBuilder() {
        // Prevent instantiation
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return success(data, "Success");
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String message) {
        return success(data, message, HttpStatus.OK);
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String message, HttpStatus status) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
        return new ResponseEntity<>(response, status);
    }

    public static ResponseEntity<ApiResponse<Void>> error(String code, String message, HttpStatus status) {
        return error(code, message, Collections.emptyList(), status);
    }

    public static ResponseEntity<ApiResponse<Void>> error(String code, String message, List<String> details, HttpStatus status) {
        ErrorResponse errorDetails = ErrorResponse.builder()
                .code(code)
                .message(message)
                .details(details)
                .build();

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .message("Operation failed")
                .error(errorDetails)
                .build();

        return new ResponseEntity<>(response, status);
    }
}
