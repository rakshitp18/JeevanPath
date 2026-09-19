package com.medivault.security.repository;

import com.medivault.security.entity.SecureToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SecureTokenRepository extends JpaRepository<SecureToken, UUID> {
    Optional<SecureToken> findByTokenAndTokenType(String token, String tokenType);
    void deleteByUserIdAndTokenType(UUID userId, String tokenType);
}
