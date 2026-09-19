package com.medivault.patient.entity;

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

@Entity
@Table(name = "patient_medical_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientMedicalInformation extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "chronic_diseases", columnDefinition = "TEXT")
    private String chronicDiseases;

    @Column(name = "current_conditions", columnDefinition = "TEXT")
    private String currentConditions;

    @Column(name = "current_medications", columnDefinition = "TEXT")
    private String currentMedications;

    @Column(name = "past_surgeries", columnDefinition = "TEXT")
    private String pastSurgeries;

    @Column(columnDefinition = "TEXT")
    private String disabilities;

    @Column(name = "organ_donor_status", nullable = false)
    @Builder.Default
    private Boolean organDonorStatus = false;

    @Column(name = "smoking_status", length = 50)
    private String smokingStatus;

    @Column(name = "alcohol_consumption", length = 50)
    private String alcoholConsumption;

    @Column(name = "vaccination_status", length = 100)
    private String vaccinationStatus;
}
