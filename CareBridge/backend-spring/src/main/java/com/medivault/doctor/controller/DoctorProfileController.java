package com.medivault.doctor.controller;

import com.medivault.common.ApiResponse;
import com.medivault.doctor.dto.DoctorAvailabilityDto;
import com.medivault.doctor.dto.DoctorDocumentDto;
import com.medivault.doctor.dto.DoctorLeaveDto;
import com.medivault.doctor.dto.DoctorProfileDto;
import com.medivault.doctor.dto.UpdateDoctorProfileRequest;
import com.medivault.doctor.service.DoctorProfileService;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctor Profile", description = "Endpoints for managing doctor profiles, availability, and leaves")
@PreAuthorize("hasRole('DOCTOR')")
@SecurityRequirement(name = "bearerAuth")
public class DoctorProfileController {

    private final DoctorProfileService doctorService;

    // --- Profile ---
    @GetMapping("/profile")
    @Operation(summary = "Get full doctor profile")
    public ResponseEntity<ApiResponse<DoctorProfileDto>> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(doctorService.getProfile(user.getId()), "Profile retrieved successfully");
    }

    @PutMapping("/profile")
    @Operation(summary = "Update doctor profile")
    public ResponseEntity<ApiResponse<DoctorProfileDto>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody UpdateDoctorProfileRequest request) {
        return ResponseBuilder.success(doctorService.updateProfile(user.getId(), request), "Profile updated successfully");
    }

    @PostMapping("/profile/photo")
    @Operation(summary = "Upload profile photo")
    public ResponseEntity<ApiResponse<Void>> uploadProfilePhoto(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam("file") MultipartFile file) {
        doctorService.uploadProfilePhoto(user.getId(), file);
        return ResponseBuilder.success(null, "Photo uploaded successfully");
    }

    // --- Availability ---
    @GetMapping("/availability")
    @Operation(summary = "Get doctor availability schedule")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityDto>>> getAvailability(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(doctorService.getAvailability(user.getId()), "Availability retrieved successfully");
    }

    @PostMapping("/availability")
    @Operation(summary = "Add an availability block")
    public ResponseEntity<ApiResponse<DoctorAvailabilityDto>> addAvailability(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody DoctorAvailabilityDto request) {
        return ResponseBuilder.success(doctorService.addAvailability(user.getId(), request), "Availability added successfully");
    }

    @PutMapping("/availability/{id}")
    @Operation(summary = "Update an availability block")
    public ResponseEntity<ApiResponse<DoctorAvailabilityDto>> updateAvailability(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @Valid @RequestBody DoctorAvailabilityDto request) {
        return ResponseBuilder.success(doctorService.updateAvailability(user.getId(), id, request), "Availability updated successfully");
    }

    @DeleteMapping("/availability/{id}")
    @Operation(summary = "Delete an availability block")
    public ResponseEntity<ApiResponse<Void>> deleteAvailability(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        doctorService.deleteAvailability(user.getId(), id);
        return ResponseBuilder.success(null, "Availability deleted successfully");
    }

    // --- Leaves ---
    @GetMapping("/leaves")
    @Operation(summary = "Get doctor leaves")
    public ResponseEntity<ApiResponse<List<DoctorLeaveDto>>> getLeaves(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(doctorService.getLeaves(user.getId()), "Leaves retrieved successfully");
    }

    @PostMapping("/leaves")
    @Operation(summary = "Apply for leave")
    public ResponseEntity<ApiResponse<DoctorLeaveDto>> addLeave(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody DoctorLeaveDto request) {
        return ResponseBuilder.success(doctorService.addLeave(user.getId(), request), "Leave applied successfully");
    }

    @PutMapping("/leaves/{id}")
    @Operation(summary = "Update pending leave")
    public ResponseEntity<ApiResponse<DoctorLeaveDto>> updateLeave(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @Valid @RequestBody DoctorLeaveDto request) {
        return ResponseBuilder.success(doctorService.updateLeave(user.getId(), id, request), "Leave updated successfully");
    }

    @DeleteMapping("/leaves/{id}")
    @Operation(summary = "Delete leave request")
    public ResponseEntity<ApiResponse<Void>> deleteLeave(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        doctorService.deleteLeave(user.getId(), id);
        return ResponseBuilder.success(null, "Leave deleted successfully");
    }

    // --- Documents ---
    @GetMapping("/profile/documents")
    @Operation(summary = "Get professional documents")
    public ResponseEntity<ApiResponse<List<DoctorDocumentDto>>> getDocuments(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(doctorService.getDocuments(user.getId()), "Documents retrieved successfully");
    }

    @PostMapping("/profile/documents")
    @Operation(summary = "Upload professional document")
    public ResponseEntity<ApiResponse<DoctorDocumentDto>> uploadDocument(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {
        return ResponseBuilder.success(doctorService.uploadDocument(user.getId(), documentType, file), "Document uploaded successfully");
    }
}
