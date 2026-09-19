package com.medivault.medical.service;

import com.medivault.medical.dto.CreateMedicalRecordRequest;
import com.medivault.medical.dto.MedicalRecordDto;
import com.medivault.medical.dto.MedicalDocumentDto;

import java.util.List;
import java.util.UUID;

public interface MedicalRecordService {
    MedicalRecordDto createRecord(UUID doctorId, CreateMedicalRecordRequest request);
    List<MedicalRecordDto> getPatientRecords(UUID patientId);
    List<MedicalRecordDto> getDoctorRecords(UUID doctorId);
    MedicalRecordDto getRecordDetails(UUID recordId);
    List<MedicalDocumentDto> getPatientDocuments(UUID patientId);
    List<MedicalDocumentDto> getDoctorDocuments(UUID doctorId);
    MedicalDocumentDto uploadDocument(UUID patientId, org.springframework.web.multipart.MultipartFile file, String title, String documentType, String description, String doctorIds);
}
