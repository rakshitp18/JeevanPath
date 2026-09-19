package com.medivault.medical.controller;

import com.medivault.common.ApiResponse;
import com.medivault.medical.dto.TimelineEventDto;
import com.medivault.medical.service.HealthTimelineService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/patient/timeline")
@RequiredArgsConstructor
@Tag(name = "Health Timeline", description = "Endpoints for unified health timeline")
@PreAuthorize("hasRole('PATIENT')")
@SecurityRequirement(name = "bearerAuth")
public class TimelineController {

    private final HealthTimelineService timelineService;
    private final PatientRepository patientRepository;

    @GetMapping
    @Operation(summary = "Get chronological health timeline")
    public ResponseEntity<ApiResponse<List<TimelineEventDto>>> getTimeline(@AuthenticationPrincipal CustomUserDetails user) {
        UUID patientId = patientRepository.findByUserId(user.getId()).orElseThrow().getId();
        return ResponseBuilder.success(timelineService.getPatientTimeline(patientId), "Timeline retrieved successfully");
    }
}
