package com.medivault.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskIndicatorDto {
    private String key;
    private String title;
    private String status;
    private String severity; // "good", "warning", "neutral"
}
