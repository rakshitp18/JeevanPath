package com.medivault.appointment.controller;

import com.medivault.appointment.dto.AppointmentDto;
import com.medivault.appointment.dto.BookAppointmentRequest;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/patient/appointments")
@RequiredArgsConstructor
@Tag(name = "Patient Appointments", description = "Endpoints for patients to manage their appointments")
@PreAuthorize("hasRole('PATIENT')")
@SecurityRequirement(name = "bearerAuth")
public class PatientAppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @Operation(summary = "Book a new appointment")
    public ResponseEntity<ApiResponse<AppointmentDto>> bookAppointment(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody BookAppointmentRequest request) {
        return ResponseBuilder.success(appointmentService.bookAppointment(user.getId(), request), "Appointment booked successfully");
    }

    @GetMapping
    @Operation(summary = "Get all my appointments")
    public ResponseEntity<ApiResponse<List<AppointmentDto>>> getMyAppointments(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(appointmentService.getPatientAppointments(user.getId()), "Appointments retrieved successfully");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get appointment details")
    public ResponseEntity<ApiResponse<AppointmentDto>> getAppointmentDetails(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        return ResponseBuilder.success(appointmentService.getPatientAppointmentDetails(user.getId(), id), "Appointment retrieved successfully");
    }

    @PutMapping("/{id}/reschedule")
    @Operation(summary = "Reschedule an appointment")
    public ResponseEntity<ApiResponse<AppointmentDto>> rescheduleAppointment(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @Valid @RequestBody BookAppointmentRequest request) {
        return ResponseBuilder.success(appointmentService.rescheduleAppointment(user.getId(), id, request), "Appointment rescheduled successfully");
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an appointment")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id,
            @RequestBody(required = false) java.util.Map<String, String> requestBody) {
        String reason = (requestBody != null && requestBody.containsKey("reason")) ? requestBody.get("reason") : "Patient cancelled";
        appointmentService.cancelAppointment(user.getId(), id, reason);
        return ResponseBuilder.success(null, "Appointment cancelled successfully");
    }

    @PostMapping("/{id}/accept-reschedule")
    @Operation(summary = "Accept a proposed reschedule")
    public ResponseEntity<ApiResponse<AppointmentDto>> acceptReschedule(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        return ResponseBuilder.success(appointmentService.acceptReschedule(user.getId(), id), "Reschedule accepted");
    }

    @PostMapping("/{id}/decline-reschedule")
    @Operation(summary = "Decline a proposed reschedule")
    public ResponseEntity<ApiResponse<AppointmentDto>> declineReschedule(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        return ResponseBuilder.success(appointmentService.declineReschedule(user.getId(), id), "Reschedule declined");
    }
}
