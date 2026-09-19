package com.medivault.medical.service.ocr;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AIProcessorServiceImpl implements AIProcessorService {

    @Override
    public AIAnalysisResult analyzeMedicalText(String rawText) {
        log.info("Processing OCR text through AI pipeline");
        // Stub for OpenAI / Vertex AI call to parse unstructured medical text into JSON
        String mockJson = "{ \"medicines\": [ { \"name\": \"Paracetamol\", \"dosage\": \"500mg\", \"frequency\": \"1-1-1\", \"duration\": \"5 days\" } ], \"diagnosis\": \"Viral Fever\" }";
        
        return AIAnalysisResult.builder()
                .structuredJson(mockJson)
                .summary("Patient diagnosed with Viral Fever. Prescribed Paracetamol and Amoxicillin for 5 days.")
                .build();
    }
}
