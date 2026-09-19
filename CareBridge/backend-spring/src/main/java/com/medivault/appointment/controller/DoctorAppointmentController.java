package com.medivault.appointment.controller;

import com.medivault.appointment.dto.AppointmentDto;
import com.medivault.appointment.dto.AppointmentStatusHistoryDto;
import com.medivault.appointment.dto.DoctorRejectRequest;
import com.medivault.appointment.dto.DoctorRescheduleRequest;
import com.medivault.appointment.dto.QRValidationRequest;
import com.medivault.appointment.service.AppointmentService;
import com.medivault.common.ApiResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/doctor/appointments")
@RequiredArgsConstructor
@Tag(name = "Doctor Appointments", description = "Endpoints for doctors to manage assigned appointments")
@PreAuthorize("hasRole('DOCTOR')")
@SecurityRequirement(name = "bearerAuth")
public class DoctorAppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    @Operation(summary = "Get all assigned appointments")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getDoctorAppointments(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(appointmentService.getDoctorAppointments(user.getId()), "Appointments retrieved successfully");
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve an appointment request")
    public ResponseEntity<ApiResponse<AppointmentDto>> approveAppointment(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> body) {
        String remarks = body != null ? body.get("remarks") : null;
        return ResponseBuilder.success(appointmentService.approveAppointment(user.getId(), id, remarks), "Appointment approved successfully");
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject an appointment request")
    public ResponseEntity<ApiResponse<AppointmentDto>> rejectAppointment(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @Valid @RequestBody DoctorRejectRequest request) {
        return ResponseBuilder.success(appointmentService.rejectAppointment(user.getId(), id, request.getReason(), request.getRemarks()), "Appointment rejected successfully");
    }

    @PostMapping("/{id}/reschedule")
    @Operation(summary = "Propose a new date/time for an appointment request")
    public ResponseEntity<ApiResponse<AppointmentDto>> proposeReschedule(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @Valid @RequestBody DoctorRescheduleRequest request) {
        return ResponseBuilder.success(appointmentService.proposeReschedule(user.getId(), id, request.getProposedDate(), request.getProposedTime(), request.getRemarks()), "Reschedule proposed successfully");
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Mark an approved appointment as completed")
    public ResponseEntity<ApiResponse<AppointmentDto>> markCompleted(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> body) {
        String remarks = body != null ? body.get("remarks") : null;
        return ResponseBuilder.success(appointmentService.markCompleted(user.getId(), id, remarks), "Appointment marked as completed");
    }

    @PostMapping("/qr/validate")
    @Operation(summary = "Validate Patient QR Code for check-in")
    public ResponseEntity<ApiResponse<AppointmentDto>> validateQRCode(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody QRValidationRequest request) {
        return ResponseBuilder.success(appointmentService.validateQRCode(user.getId(), request.getValidationToken()), "QR Code validated successfully");
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get appointment status history")
    public ResponseEntity<ApiResponse<List<AppointmentStatusHistoryDto>>> getAppointmentHistory(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        return ResponseBuilder.success(appointmentService.getAppointmentHistory(id), "History retrieved successfully");
    }
}
