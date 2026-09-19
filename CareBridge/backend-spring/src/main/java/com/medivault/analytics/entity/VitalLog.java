package com.medivault.analytics.entity;

import com.medivault.common.BaseEntity;
import com.medivault.patient.entity.Patient;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "vitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalLog extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private LocalDate date;

    private Double weight;
    private Double height;
    private Double bmi;

    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;

    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;

    @Column(name = "blood_sugar_fasting")
    private Double bloodSugarFasting;

    @Column(name = "blood_sugar_random")
    private Double bloodSugarRandom;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "oxygen_level")
    private Double oxygenLevel;

    private Double temperature;

    @Column(name = "sleep_hours")
    private Double sleepHours;

    private Integer steps;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
