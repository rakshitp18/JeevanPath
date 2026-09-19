package com.medivault.medical.entity;

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
import java.time.LocalTime;

@Entity
@Table(name = "medicine_reminders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineReminder extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "prescription_medicine_id", nullable = false)
    private PrescriptionMedicine prescriptionMedicine;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "reminder_time", nullable = false)
    private LocalTime reminderTime;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(length = 50)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, INACTIVE
}
