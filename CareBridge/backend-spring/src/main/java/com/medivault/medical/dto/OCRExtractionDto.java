package com.medivault.medical.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class OCRExtractionDto {
    private UUID id;
    private UUID medicalDocumentId;
    private String rawText;
    private String structuredData;
    private String aiSummary;
    private Double confidenceScore;
    private Boolean manuallyCorrected;
    private ZonedDateTime createdAt;
}
