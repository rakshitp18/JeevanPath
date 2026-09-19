package com.medivault.medical.entity;

import com.medivault.appointment.entity.Appointment;
import com.medivault.common.BaseEntity;
import com.medivault.doctor.entity.Doctor;
import com.medivault.patient.entity.Patient;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "medical_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalDocument extends BaseEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToMany
    @JoinTable(
        name = "medical_document_doctors",
        joinColumns = @JoinColumn(name = "document_id"),
        inverseJoinColumns = @JoinColumn(name = "doctor_id")
    )
    @Builder.Default
    private java.util.Set<Doctor> sharedDoctors = new java.util.HashSet<>();

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @ManyToOne
    @JoinColumn(name = "medical_record_id")
    private MedicalRecord medicalRecord;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "document_type", nullable = false, length = 100)
    private String documentType;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "cloudinary_url", nullable = false)
    private String cloudinaryUrl;

    @Column(name = "public_id", nullable = false)
    private String publicId;

    @Column(name = "ocr_status", length = 50)
    @Builder.Default
    private String ocrStatus = "PENDING"; // PENDING, COMPLETED, FAILED

    @OneToOne(mappedBy = "medicalDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    private OCRExtraction ocrExtraction;
}
