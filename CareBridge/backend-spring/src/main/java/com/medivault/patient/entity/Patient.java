package com.medivault.patient.entity;

import com.medivault.common.BaseEntity;
import com.medivault.hospital.entity.Hospital;
import com.medivault.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Patient profile entity containing health details.
 */
@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String gender;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    private Double height;

    private Double weight;

    @Column(length = 20)
    private String phone;

    @Column(name = "alternate_phone", length = 20)
    private String alternatePhone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "insurance_number", length = 100)
    private String insuranceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(name = "profile_image")
    private String profileImage;

    public UUID getPatientId() {
        return getId();
    }
}
