package com.medivault.security.entity;

import com.medivault.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "otp_verifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification extends BaseEntity {

    @Column(nullable = false)
    private String email;

    @Column(name = "otp_code", nullable = false, length = 10)
    private String otpCode;

    @Column(nullable = false, length = 50)
    private String purpose; // EMAIL_VERIFICATION, PASSWORD_RESET

    @Column(name = "expiry_time", nullable = false)
    private Instant expiryTime;

    @Column(nullable = false)
    @Builder.Default
    private boolean used = false;
}
