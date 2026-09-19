package com.medivault.analytics.service;

import com.medivault.analytics.dto.AnalyticsDashboardDataDto;
import com.medivault.analytics.dto.AnalyticsSummaryDataDto;
import com.medivault.analytics.dto.VitalLogDto;

import java.util.List;
import java.util.UUID;

public interface AnalyticsService {
    AnalyticsDashboardDataDto getDashboardData(UUID userId);
    AnalyticsSummaryDataDto getSummaryData(UUID userId);
    List<VitalLogDto> getVitalsHistory(UUID userId);
    VitalLogDto saveVitals(UUID userId, VitalLogDto dto);
}
