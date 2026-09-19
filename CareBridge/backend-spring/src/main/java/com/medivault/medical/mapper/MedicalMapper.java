package com.medivault.medical.mapper;

import com.medivault.medical.dto.MedicalDocumentDto;
import com.medivault.medical.dto.MedicalRecordDto;
import com.medivault.medical.dto.MedicineReminderDto;
import com.medivault.medical.dto.OCRExtractionDto;
import com.medivault.medical.dto.PrescriptionDto;
import com.medivault.medical.dto.PrescriptionMedicineDto;
import com.medivault.medical.entity.MedicalDocument;
import com.medivault.medical.entity.MedicalRecord;
import com.medivault.medical.entity.MedicineReminder;
import com.medivault.medical.entity.OCRExtraction;
import com.medivault.medical.entity.Prescription;
import com.medivault.medical.entity.PrescriptionMedicine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MedicalMapper {

    @Mapping(target = "patientId", source = "patient.id")
    @Mapping(target = "patientName", source = "patient.fullName")
    @Mapping(target = "doctorId", source = "doctor.id")
    @Mapping(target = "doctorName", source = "doctor.fullName")
    @Mapping(target = "appointmentId", source = "appointment.id")
    MedicalRecordDto toRecordDto(MedicalRecord entity);

    List<MedicalRecordDto> toRecordDtoList(List<MedicalRecord> entities);

    @Mapping(target = "medicalRecordId", source = "medicalRecord.id")
    @Mapping(target = "doctorId", source = "doctor.id")
    @Mapping(target = "doctorName", source = "doctor.fullName")
    @Mapping(target = "patientId", source = "patient.id")
    @Mapping(target = "patientName", source = "patient.fullName")
    PrescriptionDto toPrescriptionDto(Prescription entity);

    List<PrescriptionDto> toPrescriptionDtoList(List<Prescription> entities);

    PrescriptionMedicineDto toMedicineDto(PrescriptionMedicine entity);

    List<PrescriptionMedicineDto> toMedicineDtoList(List<PrescriptionMedicine> entities);

    @Mapping(target = "patientId", source = "patient.id")
    @Mapping(target = "doctorId", ignore = true)
    @Mapping(target = "appointmentId", source = "appointment.id")
    @Mapping(target = "medicalRecordId", source = "medicalRecord.id")
    MedicalDocumentDto toDocumentDto(MedicalDocument entity);

    List<MedicalDocumentDto> toDocumentDtoList(List<MedicalDocument> entities);

    @Mapping(target = "medicalDocumentId", source = "medicalDocument.id")
    OCRExtractionDto toOcrDto(OCRExtraction entity);

    @Mapping(target = "patientId", source = "patient.id")
    @Mapping(target = "medicineName", source = "prescriptionMedicine.medicineName")
    @Mapping(target = "dosage", source = "prescriptionMedicine.dosage")
    @Mapping(target = "instructions", source = "prescriptionMedicine.instructions")
    MedicineReminderDto toReminderDto(MedicineReminder entity);

    List<MedicineReminderDto> toReminderDtoList(List<MedicineReminder> entities);

    default java.time.ZonedDateTime map(java.time.Instant instant) {
        return instant == null ? null : instant.atZone(java.time.ZoneId.of("UTC"));
    }
}
