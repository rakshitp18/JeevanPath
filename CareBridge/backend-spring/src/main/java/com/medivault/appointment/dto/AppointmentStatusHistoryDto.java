package com.medivault.appointment.dto;

import com.medivault.appointment.entity.AppointmentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class AppointmentStatusHistoryDto {
    private UUID id;
    private AppointmentStatus oldStatus;
    private AppointmentStatus newStatus;
    private UUID changedBy;
    private String remarks;
    private ZonedDateTime changedAt;
}
