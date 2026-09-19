package com.medivault.medical.service;

import com.medivault.doctor.entity.Doctor;
import com.medivault.doctor.repository.DoctorRepository;
import com.medivault.exception.BadRequestException;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.medical.dto.IssuePrescriptionRequest;
import com.medivault.medical.dto.PrescriptionDto;
import com.medivault.medical.entity.MedicalRecord;
import com.medivault.medical.entity.Prescription;
import com.medivault.medical.entity.PrescriptionMedicine;
import com.medivault.medical.mapper.MedicalMapper;
import com.medivault.medical.repository.MedicalRecordRepository;
import com.medivault.medical.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository recordRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalMapper mapper;
    
    private final PdfGeneratorService pdfService;
    private final ReminderEngineService reminderService;

    @Override
    @Transactional
    public PrescriptionDto issuePrescription(UUID userId, UUID medicalRecordId, IssuePrescriptionRequest request) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        MedicalRecord record = recordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("Medical Record not found"));

        if (!record.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("Unauthorized: Cannot issue prescription for another doctor's record");
        }

        if (record.getPrescription() != null) {
            throw new BadRequestException("Medical Record already has a prescription");
        }

        Prescription prescription = Prescription.builder()
                .medicalRecord(record)
                .doctor(doctor)
                .patient(record.getPatient())
                .appointment(record.getAppointment())
                .prescriptionNumber("RX-" + System.currentTimeMillis())
                .issueDate(LocalDate.now())
                .notes(request.getNotes())
                .build();

        List<PrescriptionMedicine> medicines = request.getMedicines().stream().map(dto -> {
            PrescriptionMedicine medicine = new PrescriptionMedicine();
            medicine.setPrescription(prescription);
            medicine.setMedicineName(dto.getMedicineName());
            medicine.setGenericName(dto.getGenericName());
            medicine.setDosage(dto.getDosage());
            medicine.setFrequency(dto.getFrequency());
            medicine.setDurationDays(dto.getDurationDays());
            medicine.setRoute(dto.getRoute());
            medicine.setInstructions(dto.getInstructions());
            medicine.setBeforeFood(dto.getBeforeFood() != null ? dto.getBeforeFood() : false);
            medicine.setMorning(dto.getMorning() != null ? dto.getMorning() : false);
            medicine.setAfternoon(dto.getAfternoon() != null ? dto.getAfternoon() : false);
            medicine.setEvening(dto.getEvening() != null ? dto.getEvening() : false);
            medicine.setNight(dto.getNight() != null ? dto.getNight() : false);
            return medicine;
        }).collect(Collectors.toList());

        prescription.setMedicines(medicines);
        
        // Generate PDF
        String pdfUrl = pdfService.generatePrescriptionPdf(prescription);
        prescription.setPdfUrl(pdfUrl);

        Prescription saved = prescriptionRepository.save(prescription);
        record.setPrescription(saved);
        recordRepository.save(record);

        // Generate Reminders
        reminderService.generateReminders(saved);

        return mapper.toPrescriptionDto(saved);
    }

    @Override
    public List<PrescriptionDto> getPatientPrescriptions(UUID patientId) {
        return mapper.toPrescriptionDtoList(prescriptionRepository.findByPatientIdOrderByIssueDateDesc(patientId));
    }
}
