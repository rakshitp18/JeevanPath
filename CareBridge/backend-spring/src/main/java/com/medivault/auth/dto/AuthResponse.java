package com.medivault.auth.dto;

import com.medivault.constants.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private UserDto user;

    @Data
    @Builder
    public static class UserDto {
        private UUID id;
        private String email;
        private Role role;
        private boolean emailVerified;
        private boolean active;
        private Instant createdAt;
        private Instant updatedAt;
        private ProfileDto profile;
    }

    @Data
    @Builder
    public static class ProfileDto {
        private String fullName;
        private String profileImage;
    }
}
