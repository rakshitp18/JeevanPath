package com.medivault.appointment.service;

import com.medivault.appointment.entity.Appointment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailNotificationServiceImpl implements EmailNotificationService {

    @Override
    public void sendAppointmentRequested(Appointment appointment) {
        log.info("Sending appointment requested email to doctor: {}", appointment.getDoctor().getUser().getEmail());
    }

    @Override
    public void sendAppointmentApproved(Appointment appointment) {
        log.info("Sending approval confirmation email to patient: {}", appointment.getPatient().getUser().getEmail());
    }

    @Override
    public void sendAppointmentRejected(Appointment appointment) {
        log.info("Sending rejection email to patient: {}", appointment.getPatient().getUser().getEmail());
    }

    @Override
    public void sendAppointmentRescheduled(Appointment appointment) {
        log.info("Sending reschedule proposal email to patient: {}", appointment.getPatient().getUser().getEmail());
    }

    @Override
    public void sendAppointmentCancelled(Appointment appointment) {
        log.info("Sending cancellation email to patient: {}", appointment.getPatient().getUser().getEmail());
    }

    @Override
    public void sendAppointmentCompleted(Appointment appointment) {
        log.info("Sending completion email to patient: {}", appointment.getPatient().getUser().getEmail());
    }

    @Override
    public void sendQRCodeEmail(Appointment appointment) {
        log.info("Sending QR code email to patient: {}", appointment.getPatient().getUser().getEmail());
    }
}
