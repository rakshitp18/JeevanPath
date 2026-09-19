package com.medivault.appointment.service;

import com.medivault.appointment.dto.AppointmentDto;
import com.medivault.appointment.dto.AppointmentStatusHistoryDto;
import com.medivault.appointment.dto.BookAppointmentRequest;
import com.medivault.appointment.entity.AppointmentStatus;

import java.util.List;
import java.util.UUID;

public interface AppointmentService {
    
    // Patient Operations
    AppointmentDto bookAppointment(UUID userId, BookAppointmentRequest request);
    List<AppointmentDto> getPatientAppointments(UUID userId);
    AppointmentDto getPatientAppointmentDetails(UUID userId, UUID appointmentId);
    AppointmentDto rescheduleAppointment(UUID userId, UUID appointmentId, BookAppointmentRequest request);
    AppointmentDto acceptReschedule(UUID userId, UUID appointmentId);
    AppointmentDto declineReschedule(UUID userId, UUID appointmentId);
    void cancelAppointment(UUID userId, UUID appointmentId, String reason);
    
    // Doctor Operations
    List<AppointmentDto> getDoctorAppointments(UUID userId);
    AppointmentDto approveAppointment(UUID userId, UUID appointmentId, String remarks);
    AppointmentDto rejectAppointment(UUID userId, UUID appointmentId, String reason, String remarks);
    AppointmentDto proposeReschedule(UUID userId, UUID appointmentId, java.time.LocalDate newDate, java.time.LocalTime newTime, String remarks);
    AppointmentDto markCompleted(UUID userId, UUID appointmentId, String remarks);
    AppointmentDto validateQRCode(UUID userId, String validationToken);
    
    // Common
    List<AppointmentStatusHistoryDto> getAppointmentHistory(UUID appointmentId);
}
