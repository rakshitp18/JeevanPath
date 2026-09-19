package com.medivault.medical.service;

import com.medivault.appointment.entity.Appointment;
import com.medivault.appointment.repository.AppointmentRepository;
import com.medivault.doctor.entity.Doctor;
import com.medivault.doctor.repository.DoctorRepository;
import com.medivault.exception.BadRequestException;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.medical.dto.CreateMedicalRecordRequest;
import com.medivault.medical.dto.MedicalRecordDto;
import com.medivault.medical.entity.MedicalRecord;
import com.medivault.medical.mapper.MedicalMapper;
import com.medivault.medical.repository.MedicalRecordRepository;
import com.medivault.patient.entity.Patient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository recordRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalMapper mapper;
    private final com.medivault.common.service.CloudinaryService cloudinaryService;
    private final com.medivault.medical.repository.MedicalDocumentRepository documentRepository;
    private final com.medivault.patient.repository.PatientRepository patientRepository;

    @Override
    @Transactional
    public MedicalRecordDto createRecord(UUID userId, CreateMedicalRecordRequest request) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("Unauthorized: Appointment is not assigned to this doctor");
        }

        Patient patient = appointment.getPatient();

        MedicalRecord record = MedicalRecord.builder()
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .recordType(request.getRecordType())
                .visitDate(LocalDate.now())
                .diagnosis(request.getDiagnosis())
                .chiefComplaint(request.getChiefComplaint())
                .clinicalNotes(request.getClinicalNotes())
                .treatmentPlan(request.getTreatmentPlan())
                .followUpDate(request.getFollowUpDate())
                .status("CREATED")
                .build();

        return mapper.toRecordDto(recordRepository.save(record));
    }

    @Override
    public List<MedicalRecordDto> getPatientRecords(UUID patientId) {
        return mapper.toRecordDtoList(recordRepository.findByPatientIdOrderByVisitDateDesc(patientId));
    }

    @Override
    public List<MedicalRecordDto> getDoctorRecords(UUID doctorId) {
        return mapper.toRecordDtoList(recordRepository.findByDoctorIdOrderByVisitDateDesc(doctorId));
    }

    @Override
    public MedicalRecordDto getRecordDetails(UUID recordId) {
        return mapper.toRecordDto(recordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record not found")));
    }

    @Override
    public List<com.medivault.medical.dto.MedicalDocumentDto> getPatientDocuments(UUID patientId) {
        return documentRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(mapper::toDocumentDto)
                .toList();
    }

    @Override
    public List<com.medivault.medical.dto.MedicalDocumentDto> getDoctorDocuments(UUID doctorId) {
        return documentRepository.findBySharedDoctors_IdOrderByCreatedAtDesc(doctorId).stream()
                .map(mapper::toDocumentDto)
                .toList();
    }

    @Override
    @Transactional
    public com.medivault.medical.dto.MedicalDocumentDto uploadDocument(UUID patientId, org.springframework.web.multipart.MultipartFile file, String title, String documentType, String description, String doctorIds) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        try {
            java.util.Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, "medivault/documents");
            String fileUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            com.medivault.medical.entity.MedicalDocument document = com.medivault.medical.entity.MedicalDocument.builder()
                    .patient(patient)
                    .title(title)
                    .description(description)
                    .documentType(documentType)
                    .fileName(file.getOriginalFilename())
                    .cloudinaryUrl(fileUrl)
                    .publicId(publicId)
                    .ocrStatus("PENDING")
                    .build();

            // Parse array of doctor UUIDs
            if (doctorIds != null && !doctorIds.isEmpty()) {
                try {
                    String cleanIds = doctorIds.replaceAll("[\"\\[\\]\\\\]", "");
                    if (!cleanIds.trim().isEmpty()) {
                        for (String idStr : cleanIds.split(",")) {
                            String id = idStr.trim();
                            if (!id.isEmpty()) {
                                Doctor doc = doctorRepository.findById(UUID.fromString(id)).orElse(null);
                                if (doc != null) {
                                    document.getSharedDoctors().add(doc);
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    // Ignore parsing errors for doctors
                }
            }

            document = documentRepository.save(document);
            return mapper.toDocumentDto(document);

        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to upload document to Cloudinary", e);
        }
    }
}
