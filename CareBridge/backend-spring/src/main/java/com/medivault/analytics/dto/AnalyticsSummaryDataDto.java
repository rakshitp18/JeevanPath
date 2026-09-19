package com.medivault.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryDataDto {
    private Double healthScore;
    private String healthScoreBand;
    private List<String> insights;
    private List<String> riskFlags;
    private List<String> recommendations;
    private Instant lastUpdated;
}
