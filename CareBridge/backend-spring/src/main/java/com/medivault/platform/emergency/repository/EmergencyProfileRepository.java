package com.medivault.platform.emergency.repository;

import com.medivault.platform.emergency.entity.EmergencyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmergencyProfileRepository extends JpaRepository<EmergencyProfile, UUID> {
    Optional<EmergencyProfile> findByPatientId(UUID patientId);
    Optional<EmergencyProfile> findByAccessToken(String accessToken);
}
