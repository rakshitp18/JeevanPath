package com.medivault.medical.service;

import com.medivault.appointment.entity.Appointment;
import com.medivault.appointment.repository.AppointmentRepository;
import com.medivault.doctor.entity.Doctor;
import com.medivault.medical.dto.TimelineEventDto;
import com.medivault.medical.entity.MedicalDocument;
import com.medivault.medical.entity.MedicalRecord;
import com.medivault.medical.entity.Prescription;
import com.medivault.medical.repository.MedicalDocumentRepository;
import com.medivault.medical.repository.MedicalRecordRepository;
import com.medivault.medical.repository.PrescriptionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HealthTimelineServiceImplTest {

    @Mock private AppointmentRepository appointmentRepository;
    @Mock private MedicalRecordRepository recordRepository;
    @Mock private PrescriptionRepository prescriptionRepository;
    @Mock private MedicalDocumentRepository documentRepository;

    @InjectMocks
    private HealthTimelineServiceImpl timelineService;

    private UUID patientId;

    @BeforeEach
    void setUp() {
        patientId = UUID.randomUUID();
    }

    @Test
    void testGetPatientTimeline_Sorting() {
        // Create an appointment today
        Appointment app = new Appointment();
        app.setId(UUID.randomUUID());
        Doctor doc = new Doctor();
        doc.setFullName("Test Doc");
        app.setDoctor(doc);
        app.setAppointmentDate(LocalDate.now());
        app.setAppointmentTime(LocalTime.of(10, 0));

        // Create a record yesterday
        MedicalRecord record = new MedicalRecord();
        record.setId(UUID.randomUUID());
        record.setVisitDate(LocalDate.now().minusDays(1));
        record.setRecordType("General");

        // Create a document tomorrow (just for test)
        MedicalDocument docUpload = new MedicalDocument();
        docUpload.setId(UUID.randomUUID());
        docUpload.setCreatedAt(java.time.Instant.now().plus(1, java.time.temporal.ChronoUnit.DAYS));
        docUpload.setDocumentType("Lab Report");
        docUpload.setFileName("test.pdf");

        when(appointmentRepository.findByPatientId(patientId)).thenReturn(List.of(app));
        when(recordRepository.findByPatientIdOrderByVisitDateDesc(patientId)).thenReturn(List.of(record));
        when(prescriptionRepository.findByPatientIdOrderByIssueDateDesc(patientId)).thenReturn(List.of());
        when(documentRepository.findByPatientIdOrderByCreatedAtDesc(patientId)).thenReturn(List.of(docUpload));

        List<TimelineEventDto> timeline = timelineService.getPatientTimeline(patientId);

        assertEquals(3, timeline.size());
        // Should be ordered by date descending (Newest first)
        assertEquals("DOCUMENT", timeline.get(0).getEventType()); // Tomorrow
        assertEquals("APPOINTMENT", timeline.get(1).getEventType()); // Today
        assertEquals("MEDICAL_RECORD", timeline.get(2).getEventType()); // Yesterday
    }
}
