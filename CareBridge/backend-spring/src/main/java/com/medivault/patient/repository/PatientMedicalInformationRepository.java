package com.medivault.patient.repository;

import com.medivault.patient.entity.PatientMedicalInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientMedicalInformationRepository extends JpaRepository<PatientMedicalInformation, UUID> {
    Optional<PatientMedicalInformation> findByPatientId(UUID patientId);
}
