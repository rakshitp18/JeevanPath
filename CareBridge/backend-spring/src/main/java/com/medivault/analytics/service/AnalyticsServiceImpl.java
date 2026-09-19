package com.medivault.analytics.service;

import com.medivault.analytics.dto.*;
import com.medivault.analytics.entity.VitalLog;
import com.medivault.analytics.mapper.AnalyticsMapper;
import com.medivault.analytics.repository.VitalLogRepository;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.medical.entity.MedicalDocument;
import com.medivault.medical.repository.MedicalDocumentRepository;
import com.medivault.patient.entity.Patient;
import com.medivault.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final VitalLogRepository vitalLogRepository;
    private final AnalyticsMapper analyticsMapper;
    private final PatientRepository patientRepository;
    private final MedicalDocumentRepository medicalDocumentRepository;

    private Patient getPatientByUserId(UUID userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user ID: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsDashboardDataDto getDashboardData(UUID userId) {
        Patient patient = getPatientByUserId(userId);
        List<VitalLog> logs = vitalLogRepository.findByPatientIdOrderByDateDesc(patient.getId());
        List<MedicalDocument> documents = medicalDocumentRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId());

        VitalLog latest = logs.isEmpty() ? null : logs.get(0);
        VitalLogDto latestDto = latest == null ? null : analyticsMapper.toDto(latest);

        Double score = calculateHealthScore(latest);
        String band = calculateHealthBand(score);

        AnalyticsTrendsDto trends = calculateTrends(logs);
        AnalyticsChartsDataDto charts = buildChartsData(logs);
        List<RiskIndicatorDto> indicators = buildRiskIndicators(latest);
        
        List<String> riskFlags = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();
        if (latest != null) {
            generateInsightsAndRecommendations(latest, riskFlags, recommendations);
        }

        ReportAnalysisDto reportAnalysis = buildReportAnalysis(documents);

        String summary = logs.isEmpty() ? "Log your vitals to start analytics." : "Your health score is " + band + ". Keep logging vitals!";

        return AnalyticsDashboardDataDto.builder()
                .healthScore(score)
                .healthScoreBand(band)
                .trends(trends)
                .riskFlags(riskFlags)
                .recommendations(recommendations)
                .latestVitals(latestDto)
                .chartsData(charts)
                .summaryInsights(List.of("Based on your recent vitals, your overall health is " + band.toLowerCase()))
                .riskIndicators(indicators)
                .reportAnalysis(reportAnalysis)
                .quickSummary(summary)
                .lastUpdated(latest != null ? latest.getUpdatedAt() : Instant.now())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryDataDto getSummaryData(UUID userId) {
        Patient patient = getPatientByUserId(userId);
        List<VitalLog> logs = vitalLogRepository.findByPatientIdOrderByDateDesc(patient.getId());
        VitalLog latest = logs.isEmpty() ? null : logs.get(0);

        Double score = calculateHealthScore(latest);
        String band = calculateHealthBand(score);

        List<String> riskFlags = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();
        if (latest != null) {
            generateInsightsAndRecommendations(latest, riskFlags, recommendations);
        }

        return AnalyticsSummaryDataDto.builder()
                .healthScore(score)
                .healthScoreBand(band)
                .insights(List.of("Your health score is tracking as " + band))
                .riskFlags(riskFlags)
                .recommendations(recommendations)
                .lastUpdated(latest != null ? latest.getUpdatedAt() : Instant.now())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VitalLogDto> getVitalsHistory(UUID userId) {
        Patient patient = getPatientByUserId(userId);
        return vitalLogRepository.findByPatientIdOrderByDateDesc(patient.getId())
                .stream()
                .map(analyticsMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VitalLogDto saveVitals(UUID userId, VitalLogDto dto) {
        Patient patient = getPatientByUserId(userId);
        VitalLog vitalLog = analyticsMapper.toEntity(dto);
        vitalLog.setPatient(patient);
        if (vitalLog.getDate() == null) {
            vitalLog.setDate(LocalDate.now());
        }
        
        // Compute BMI if weight and height are provided but BMI is not
        if (vitalLog.getBmi() == null && vitalLog.getWeight() != null && vitalLog.getHeight() != null && vitalLog.getHeight() > 0) {
            double heightInMeters = vitalLog.getHeight() / 100.0;
            double bmi = vitalLog.getWeight() / (heightInMeters * heightInMeters);
            vitalLog.setBmi(Math.round(bmi * 10.0) / 10.0);
        }

        vitalLog = vitalLogRepository.save(vitalLog);
        return analyticsMapper.toDto(vitalLog);
    }

    private Double calculateHealthScore(VitalLog latest) {
        if (latest == null) return 0.0;
        double score = 100.0;
        
        if (latest.getBmi() != null) {
            if (latest.getBmi() > 25 || latest.getBmi() < 18.5) score -= 10;
        }
        if (latest.getBloodPressureSystolic() != null) {
            if (latest.getBloodPressureSystolic() > 130) score -= 15;
            else if (latest.getBloodPressureSystolic() < 90) score -= 10;
        }
        if (latest.getOxygenLevel() != null) {
            if (latest.getOxygenLevel() < 95) score -= 20;
        }
        if (latest.getBloodSugarFasting() != null) {
            if (latest.getBloodSugarFasting() > 100) score -= 10;
        }
        
        return Math.max(0.0, score);
    }

    private String calculateHealthBand(Double score) {
        if (score == 0) return "Needs Attention";
        if (score >= 90) return "Excellent";
        if (score >= 75) return "Good";
        if (score >= 60) return "Fair";
        return "Needs Attention";
    }

    private AnalyticsTrendsDto calculateTrends(List<VitalLog> logs) {
        if (logs.isEmpty()) {
            return new AnalyticsTrendsDto(
                createEmptyTrend(), createEmptyTrend(), createEmptyTrend(), createEmptyTrend()
            );
        }
        
        // Simplified trend calculation based on the latest vs previous
        VitalLog latest = logs.get(0);
        VitalLog previous = logs.size() > 1 ? logs.get(1) : null;
        
        return new AnalyticsTrendsDto(
            compareTrend(latest.getWeight(), previous != null ? previous.getWeight() : null),
            compareTrend(latest.getBloodPressureSystolic() != null ? (double) latest.getBloodPressureSystolic() : null, 
                         previous != null && previous.getBloodPressureSystolic() != null ? (double) previous.getBloodPressureSystolic() : null),
            compareTrend(latest.getBloodSugarFasting(), previous != null ? previous.getBloodSugarFasting() : null),
            compareTrend(latest.getSleepHours(), previous != null ? previous.getSleepHours() : null)
        );
    }
    
    private AnalyticsTrendInfoDto createEmptyTrend() {
        return new AnalyticsTrendInfoDto("stable", null, null, "Insufficient historical data.");
    }
    
    private AnalyticsTrendInfoDto compareTrend(Double current, Double previous) {
        if (current == null) return createEmptyTrend();
        if (previous == null) return new AnalyticsTrendInfoDto("stable", current, null, "First reading recorded.");
        
        String direction = "stable";
        if (current > previous * 1.05) direction = "up";
        else if (current < previous * 0.95) direction = "down";
        
        return new AnalyticsTrendInfoDto(direction, current, previous, "Compared to last reading.");
    }

    private AnalyticsChartsDataDto buildChartsData(List<VitalLog> logs) {
        List<AnalyticsChartsDataDto.WeightData> weight = new ArrayList<>();
        List<AnalyticsChartsDataDto.BloodPressureData> bp = new ArrayList<>();
        List<AnalyticsChartsDataDto.SugarData> sugar = new ArrayList<>();
        List<AnalyticsChartsDataDto.SleepData> sleep = new ArrayList<>();

        // limit to 30 records and reverse for chronological order
        List<VitalLog> chartLogs = logs.stream().limit(30).collect(Collectors.toList());
        Collections.reverse(chartLogs);

        for (VitalLog log : chartLogs) {
            String date = log.getDate().toString();
            weight.add(new AnalyticsChartsDataDto.WeightData(date, log.getWeight()));
            bp.add(new AnalyticsChartsDataDto.BloodPressureData(date, log.getBloodPressureSystolic(), log.getBloodPressureDiastolic()));
            sugar.add(new AnalyticsChartsDataDto.SugarData(date, log.getBloodSugarFasting(), log.getBloodSugarRandom()));
            sleep.add(new AnalyticsChartsDataDto.SleepData(date, log.getSleepHours()));
        }

        return new AnalyticsChartsDataDto(weight, bp, sugar, sleep);
    }

    private List<RiskIndicatorDto> buildRiskIndicators(VitalLog latest) {
        List<RiskIndicatorDto> indicators = new ArrayList<>();
        if (latest == null) {
            indicators.add(new RiskIndicatorDto("bp", "Blood Pressure", "Unknown", "neutral"));
            indicators.add(new RiskIndicatorDto("bmi", "BMI", "Unknown", "neutral"));
            indicators.add(new RiskIndicatorDto("sleep", "Sleep", "Unknown", "neutral"));
            indicators.add(new RiskIndicatorDto("sugar", "Blood Sugar", "Unknown", "neutral"));
            return indicators;
        }

        indicators.add(buildRisk("bp", "Blood Pressure", latest.getBloodPressureSystolic(), 90, 120, 130));
        indicators.add(buildRisk("bmi", "BMI", latest.getBmi(), 18.5, 24.9, 29.9));
        indicators.add(buildRisk("sleep", "Sleep", latest.getSleepHours(), 7.0, 9.0, 6.0));
        indicators.add(buildRisk("sugar", "Blood Sugar", latest.getBloodSugarFasting(), 70.0, 99.0, 125.0));
        
        return indicators;
    }
    
    private RiskIndicatorDto buildRisk(String key, String title, Number value, double minGood, double maxGood, double warningThreshold) {
        if (value == null) return new RiskIndicatorDto(key, title, "Unknown", "neutral");
        double val = value.doubleValue();
        
        if (val >= minGood && val <= maxGood) return new RiskIndicatorDto(key, title, "Normal", "good");
        if (val > warningThreshold || val < (minGood * 0.9)) return new RiskIndicatorDto(key, title, "High Risk", "warning");
        return new RiskIndicatorDto(key, title, "Elevated", "warning");
    }

    private void generateInsightsAndRecommendations(VitalLog latest, List<String> flags, List<String> recs) {
        if (latest.getBloodPressureSystolic() != null && latest.getBloodPressureSystolic() > 130) {
            flags.add("Elevated Blood Pressure");
            recs.add("Monitor blood pressure daily and reduce sodium intake.");
        }
        if (latest.getBmi() != null && latest.getBmi() > 25) {
            flags.add("High BMI");
            recs.add("Consider incorporating 30 minutes of aerobic exercise daily.");
        }
        if (latest.getOxygenLevel() != null && latest.getOxygenLevel() < 95) {
            flags.add("Low Oxygen Level");
            recs.add("Consult a physician regarding your oxygen saturation.");
        }
        if (latest.getSleepHours() != null && latest.getSleepHours() < 6) {
            flags.add("Poor Sleep");
            recs.add("Aim for at least 7 hours of sleep to improve recovery.");
        }
        if (flags.isEmpty()) {
            recs.add("Keep up the good work! Maintain your current healthy habits.");
        }
    }

    private ReportAnalysisDto buildReportAnalysis(List<MedicalDocument> documents) {
        List<ReportSignalDto> signals = new ArrayList<>();
        if (!documents.isEmpty()) {
            signals.add(new ReportSignalDto("doc1", "Recent Document Uploaded", "Review your latest medical record for details."));
        }
        return new ReportAnalysisDto(
            documents.size(),
            documents.isEmpty() ? null : documents.get(0).getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDate(),
            signals,
            documents.isEmpty() ? new ArrayList<>() : List.of("Discuss the latest reports with your primary care provider.")
        );
    }
}
