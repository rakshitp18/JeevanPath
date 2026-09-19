package com.medivault.doctor.repository;

import com.medivault.doctor.entity.DoctorDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DoctorDocumentRepository extends JpaRepository<DoctorDocument, UUID> {
    List<DoctorDocument> findByDoctorId(UUID doctorId);
}
