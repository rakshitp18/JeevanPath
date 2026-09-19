package com.medivault.medical.service.ocr;

import lombok.Builder;
import lombok.Data;

public interface OCRService {
    ExtractionResult extractText(String fileUrl);

    @Data
    @Builder
    class ExtractionResult {
        private String rawText;
        private Double confidence;
        private String provider;
    }
}
