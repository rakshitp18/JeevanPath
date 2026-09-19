package com.medivault.medical.service.ocr;

import lombok.Builder;
import lombok.Data;

public interface AIProcessorService {
    AIAnalysisResult analyzeMedicalText(String rawText);

    @Data
    @Builder
    class AIAnalysisResult {
        private String structuredJson;
        private String summary;
    }
}
