package com.medivault.medical.repository;

import com.medivault.medical.entity.MedicineReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicineReminderRepository extends JpaRepository<MedicineReminder, UUID> {
    List<MedicineReminder> findByPatientIdAndStatus(UUID patientId, String status);
}
