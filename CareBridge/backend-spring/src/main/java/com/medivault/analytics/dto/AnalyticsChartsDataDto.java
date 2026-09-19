package com.medivault.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsChartsDataDto {
    private List<WeightData> weight;
    private List<BloodPressureData> bloodPressure;
    private List<SugarData> sugar;
    private List<SleepData> sleep;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WeightData {
        private String date; // ISO date string
        private Double weight;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BloodPressureData {
        private String date;
        private Integer systolic;
        private Integer diastolic;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SugarData {
        private String date;
        private Double fasting;
        private Double random;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SleepData {
        private String date;
        private Double sleepHours;
    }
}
