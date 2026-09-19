package com.medivault.platform.emergency.entity;

import com.medivault.common.BaseEntity;
import com.medivault.patient.entity.Patient;
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
@Table(name = "emergency_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyProfile extends BaseEntity {

    @OneToOne(optional = false)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @Column(name = "access_token", unique = true)
    private String accessToken;

    @Column(name = "token_expiry")
    private ZonedDateTime tokenExpiry;

    @Column(name = "is_enabled")
    @Builder.Default
    private Boolean isEnabled = false;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(name = "critical_allergies", columnDefinition = "TEXT")
    private String criticalAllergies;

    @Column(name = "critical_diseases", columnDefinition = "TEXT")
    private String criticalDiseases;

    @Column(name = "current_medications", columnDefinition = "TEXT")
    private String currentMedications;

    @Column(name = "organ_donor")
    @Builder.Default
    private Boolean organDonor = false;

    @Column(name = "emergency_notes", columnDefinition = "TEXT")
    private String emergencyNotes;
}
