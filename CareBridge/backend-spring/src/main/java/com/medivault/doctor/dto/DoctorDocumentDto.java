package com.medivault.doctor.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDocumentDto {
    private UUID id;
    private String documentType;
    private String documentUrl;
    private LocalDate uploadedAt;
}
