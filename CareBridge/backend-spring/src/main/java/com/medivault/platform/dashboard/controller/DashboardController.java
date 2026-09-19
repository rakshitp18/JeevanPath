package com.medivault.platform.dashboard.controller;

import com.medivault.common.ApiResponse;
import com.medivault.platform.dashboard.dto.DoctorDashboardDto;
import com.medivault.platform.dashboard.dto.PatientDashboardDto;
import com.medivault.platform.dashboard.service.DashboardService;
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

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboards", description = "Aggregated dashboard endpoints")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    @Operation(summary = "Get patient dashboard overview")
    public ResponseEntity<ApiResponse<PatientDashboardDto>> getPatientDashboard(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(dashboardService.getPatientDashboard(user.getId()), "Dashboard loaded");
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Get doctor dashboard overview")
    public ResponseEntity<ApiResponse<DoctorDashboardDto>> getDoctorDashboard(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(dashboardService.getDoctorDashboard(user.getId()), "Dashboard loaded");
    }
}
