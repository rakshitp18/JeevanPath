package com.medivault.medical.repository;

import com.medivault.medical.entity.MedicalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, UUID> {
    List<MedicalDocument> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
    List<MedicalDocument> findBySharedDoctors_IdOrderByCreatedAtDesc(UUID doctorId);
}
