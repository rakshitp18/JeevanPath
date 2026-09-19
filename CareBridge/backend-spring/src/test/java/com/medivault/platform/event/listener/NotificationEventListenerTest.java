package com.medivault.platform.event.listener;

import com.medivault.platform.event.domain.AppointmentBookedEvent;
import com.medivault.platform.notification.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationEventListenerTest {

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationEventListener listener;

    @Test
    void testHandleAppointmentBooked() {
        UUID appointmentId = UUID.randomUUID();
        UUID patientId = UUID.randomUUID();
        UUID doctorId = UUID.randomUUID();

        AppointmentBookedEvent event = new AppointmentBookedEvent(this, appointmentId, patientId, doctorId);

        listener.handleAppointmentBooked(event);

        verify(notificationService).sendNotification(
                eq(patientId),
                eq("EMAIL"),
                eq("APPOINTMENT"),
                eq("Appointment Confirmed"),
                anyString()
        );

        verify(notificationService).sendNotification(
                eq(doctorId),
                eq("EMAIL"),
                eq("APPOINTMENT"),
                eq("New Appointment Scheduled"),
                anyString()
        );
    }
}
