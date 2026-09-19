package com.medivault.medical.service;

import com.medivault.doctor.entity.Doctor;
import com.medivault.doctor.repository.DoctorRepository;
import com.medivault.exception.BadRequestException;
import com.medivault.medical.dto.IssuePrescriptionRequest;
import com.medivault.medical.entity.MedicalRecord;
import com.medivault.medical.entity.Prescription;
import com.medivault.medical.repository.MedicalRecordRepository;
import com.medivault.medical.repository.PrescriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PrescriptionServiceImplTest {

    @Mock private PrescriptionRepository prescriptionRepository;
    @Mock private MedicalRecordRepository recordRepository;
    @Mock private DoctorRepository doctorRepository;
    @Mock private PdfGeneratorService pdfService;
    @Mock private ReminderEngineService reminderService;

    @InjectMocks
    private PrescriptionServiceImpl prescriptionService;

    private UUID userId;
    private UUID recordId;
    private Doctor doctor;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        recordId = UUID.randomUUID();
        doctor = new Doctor();
        doctor.setId(UUID.randomUUID());
    }

    @Test
    void testIssuePrescription_UnauthorizedDoctor() {
        Doctor otherDoctor = new Doctor();
        otherDoctor.setId(UUID.randomUUID());

        MedicalRecord record = new MedicalRecord();
        record.setDoctor(otherDoctor); // Belongs to someone else

        when(doctorRepository.findByUserId(userId)).thenReturn(Optional.of(doctor));
        when(recordRepository.findById(recordId)).thenReturn(Optional.of(record));

        IssuePrescriptionRequest request = new IssuePrescriptionRequest();

        assertThrows(BadRequestException.class, () -> {
            prescriptionService.issuePrescription(userId, recordId, request);
        });
    }

    @Test
    void testIssuePrescription_AlreadyExists() {
        MedicalRecord record = new MedicalRecord();
        record.setDoctor(doctor);
        record.setPrescription(new Prescription()); // Already has prescription

        when(doctorRepository.findByUserId(userId)).thenReturn(Optional.of(doctor));
        when(recordRepository.findById(recordId)).thenReturn(Optional.of(record));

        IssuePrescriptionRequest request = new IssuePrescriptionRequest();

        assertThrows(BadRequestException.class, () -> {
            prescriptionService.issuePrescription(userId, recordId, request);
        });
    }
}
