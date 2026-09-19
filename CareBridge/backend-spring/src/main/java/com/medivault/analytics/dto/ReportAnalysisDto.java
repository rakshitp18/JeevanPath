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
public class ReportAnalysisDto {
    private Integer reportCount;
    private LocalDate lastReportDate;
    private List<ReportSignalDto> signals;
    private List<String> recommendations;
}
