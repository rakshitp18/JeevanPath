package com.medivault.medical.service;

import com.medivault.medical.entity.Prescription;

public interface PdfGeneratorService {
    String generatePrescriptionPdf(Prescription prescription);
}
