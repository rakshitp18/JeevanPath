package com.medivault.doctor.entity;

import com.medivault.common.BaseEntity;
import com.medivault.hospital.entity.Department;
import com.medivault.hospital.entity.Hospital;
import com.medivault.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Doctor profile entity.
 */
@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "license_number", length = 100)
    private String licenseNumber;

    @Column(name = "medical_registration_number", length = 100)
    private String medicalRegistrationNumber;

    @Column(nullable = false)
    private String qualification;

    @Column(nullable = false)
    private String specialization;

    private Integer experience;

    @Column(name = "consultation_fee", precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(columnDefinition = "TEXT")
    private String biography;

    @Column(name = "languages_spoken", columnDefinition = "TEXT")
    private String languagesSpoken;

    @Column(name = "consultation_mode", length = 50)
    private String consultationMode;

    @Column(name = "verification_status", length = 50)
    @Builder.Default
    private String verificationStatus = "PENDING";

    @Column(name = "available_status", nullable = false)
    @Builder.Default
    private boolean availableStatus = true;

    @Column(name = "profile_image")
    private String profileImage;

    public UUID getDoctorId() {
        return getId();
    }
}
