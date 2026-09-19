package com.medivault.auth.dto;

import com.medivault.constants.enums.AccountStatus;
import com.medivault.constants.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Role role;
    private AccountStatus accountStatus;
    private boolean emailVerified;
    private Instant createdAt;
    private Instant lastLogin;
}
