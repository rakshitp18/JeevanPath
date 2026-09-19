package com.medivault.platform.event.listener;

import com.medivault.platform.event.domain.AppointmentBookedEvent;
import com.medivault.platform.event.domain.AppointmentCancelledEvent;
import com.medivault.platform.event.domain.PrescriptionIssuedEvent;
import com.medivault.platform.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAppointmentBooked(AppointmentBookedEvent event) {
        log.info("Received AppointmentBookedEvent for appointment {}", event.getAppointmentId());
        notificationService.sendNotification(
                event.getPatientUserId(),
                "EMAIL",
                "APPOINTMENT",
                "Appointment Confirmed",
                "Your appointment has been successfully booked."
        );
        notificationService.sendNotification(
                event.getDoctorUserId(),
                "EMAIL",
                "APPOINTMENT",
                "New Appointment Scheduled",
                "You have a new appointment scheduled."
        );
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAppointmentCancelled(AppointmentCancelledEvent event) {
        log.info("Received AppointmentCancelledEvent for appointment {}", event.getAppointmentId());
        notificationService.sendNotification(
                event.getPatientUserId(),
                "EMAIL",
                "APPOINTMENT",
                "Appointment Cancelled",
                "Your appointment has been cancelled."
        );
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePrescriptionIssued(PrescriptionIssuedEvent event) {
        log.info("Received PrescriptionIssuedEvent for prescription {}", event.getPrescriptionId());
        notificationService.sendNotification(
                event.getPatientUserId(),
                "EMAIL",
                "MEDICAL",
                "New Prescription Issued",
                "Your doctor has issued a new prescription."
        );
    }
}
