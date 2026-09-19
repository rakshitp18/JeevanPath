package com.medivault.medical.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PrescriptionDto {
    private UUID id;
    private UUID medicalRecordId;
    private UUID doctorId;
    private String doctorName;
    private UUID patientId;
    private String patientName;
    private String prescriptionNumber;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String notes;
    private String pdfUrl;
    private List<PrescriptionMedicineDto> medicines;
}
