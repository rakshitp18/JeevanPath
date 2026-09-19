package com.medivault.doctor.repository;

import com.medivault.doctor.entity.DoctorLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave, UUID> {
    List<DoctorLeave> findByDoctorId(UUID doctorId);
    Optional<DoctorLeave> findByIdAndDoctorId(UUID id, UUID doctorId);
}
