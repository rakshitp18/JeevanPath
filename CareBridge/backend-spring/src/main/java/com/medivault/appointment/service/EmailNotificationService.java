package com.medivault.appointment.service;

import com.medivault.appointment.entity.Appointment;

public interface EmailNotificationService {
    void sendAppointmentRequested(Appointment appointment);
    void sendAppointmentApproved(Appointment appointment);
    void sendAppointmentRejected(Appointment appointment);
    void sendAppointmentRescheduled(Appointment appointment);
    void sendAppointmentCancelled(Appointment appointment);
    void sendAppointmentCompleted(Appointment appointment);
    void sendQRCodeEmail(Appointment appointment);
}
