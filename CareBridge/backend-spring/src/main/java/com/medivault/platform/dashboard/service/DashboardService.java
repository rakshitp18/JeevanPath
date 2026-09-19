package com.medivault.platform.dashboard.service;

import com.medivault.platform.dashboard.dto.DoctorDashboardDto;
import com.medivault.platform.dashboard.dto.PatientDashboardDto;

import java.util.UUID;

public interface DashboardService {
    PatientDashboardDto getPatientDashboard(UUID userId);
    DoctorDashboardDto getDoctorDashboard(UUID userId);
}
