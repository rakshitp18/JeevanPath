package com.medivault.platform.scheme.controller;

import com.medivault.common.ApiResponse;
import com.medivault.platform.scheme.dto.GovernmentSchemeDto;
import com.medivault.platform.scheme.service.SchemeService;
import com.medivault.util.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/schemes")
@RequiredArgsConstructor
@Tag(name = "Government Schemes", description = "Endpoints for discovering health schemes")
@SecurityRequirement(name = "bearerAuth")
public class SchemeController {

    private final SchemeService schemeService;

    @GetMapping
    @Operation(summary = "Get all active government health schemes")
    public ResponseEntity<ApiResponse<List<GovernmentSchemeDto>>> getActiveSchemes() {
        return ResponseBuilder.success(schemeService.getActiveSchemes(), "Schemes retrieved successfully");
    }
}
