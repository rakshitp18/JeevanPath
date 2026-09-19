package com.medivault.hospital.controller;

import com.medivault.common.ApiResponse;
import com.medivault.hospital.dto.DepartmentDto;
import com.medivault.hospital.dto.HospitalDto;
import com.medivault.hospital.service.HospitalService;
import com.medivault.util.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/hospitals")
@RequiredArgsConstructor
@Tag(name = "Hospital", description = "Endpoints for viewing hospitals and departments")
public class HospitalController {

    private final HospitalService hospitalService;

    @GetMapping
    @Operation(summary = "List all active hospitals")
    public ResponseEntity<ApiResponse<List<HospitalDto>>> getAllHospitals() {
        return ResponseBuilder.success(hospitalService.getAllHospitals(), "Hospitals retrieved successfully");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hospital details by ID")
    public ResponseEntity<ApiResponse<HospitalDto>> getHospitalById(@PathVariable UUID id) {
        return ResponseBuilder.success(hospitalService.getHospitalById(id), "Hospital retrieved successfully");
    }

    @GetMapping("/{id}/departments")
    @Operation(summary = "List departments for a specific hospital")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getDepartmentsByHospitalId(@PathVariable UUID id) {
        return ResponseBuilder.success(hospitalService.getDepartmentsByHospitalId(id), "Departments retrieved successfully");
    }
}
