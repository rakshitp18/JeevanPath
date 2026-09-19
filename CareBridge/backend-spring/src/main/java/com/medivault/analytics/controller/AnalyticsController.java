package com.medivault.analytics.controller;

import com.medivault.analytics.dto.AnalyticsDashboardDataDto;
import com.medivault.analytics.dto.AnalyticsSummaryDataDto;
import com.medivault.analytics.dto.VitalLogDto;
import com.medivault.analytics.service.AnalyticsService;
import com.medivault.common.ApiResponse;
import com.medivault.security.CustomUserDetails;
import com.medivault.util.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Health Analytics", description = "Endpoints for tracking and analyzing patient health vitals")
@PreAuthorize("hasRole('PATIENT')")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get full analytics dashboard data")
    public ResponseEntity<ApiResponse<AnalyticsDashboardDataDto>> getDashboardData(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(analyticsService.getDashboardData(user.getId()), "Dashboard data retrieved successfully");
    }

    @GetMapping("/summary")
    @Operation(summary = "Get a quick summary of health analytics")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDataDto>> getSummaryData(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(analyticsService.getSummaryData(user.getId()), "Summary data retrieved successfully");
    }

    @GetMapping("/vitals")
    @Operation(summary = "Get complete vitals history")
    public ResponseEntity<ApiResponse<List<VitalLogDto>>> getVitalsHistory(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(analyticsService.getVitalsHistory(user.getId()), "Vitals history retrieved successfully");
    }

    @PostMapping("/vitals")
    @Operation(summary = "Log a new vitals record")
    public ResponseEntity<ApiResponse<VitalLogDto>> saveVitals(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody VitalLogDto dto) {
        return ResponseBuilder.success(analyticsService.saveVitals(user.getId(), dto), "Vitals saved successfully");
    }
}
