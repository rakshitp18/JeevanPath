package com.medivault.medical.service;

import com.medivault.medical.entity.MedicineReminder;
import com.medivault.medical.entity.Prescription;
import com.medivault.medical.entity.PrescriptionMedicine;
import com.medivault.medical.repository.MedicineReminderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderEngineServiceImpl implements ReminderEngineService {

    private final MedicineReminderRepository reminderRepository;

    @Override
    public void generateReminders(Prescription prescription) {
        for (PrescriptionMedicine medicine : prescription.getMedicines()) {
            if (Boolean.TRUE.equals(medicine.getMorning())) {
                createReminder(prescription, medicine, LocalTime.of(8, 0));
            }
            if (Boolean.TRUE.equals(medicine.getAfternoon())) {
                createReminder(prescription, medicine, LocalTime.of(13, 0));
            }
            if (Boolean.TRUE.equals(medicine.getEvening())) {
                createReminder(prescription, medicine, LocalTime.of(18, 0));
            }
            if (Boolean.TRUE.equals(medicine.getNight())) {
                createReminder(prescription, medicine, LocalTime.of(21, 0));
            }
        }
        log.info("Generated reminders for prescription: {}", prescription.getPrescriptionNumber());
    }

    private void createReminder(Prescription prescription, PrescriptionMedicine medicine, LocalTime time) {
        MedicineReminder reminder = MedicineReminder.builder()
                .prescriptionMedicine(medicine)
                .patient(prescription.getPatient())
                .reminderTime(time)
                .startDate(prescription.getIssueDate())
                .endDate(prescription.getIssueDate().plusDays(medicine.getDurationDays()))
                .status("ACTIVE")
                .build();
        reminderRepository.save(reminder);
    }
}
