package com.medivault.medical.service;

import com.medivault.appointment.entity.Appointment;
import com.medivault.appointment.repository.AppointmentRepository;
import com.medivault.medical.dto.TimelineEventDto;
import com.medivault.medical.entity.MedicalDocument;
import com.medivault.medical.entity.MedicalRecord;
import com.medivault.medical.entity.Prescription;
import com.medivault.medical.repository.MedicalDocumentRepository;
import com.medivault.medical.repository.MedicalRecordRepository;
import com.medivault.medical.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HealthTimelineServiceImpl implements HealthTimelineService {

    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository recordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicalDocumentRepository documentRepository;

    @Override
    public List<TimelineEventDto> getPatientTimeline(UUID patientId) {
        List<TimelineEventDto> timeline = new ArrayList<>();

        // 1. Appointments
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        appointments.forEach(app -> {
            timeline.add(TimelineEventDto.builder()
                    .eventType("APPOINTMENT")
                    .title("Appointment with Dr. " + app.getDoctor().getFullName())
                    .description("Status: " + app.getCurrentStatus())
                    // Fix: appointmentDate is LocalDate, need to convert to ZonedDateTime
                    .eventDate(app.getAppointmentDate().atTime(app.getAppointmentTime()).atZone(ZoneId.of("UTC")))
                    .eventData(app.getId())
                    .build());
        });

        // 2. Medical Records
        List<MedicalRecord> records = recordRepository.findByPatientIdOrderByVisitDateDesc(patientId);
        records.forEach(rec -> {
            timeline.add(TimelineEventDto.builder()
                    .eventType("MEDICAL_RECORD")
                    .title("Medical Record: " + rec.getRecordType())
                    .description("Diagnosis: " + rec.getDiagnosis())
                    .eventDate(rec.getVisitDate().atStartOfDay(ZoneId.of("UTC")))
                    .eventData(rec.getId())
                    .build());
        });

        // 3. Prescriptions
        List<Prescription> prescriptions = prescriptionRepository.findByPatientIdOrderByIssueDateDesc(patientId);
        prescriptions.forEach(rx -> {
            timeline.add(TimelineEventDto.builder()
                    .eventType("PRESCRIPTION")
                    .title("Prescription Issued")
                    .description(rx.getMedicines().size() + " medicines prescribed")
                    .eventDate(rx.getIssueDate().atStartOfDay(ZoneId.of("UTC")))
                    .eventData(rx.getId())
                    .build());
        });

        // 4. Documents
        List<MedicalDocument> docs = documentRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        docs.forEach(doc -> {
            timeline.add(TimelineEventDto.builder()
                    .eventType("DOCUMENT")
                    .title("Document Uploaded: " + doc.getDocumentType())
                    .description(doc.getFileName())
                    .eventDate(doc.getCreatedAt().atZone(ZoneId.of("UTC")))
                    .eventData(doc.getId())
                    .build());
        });

        // Sort completely descending
        timeline.sort(Comparator.comparing(TimelineEventDto::getEventDate).reversed());
        return timeline;
    }
}
