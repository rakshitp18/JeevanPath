package com.medivault.platform.event.domain;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.util.UUID;

@Getter
public class PrescriptionIssuedEvent extends ApplicationEvent {
    private final UUID prescriptionId;
    private final UUID patientUserId;

    public PrescriptionIssuedEvent(Object source, UUID prescriptionId, UUID patientUserId) {
        super(source);
        this.prescriptionId = prescriptionId;
        this.patientUserId = patientUserId;
    }
}
