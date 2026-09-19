package com.medivault.appointment.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class DoctorRescheduleRequest {
    @NotNull(message = "Proposed date is required")
    @FutureOrPresent(message = "Cannot propose a past date")
    private LocalDate proposedDate;

    @NotNull(message = "Proposed time is required")
    private LocalTime proposedTime;

    private String remarks;
}
