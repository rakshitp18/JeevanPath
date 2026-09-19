package com.medivault.patient.repository;

import com.medivault.patient.entity.InsuranceInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InsuranceInformationRepository extends JpaRepository<InsuranceInformation, UUID> {
    Optional<InsuranceInformation> findByPatientId(UUID patientId);
}
