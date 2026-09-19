package com.medivault.medical.repository;

import com.medivault.medical.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
    List<MedicalRecord> findByPatientIdOrderByVisitDateDesc(UUID patientId);
    List<MedicalRecord> findByDoctorIdOrderByVisitDateDesc(UUID doctorId);
}
