package com.medivault.patient.entity;

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
@Table(name = "family_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMember extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 100)
    private String relationship;

    @Column(length = 20)
    private String gender;

    private Integer age;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "medical_notes", columnDefinition = "TEXT")
    private String medicalNotes;
}
