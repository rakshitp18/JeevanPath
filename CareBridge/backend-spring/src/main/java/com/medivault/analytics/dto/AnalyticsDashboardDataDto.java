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
public class AnalyticsDashboardDataDto {
    private Double healthScore;
    private String healthScoreBand;
    private AnalyticsTrendsDto trends;
    private List<String> riskFlags;
    private List<String> recommendations;
    private VitalLogDto latestVitals;
    private AnalyticsChartsDataDto chartsData;
    private List<String> summaryInsights;
    private List<RiskIndicatorDto> riskIndicators;
    private ReportAnalysisDto reportAnalysis;
    private String quickSummary;
    private Instant lastUpdated;
}
