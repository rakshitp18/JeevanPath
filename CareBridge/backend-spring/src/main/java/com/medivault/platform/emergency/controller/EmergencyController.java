package com.medivault.platform.emergency.controller;

import com.medivault.common.ApiResponse;
import com.medivault.patient.repository.PatientRepository;
import com.medivault.platform.emergency.dto.EmergencyProfileDto;
import com.medivault.platform.emergency.service.EmergencyService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/patient/emergency")
@RequiredArgsConstructor
@Tag(name = "Emergency Profile", description = "Endpoints for patients to manage their emergency profile")
@PreAuthorize("hasRole('PATIENT')")
@SecurityRequirement(name = "bearerAuth")
public class EmergencyController {

    private final EmergencyService emergencyService;
    private final PatientRepository patientRepository;

    @GetMapping
    @Operation(summary = "Get my emergency profile")
    public ResponseEntity<ApiResponse<EmergencyProfileDto>> getMyEmergencyProfile(@AuthenticationPrincipal CustomUserDetails user) {
        UUID patientId = patientRepository.findByUserId(user.getId()).orElseThrow().getId();
        return ResponseBuilder.success(emergencyService.getPatientEmergencyProfile(patientId), "Emergency profile retrieved successfully");
    }

    @PutMapping
    @Operation(summary = "Update my emergency profile")
    public ResponseEntity<ApiResponse<EmergencyProfileDto>> updateMyEmergencyProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody EmergencyProfileDto request) {
        UUID patientId = patientRepository.findByUserId(user.getId()).orElseThrow().getId();
        return ResponseBuilder.success(emergencyService.updateEmergencyProfile(patientId, request), "Emergency profile updated successfully");
    }

    @PostMapping("/qr")
    @Operation(summary = "Generate a secure access token for emergency QR")
    public ResponseEntity<ApiResponse<String>> generateEmergencyToken(@AuthenticationPrincipal CustomUserDetails user) {
        UUID patientId = patientRepository.findByUserId(user.getId()).orElseThrow().getId();
        return ResponseBuilder.success(emergencyService.generateEmergencyQrToken(patientId), "Emergency QR token generated successfully");
    }
}
