package com.medivault.medical.entity;

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
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "ocr_extractions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OCRExtraction extends BaseEntity {

    @OneToOne(optional = false)
    @JoinColumn(name = "medical_document_id", nullable = false, unique = true)
    private MedicalDocument medicalDocument;

    @Column(name = "raw_text", columnDefinition = "TEXT")
    private String rawText;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "structured_data", columnDefinition = "jsonb")
    private String structuredData; // Store JSON string or use a custom mapped class

    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "manually_corrected")
    @Builder.Default
    private Boolean manuallyCorrected = false;
}
