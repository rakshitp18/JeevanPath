package com.medivault.platform.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PatientDashboardDto {
    private Integer activeReminders;
    private Integer unreadNotifications;
    private Boolean emergencyProfileConfigured;
    // Lists of DTOs could be included here
    private List<Object> upcomingAppointments; 
}
