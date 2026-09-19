package com.medivault.medical.entity;

import com.medivault.common.BaseEntity;
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

@Entity
@Table(name = "prescription_medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionMedicine extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(name = "medicine_name", nullable = false)
    private String medicineName;

    @Column(name = "generic_name")
    private String genericName;

    @Column(nullable = false, length = 100)
    private String dosage;

    @Column(nullable = false, length = 100)
    private String frequency;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;

    @Column(length = 100)
    private String route;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "before_food")
    @Builder.Default
    private Boolean beforeFood = false;

    @Builder.Default
    private Boolean morning = false;

    @Builder.Default
    private Boolean afternoon = false;

    @Builder.Default
    private Boolean evening = false;

    @Builder.Default
    private Boolean night = false;
}
