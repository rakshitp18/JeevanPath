package com.medivault.medical.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class MedicineReminderDto {
    private UUID id;
    private UUID patientId;
    private String medicineName;
    private String dosage;
    private String instructions;
    private LocalTime reminderTime;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}
