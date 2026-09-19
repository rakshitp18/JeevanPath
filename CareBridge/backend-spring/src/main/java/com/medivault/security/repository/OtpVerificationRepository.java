package com.medivault.security.repository;

import com.medivault.security.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, UUID> {
    Optional<OtpVerification> findFirstByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc(String email, String purpose);
}
