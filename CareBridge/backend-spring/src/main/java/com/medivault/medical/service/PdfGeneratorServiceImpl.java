package com.medivault.medical.service;

import com.medivault.medical.entity.Prescription;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class PdfGeneratorServiceImpl implements PdfGeneratorService {
    @Override
    public String generatePrescriptionPdf(Prescription prescription) {
        log.info("Generating PDF for prescription: {}", prescription.getPrescriptionNumber());
        // In real world, use iText or OpenPDF, then upload to Cloudinary
        return "https://storage.medivault.com/prescriptions/" + UUID.randomUUID() + ".pdf";
    }
}
