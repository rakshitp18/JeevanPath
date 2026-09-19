package com.medivault.medical.service.ocr;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class GoogleVisionOCRImpl implements OCRService {

    @Override
    public ExtractionResult extractText(String fileUrl) {
        log.info("Extracting text using Google Vision OCR for URL: {}", fileUrl);
        // Stub for Google Vision API call
        return ExtractionResult.builder()
                .rawText("Dr. John Doe\nRx\nParacetamol 500mg 1-1-1 5 days\nAmoxicillin 500mg 1-0-1 5 days\nDiagnosis: Viral Fever")
                .confidence(0.95)
                .provider("GOOGLE_VISION")
                .build();
    }
}
