package com.medivault.appointment.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class BookAppointmentRequest {
    @NotNull(message = "Doctor ID is required")
    private UUID doctorId;

    @NotNull(message = "Appointment date is required")
    @FutureOrPresent(message = "Cannot book in the past")
    private LocalDate appointmentDate;

    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;

    @NotBlank(message = "Consultation mode is required")
    private String consultationMode;

    @NotBlank(message = "Reason for visit is required")
    private String reason;

    private String symptoms;
    private String notes;
}
