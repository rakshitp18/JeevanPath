package com.medivault.appointment.controller;

import com.medivault.appointment.dto.AvailableSlotDto;
import com.medivault.appointment.service.AppointmentSlotService;
import com.medivault.common.ApiResponse;
import com.medivault.util.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/appointments/search")
@RequiredArgsConstructor
@Tag(name = "Appointment Search", description = "Endpoints for finding available appointment slots")
public class AppointmentSearchController {

    private final AppointmentSlotService slotService;

    @GetMapping("/slots")
    @Operation(summary = "Get available slots for a doctor on a specific date")
    public ResponseEntity<ApiResponse<List<AvailableSlotDto>>> getAvailableSlots(
            @RequestParam UUID doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        return ResponseBuilder.success(slotService.getAvailableSlots(doctorId, date), "Slots retrieved successfully");
    }
}
