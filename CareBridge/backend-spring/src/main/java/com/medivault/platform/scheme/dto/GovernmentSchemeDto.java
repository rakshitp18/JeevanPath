package com.medivault.platform.scheme.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class GovernmentSchemeDto {
    private UUID id;
    private String schemeName;
    private String category;
    private String description;
    private String eligibilityCriteria;
    private Integer minAge;
    private Integer maxAge;
    private String gender;
    private Double maxIncome;
    private String state;
    private String websiteUrl;
    private String status;
}
