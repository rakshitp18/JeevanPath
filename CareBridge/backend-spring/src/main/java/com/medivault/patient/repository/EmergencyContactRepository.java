package com.medivault.patient.repository;

import com.medivault.patient.entity.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, UUID> {
    List<EmergencyContact> findByPatientId(UUID patientId);
    Optional<EmergencyContact> findByIdAndPatientId(UUID id, UUID patientId);
}
