package com.medivault.appointment.entity;

import com.medivault.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

@Entity
@Table(name = "appointment_qr_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentQRCode extends BaseEntity {

    @OneToOne(optional = false)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @Column(name = "validation_token", nullable = false, unique = true)
    private String validationToken;

    @Column(name = "expiry_time", nullable = false)
    private ZonedDateTime expiryTime;

    @Column(length = 50)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, USED, EXPIRED
}
