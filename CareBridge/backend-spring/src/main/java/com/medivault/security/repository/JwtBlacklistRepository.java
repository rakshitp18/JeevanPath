package com.medivault.security.repository;

import com.medivault.security.entity.JwtBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface JwtBlacklistRepository extends JpaRepository<JwtBlacklist, UUID> {
    boolean existsByToken(String token);
    void deleteByExpiresAtBefore(Instant now);
}
