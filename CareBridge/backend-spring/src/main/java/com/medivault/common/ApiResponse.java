package com.medivault.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Enterprise API Response Wrapper with ISO-8601 timestamps and standard metadata.
 *
 * @param <T> Response Payload Type
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    @Builder.Default
    private boolean success = true;
    private String message;
    private T data;
    private ErrorResponse error;

    @Builder.Default
    private String timestamp = Instant.now().toString();

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now().toString())
                .build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Operation completed successfully");
    }

    public static <T> ApiResponse<T> error(String message, ErrorResponse errorDetails) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .error(errorDetails)
                .timestamp(Instant.now().toString())
                .build();
    }
}
