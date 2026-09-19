package com.medivault.security.entity;

import com.medivault.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "jwt_blacklist")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtBlacklist extends BaseEntity {

    @Column(nullable = false, unique = true, length = 1000)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;
}
