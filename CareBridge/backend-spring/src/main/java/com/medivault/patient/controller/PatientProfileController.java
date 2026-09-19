package com.medivault.patient.controller;

import com.medivault.common.ApiResponse;
import com.medivault.patient.dto.EmergencyContactDto;
import com.medivault.patient.dto.FamilyMemberDto;
import com.medivault.patient.dto.InsuranceInformationDto;
import com.medivault.patient.dto.PatientMedicalInformationDto;
import com.medivault.patient.dto.PatientProfileDto;
import com.medivault.patient.dto.UpdatePatientProfileRequest;
import com.medivault.patient.service.PatientProfileService;
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
@RequestMapping("/api/v1/patients/profile")
@RequiredArgsConstructor
@Tag(name = "Patient Profile", description = "Endpoints for managing patient profiles, medical info, and contacts")
@PreAuthorize("hasRole('PATIENT')")
@SecurityRequirement(name = "bearerAuth")
public class PatientProfileController {

    private final PatientProfileService patientService;

    // --- Profile ---
    @GetMapping
    @Operation(summary = "Get full patient profile")
    public ResponseEntity<ApiResponse<PatientProfileDto>> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(patientService.getProfile(user.getId()), "Profile retrieved successfully");
    }

    @PutMapping
    @Operation(summary = "Update patient profile")
    public ResponseEntity<ApiResponse<PatientProfileDto>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody UpdatePatientProfileRequest request) {
        return ResponseBuilder.success(patientService.updateProfile(user.getId(), request), "Profile updated successfully");
    }

    @PostMapping("/photo")
    @Operation(summary = "Upload profile photo")
    public ResponseEntity<ApiResponse<Void>> uploadProfilePhoto(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam("file") MultipartFile file) {
        patientService.uploadProfilePhoto(user.getId(), file);
        return ResponseBuilder.success(null, "Photo uploaded successfully");
    }

    @DeleteMapping("/photo")
    @Operation(summary = "Delete profile photo")
    public ResponseEntity<ApiResponse<Void>> deleteProfilePhoto(@AuthenticationPrincipal CustomUserDetails user) {
        patientService.deleteProfilePhoto(user.getId());
        return ResponseBuilder.success(null, "Photo deleted successfully");
    }

    // --- Medical Information ---
    @GetMapping("/medical")
    @Operation(summary = "Get medical information")
    public ResponseEntity<ApiResponse<PatientMedicalInformationDto>> getMedicalInfo(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(patientService.getMedicalInformation(user.getId()), "Medical info retrieved successfully");
    }

    @PutMapping("/medical")
    @Operation(summary = "Update medical information")
    public ResponseEntity<ApiResponse<PatientMedicalInformationDto>> updateMedicalInfo(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody PatientMedicalInformationDto request) {
        return ResponseBuilder.success(patientService.updateMedicalInformation(user.getId(), request), "Medical info updated successfully");
    }

    // --- Emergency Contacts ---
    @GetMapping("/emergency-contacts")
    @Operation(summary = "List emergency contacts")
    public ResponseEntity<ApiResponse<List<EmergencyContactDto>>> getEmergencyContacts(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(patientService.getEmergencyContacts(user.getId()), "Emergency contacts retrieved successfully");
    }

    @PostMapping("/emergency-contacts")
    @Operation(summary = "Add an emergency contact")
    public ResponseEntity<ApiResponse<EmergencyContactDto>> addEmergencyContact(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody EmergencyContactDto request) {
        return ResponseBuilder.success(patientService.addEmergencyContact(user.getId(), request), "Contact added successfully");
    }

    @PutMapping("/emergency-contacts/{id}")
    @Operation(summary = "Update an emergency contact")
    public ResponseEntity<ApiResponse<EmergencyContactDto>> updateEmergencyContact(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @Valid @RequestBody EmergencyContactDto request) {
        return ResponseBuilder.success(patientService.updateEmergencyContact(user.getId(), id, request), "Contact updated successfully");
    }

    @DeleteMapping("/emergency-contacts/{id}")
    @Operation(summary = "Delete an emergency contact")
    public ResponseEntity<ApiResponse<Void>> deleteEmergencyContact(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        patientService.deleteEmergencyContact(user.getId(), id);
        return ResponseBuilder.success(null, "Contact deleted successfully");
    }

    // --- Insurance Information ---
    @GetMapping("/insurance")
    @Operation(summary = "Get insurance information")
    public ResponseEntity<ApiResponse<InsuranceInformationDto>> getInsuranceInfo(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(patientService.getInsuranceInformation(user.getId()), "Insurance info retrieved successfully");
    }

    @PutMapping("/insurance")
    @Operation(summary = "Update insurance information")
    public ResponseEntity<ApiResponse<InsuranceInformationDto>> updateInsuranceInfo(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody InsuranceInformationDto request) {
        return ResponseBuilder.success(patientService.updateInsuranceInformation(user.getId(), request), "Insurance info updated successfully");
    }

    // --- Family Members ---
    @GetMapping("/family-members")
    @Operation(summary = "List family members")
    public ResponseEntity<ApiResponse<List<FamilyMemberDto>>> getFamilyMembers(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(patientService.getFamilyMembers(user.getId()), "Family members retrieved successfully");
    }

    @PostMapping("/family-members")
    @Operation(summary = "Add a family member")
    public ResponseEntity<ApiResponse<FamilyMemberDto>> addFamilyMember(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody FamilyMemberDto request) {
        return ResponseBuilder.success(patientService.addFamilyMember(user.getId(), request), "Family member added successfully");
    }

    @PutMapping("/family-members/{id}")
    @Operation(summary = "Update a family member")
    public ResponseEntity<ApiResponse<FamilyMemberDto>> updateFamilyMember(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @Valid @RequestBody FamilyMemberDto request) {
        return ResponseBuilder.success(patientService.updateFamilyMember(user.getId(), id, request), "Family member updated successfully");
    }

    @DeleteMapping("/family-members/{id}")
    @Operation(summary = "Delete a family member")
    public ResponseEntity<ApiResponse<Void>> deleteFamilyMember(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        patientService.deleteFamilyMember(user.getId(), id);
        return ResponseBuilder.success(null, "Family member deleted successfully");
    }

    // --- Account Status ---
    @PostMapping("/deactivate")
    @Operation(summary = "Deactivate profile")
    public ResponseEntity<ApiResponse<Void>> deactivateProfile(@AuthenticationPrincipal CustomUserDetails user) {
        patientService.deactivateProfile(user.getId());
        return ResponseBuilder.success(null, "Profile deactivated successfully");
    }

    @PostMapping("/reactivate")
    @Operation(summary = "Reactivate profile")
    public ResponseEntity<ApiResponse<Void>> reactivateProfile(@AuthenticationPrincipal CustomUserDetails user) {
        patientService.reactivateProfile(user.getId());
        return ResponseBuilder.success(null, "Profile reactivated successfully");
    }
}
