package com.medivault.platform.emergency.controller;

import com.medivault.common.ApiResponse;
import com.medivault.platform.emergency.dto.EmergencyProfileDto;
import com.medivault.platform.emergency.service.EmergencyService;
import com.medivault.util.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/emergency")
@RequiredArgsConstructor
@Tag(name = "Public Emergency Access", description = "Public endpoints for emergency responders")
public class PublicEmergencyController {

    private final EmergencyService emergencyService;

    @GetMapping("/{token}")
    @Operation(summary = "Access an emergency profile via secure token")
    public ResponseEntity<ApiResponse<EmergencyProfileDto>> getPublicProfile(
            @PathVariable String token,
            HttpServletRequest request) {
        
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        
        return ResponseBuilder.success(emergencyService.getPublicEmergencyProfile(token, ipAddress, userAgent), "Emergency profile retrieved successfully");
    }
}
