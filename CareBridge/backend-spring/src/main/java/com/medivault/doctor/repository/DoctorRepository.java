package com.medivault.doctor.repository;

import com.medivault.doctor.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    Optional<Doctor> findByUserId(UUID userId);
    boolean existsByMedicalRegistrationNumber(String medicalRegistrationNumber);
}
