package com.medivault.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsTrendsDto {
    private AnalyticsTrendInfoDto weight;
    private AnalyticsTrendInfoDto bloodPressure;
    private AnalyticsTrendInfoDto sugar;
    private AnalyticsTrendInfoDto sleep;
}
