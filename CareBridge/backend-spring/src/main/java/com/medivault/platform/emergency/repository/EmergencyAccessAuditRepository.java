package com.medivault.platform.emergency.repository;

import com.medivault.platform.emergency.entity.EmergencyAccessAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EmergencyAccessAuditRepository extends JpaRepository<EmergencyAccessAudit, UUID> {
}
