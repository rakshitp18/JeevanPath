package com.medivault.platform.event.domain;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.util.UUID;

@Getter
public class AppointmentCancelledEvent extends ApplicationEvent {
    private final UUID appointmentId;
    private final UUID patientUserId;
    private final UUID doctorUserId;

    public AppointmentCancelledEvent(Object source, UUID appointmentId, UUID patientUserId, UUID doctorUserId) {
        super(source);
        this.appointmentId = appointmentId;
        this.patientUserId = patientUserId;
        this.doctorUserId = doctorUserId;
    }
}
