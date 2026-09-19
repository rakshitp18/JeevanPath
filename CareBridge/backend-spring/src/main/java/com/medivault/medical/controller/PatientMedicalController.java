package com.medivault.medical.controller;

import com.medivault.common.ApiResponse;
import com.medivault.medical.dto.MedicalRecordDto;
import com.medivault.medical.dto.PrescriptionDto;
import com.medivault.medical.service.MedicalRecordService;
import com.medivault.medical.service.PrescriptionService;
import com.medivault.patient.repository.PatientRepository;
import com.medivault.security.CustomUserDetails;
import com.medivault.util.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
@Tag(name = "Patient Medical Records", description = "Endpoints for patients to view their medical records")
@PreAuthorize("hasRole('PATIENT')")
@SecurityRequirement(name = "bearerAuth")
public class PatientMedicalController {

    private final MedicalRecordService recordService;
    private final PrescriptionService prescriptionService;
    private final PatientRepository patientRepository;
    private final com.medivault.doctor.repository.DoctorRepository doctorRepository;

    @GetMapping("/records")
    @Operation(summary = "Get all my medical records")
    public ResponseEntity<ApiResponse<List<com.medivault.medical.dto.MedicalDocumentDto>>> getMyRecords(@AuthenticationPrincipal CustomUserDetails user) {
        UUID patientId = patientRepository.findByUserId(user.getId()).orElseThrow().getId();
        return ResponseBuilder.success(recordService.getPatientDocuments(patientId), "Records retrieved successfully");
    }

    @GetMapping("/records/{id}")
    @Operation(summary = "Get specific medical record details")
    public ResponseEntity<ApiResponse<MedicalRecordDto>> getRecordDetails(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        return ResponseBuilder.success(recordService.getRecordDetails(id), "Record retrieved successfully");
    }

    @GetMapping("/prescriptions")
    @Operation(summary = "Get all my prescriptions")
    public ResponseEntity<ApiResponse<List<PrescriptionDto>>> getMyPrescriptions(@AuthenticationPrincipal CustomUserDetails user) {
        UUID patientId = patientRepository.findByUserId(user.getId()).orElseThrow().getId();
        return ResponseBuilder.success(prescriptionService.getPatientPrescriptions(patientId), "Prescriptions retrieved successfully");
    }

    @org.springframework.web.bind.annotation.PostMapping(value = "/records/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a medical record to Cloudinary")
    public ResponseEntity<ApiResponse<com.medivault.medical.dto.MedicalDocumentDto>> uploadRecord(
            @AuthenticationPrincipal CustomUserDetails user,
            @org.springframework.web.bind.annotation.RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @org.springframework.web.bind.annotation.RequestParam("title") String title,
            @org.springframework.web.bind.annotation.RequestParam("documentType") String documentType,
            @org.springframework.web.bind.annotation.RequestParam(value = "description", required = false) String description,
            @org.springframework.web.bind.annotation.RequestParam(value = "permission", required = false) String permission,
            @org.springframework.web.bind.annotation.RequestParam(value = "expiry", required = false) String expiry,
            @org.springframework.web.bind.annotation.RequestParam(value = "doctorIds", required = false) String doctorIds) {
        
        UUID patientId = patientRepository.findByUserId(user.getId()).orElseThrow().getId();
        com.medivault.medical.dto.MedicalDocumentDto documentDto = recordService.uploadDocument(patientId, file, title, documentType, description, doctorIds);
        
        return ResponseBuilder.success(documentDto, "Medical document uploaded successfully");
    }
    @org.springframework.web.bind.annotation.GetMapping("/doctors")
    @Operation(summary = "Get list of all doctors for sharing documents")
    public ResponseEntity<ApiResponse<List<PatientDoctorDto>>> getDoctors() {
        List<com.medivault.doctor.entity.Doctor> doctors = doctorRepository.findAll();
        List<PatientDoctorDto> doctorDtos = doctors.stream().map(doc -> {
            PatientDoctorDto dto = new PatientDoctorDto();
            dto.setId(doc.getId());
            dto.setName(doc.getFullName());
            dto.setEmail(doc.getUser().getEmail());
            dto.setRole(doc.getUser().getRole().name());
            return dto;
        }).toList();
        return ResponseBuilder.success(doctorDtos, "Doctors retrieved successfully");
    }

    @lombok.Data
    public static class PatientDoctorDto {
        @com.fasterxml.jackson.annotation.JsonProperty("_id")
        private UUID id;
        private String name;
        private String email;
        private String role;
    }
}
