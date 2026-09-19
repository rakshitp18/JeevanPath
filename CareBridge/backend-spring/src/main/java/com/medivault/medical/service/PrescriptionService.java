package com.medivault.medical.service;

import com.medivault.medical.dto.IssuePrescriptionRequest;
import com.medivault.medical.dto.PrescriptionDto;

import java.util.List;
import java.util.UUID;

public interface PrescriptionService {
    PrescriptionDto issuePrescription(UUID userId, UUID medicalRecordId, IssuePrescriptionRequest request);
    List<PrescriptionDto> getPatientPrescriptions(UUID patientId);
}
