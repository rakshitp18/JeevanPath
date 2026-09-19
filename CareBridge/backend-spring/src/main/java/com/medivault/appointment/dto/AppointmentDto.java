package com.medivault.appointment.dto;

import com.medivault.appointment.entity.AppointmentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class AppointmentDto {
    private UUID id;
    private UUID patientId;
    private String patientName;
    private UUID doctorId;
    private String doctorName;
    private UUID hospitalId;
    private String hospitalName;
    private UUID departmentId;
    private String departmentName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String consultationMode;
    private String reason;
    private String symptoms;
    private String notes;
    private AppointmentStatus currentStatus;
    private String paymentStatus;
    private String razorpayPaymentId;
    private String cancellationReason;
    private String rejectionReason;
    private LocalDate proposedDate;
    private LocalTime proposedTime;
    private Integer rescheduleCount;
    private String qrValidationToken; // Optional, might be masked
}
