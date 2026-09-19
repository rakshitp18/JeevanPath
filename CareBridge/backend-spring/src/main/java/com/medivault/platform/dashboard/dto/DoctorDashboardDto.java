package com.medivault.platform.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DoctorDashboardDto {
    private Integer todayAppointmentsCount;
    private Integer completedConsultations;
    private Integer pendingConsultations;
    private Integer totalPatients;
    private List<Object> todayAppointments;
}
