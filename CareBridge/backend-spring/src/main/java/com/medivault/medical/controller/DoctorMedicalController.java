package com.medivault.medical.controller;

import com.medivault.common.ApiResponse;
import com.medivault.medical.dto.CreateMedicalRecordRequest;
import com.medivault.medical.dto.IssuePrescriptionRequest;
import com.medivault.medical.dto.MedicalRecordDto;
import com.medivault.medical.dto.PrescriptionDto;
import com.medivault.medical.service.MedicalRecordService;
import com.medivault.medical.service.PrescriptionService;
import com.medivault.security.CustomUserDetails;
import com.medivault.util.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctor/records")
@RequiredArgsConstructor
@Tag(name = "Doctor Medical Records", description = "Endpoints for doctors to manage medical records and prescriptions")
@PreAuthorize("hasRole('DOCTOR')")
@SecurityRequirement(name = "bearerAuth")
public class DoctorMedicalController {

    private final MedicalRecordService recordService;
    private final PrescriptionService prescriptionService;
    private final com.medivault.doctor.repository.DoctorRepository doctorRepository;

    @PostMapping
    @Operation(summary = "Create a medical record for a patient")
    public ResponseEntity<ApiResponse<MedicalRecordDto>> createRecord(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CreateMedicalRecordRequest request) {
        return ResponseBuilder.success(recordService.createRecord(user.getId(), request), "Medical record created successfully");
    }

    @PostMapping("/{recordId}/prescriptions")
    @Operation(summary = "Issue a prescription for a medical record")
    public ResponseEntity<ApiResponse<PrescriptionDto>> issuePrescription(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID recordId,
            @Valid @RequestBody IssuePrescriptionRequest request) {
        return ResponseBuilder.success(prescriptionService.issuePrescription(user.getId(), recordId, request), "Prescription issued successfully");
    }

    @GetMapping
    @Operation(summary = "Get all records created by this doctor")
    public ResponseEntity<ApiResponse<List<com.medivault.medical.dto.MedicalDocumentDto>>> getDoctorRecords(@AuthenticationPrincipal CustomUserDetails user) {
        com.medivault.doctor.entity.Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new com.medivault.exception.ResourceNotFoundException("Doctor profile not found"));
        return ResponseBuilder.success(recordService.getDoctorDocuments(doctor.getId()), "Records retrieved successfully");
    }
}
