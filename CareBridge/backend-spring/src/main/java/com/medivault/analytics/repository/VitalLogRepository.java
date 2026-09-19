package com.medivault.analytics.repository;

import com.medivault.analytics.entity.VitalLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VitalLogRepository extends JpaRepository<VitalLog, UUID> {
    List<VitalLog> findByPatientIdOrderByDateDesc(UUID patientId);
    Optional<VitalLog> findFirstByPatientIdOrderByDateDesc(UUID patientId);
}
