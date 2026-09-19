package com.medivault.doctor.repository;

import com.medivault.doctor.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, UUID> {
    List<DoctorAvailability> findByDoctorId(UUID doctorId);
    Optional<DoctorAvailability> findByIdAndDoctorId(UUID id, UUID doctorId);
    List<DoctorAvailability> findByDoctorIdAndDayOfWeek(UUID doctorId, String dayOfWeek);
}
