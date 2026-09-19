package com.medivault.appointment.service;

import com.medivault.appointment.dto.AppointmentDto;
import com.medivault.appointment.dto.AppointmentStatusHistoryDto;
import com.medivault.appointment.dto.AvailableSlotDto;
import com.medivault.appointment.dto.BookAppointmentRequest;
import com.medivault.appointment.entity.Appointment;
import com.medivault.appointment.entity.AppointmentQRCode;
import com.medivault.appointment.entity.AppointmentStatus;
import com.medivault.appointment.entity.AppointmentStatusHistory;
import com.medivault.appointment.mapper.AppointmentMapper;
import com.medivault.appointment.repository.AppointmentQRCodeRepository;
import com.medivault.appointment.repository.AppointmentRepository;
import com.medivault.appointment.repository.AppointmentStatusHistoryRepository;
import com.medivault.doctor.entity.Doctor;
import com.medivault.doctor.repository.DoctorRepository;
import com.medivault.exception.BadRequestException;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.patient.entity.Patient;
import com.medivault.patient.repository.PatientRepository;
import com.medivault.security.entity.User;
import com.medivault.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentStatusHistoryRepository historyRepository;
    private final AppointmentQRCodeRepository qrCodeRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    
    private final AppointmentSlotService slotService;
    private final EmailNotificationService emailService;
    private final AppointmentMapper appointmentMapper;

    @Override
    @Transactional
    public AppointmentDto bookAppointment(UUID userId, BookAppointmentRequest request) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        // No rigid slot blocking - allow the doctor to decide on conflicts
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .hospital(doctor.getHospital())
                .department(doctor.getDepartment())
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .consultationMode(request.getConsultationMode())
                .reason(request.getReason())
                .symptoms(request.getSymptoms())
                .notes(request.getNotes())
                .currentStatus(AppointmentStatus.PENDING)
                .build();

        appointment = appointmentRepository.save(appointment);

        // Record History
        recordStatusHistory(appointment, null, AppointmentStatus.PENDING, patient.getUser(), "Appointment Requested");

        // Send Email
        emailService.sendAppointmentRequested(appointment);

        return appointmentMapper.toDto(appointment);
    }

    private void recordStatusHistory(Appointment appointment, AppointmentStatus oldStatus, AppointmentStatus newStatus, User user, String remarks) {
        AppointmentStatusHistory history = AppointmentStatusHistory.builder()
                .appointment(appointment)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedBy(user)
                .remarks(remarks)
                .build();
        historyRepository.save(history);
    }

    private void generateQRCode(Appointment appointment) {
        String token = UUID.randomUUID().toString();
        // Assume QR is valid until end of appointment day
        ZonedDateTime expiry = appointment.getAppointmentDate().atTime(23, 59, 59).atZone(java.time.ZoneId.of("UTC"));
        
        AppointmentQRCode qr = AppointmentQRCode.builder()
                .appointment(appointment)
                .validationToken(token)
                .expiryTime(expiry)
                .status("ACTIVE")
                .build();
        qrCodeRepository.save(qr);
        appointment.setQrCode(qr);
    }

    @Override
    public List<AppointmentDto> getPatientAppointments(UUID userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return appointmentMapper.toDtoList(appointmentRepository.findByPatientId(patient.getId()));
    }

    @Override
    public AppointmentDto getPatientAppointmentDetails(UUID userId, UUID appointmentId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
                
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new BadRequestException("Unauthorized access to appointment");
        }
        return appointmentMapper.toDto(appointment);
    }

    @Override
    @Transactional
    public AppointmentDto rescheduleAppointment(UUID userId, UUID appointmentId, BookAppointmentRequest request) {
        // This is if patient wants to initiate a reschedule of an already approved one. (Optional enhancement)
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
                
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new BadRequestException("Unauthorized access to appointment");
        }
        
        if (appointment.getCurrentStatus() == AppointmentStatus.CANCELLED || appointment.getCurrentStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot reschedule a cancelled or completed appointment");
        }

        AppointmentStatus oldStatus = appointment.getCurrentStatus();
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setCurrentStatus(AppointmentStatus.PENDING);
        appointment.setRescheduleCount(appointment.getRescheduleCount() + 1);

        appointment = appointmentRepository.save(appointment);

        recordStatusHistory(appointment, oldStatus, AppointmentStatus.PENDING, patient.getUser(), "Rescheduled by patient (now pending approval)");
        
        emailService.sendAppointmentRequested(appointment);

        return appointmentMapper.toDto(appointment);
    }

    @Override
    @Transactional
    public AppointmentDto acceptReschedule(UUID userId, UUID appointmentId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new BadRequestException("Unauthorized access to appointment");
        }

        if (appointment.getCurrentStatus() != AppointmentStatus.RESCHEDULED) {
            throw new BadRequestException("Appointment is not pending a reschedule proposal");
        }

        AppointmentStatus oldStatus = appointment.getCurrentStatus();
        appointment.setAppointmentDate(appointment.getProposedDate());
        appointment.setAppointmentTime(appointment.getProposedTime());
        appointment.setCurrentStatus(AppointmentStatus.APPROVED);
        appointment.setProposedDate(null);
        appointment.setProposedTime(null);
        
        generateQRCode(appointment);
        
        appointment = appointmentRepository.save(appointment);

        recordStatusHistory(appointment, oldStatus, AppointmentStatus.APPROVED, patient.getUser(), "Patient accepted proposed reschedule");
        
        emailService.sendAppointmentApproved(appointment);
        emailService.sendQRCodeEmail(appointment);

        return appointmentMapper.toDto(appointment);
    }

    @Override
    @Transactional
    public AppointmentDto declineReschedule(UUID userId, UUID appointmentId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new BadRequestException("Unauthorized access to appointment");
        }

        if (appointment.getCurrentStatus() != AppointmentStatus.RESCHEDULED) {
            throw new BadRequestException("Appointment is not pending a reschedule proposal");
        }

        AppointmentStatus oldStatus = appointment.getCurrentStatus();
        appointment.setCurrentStatus(AppointmentStatus.CANCELLED);
        appointment.setCancellationReason("Patient declined proposed reschedule time");
        appointment.setProposedDate(null);
        appointment.setProposedTime(null);

        appointment = appointmentRepository.save(appointment);
        recordStatusHistory(appointment, oldStatus, AppointmentStatus.CANCELLED, patient.getUser(), "Declined reschedule");
        
        emailService.sendAppointmentCancelled(appointment);

        return appointmentMapper.toDto(appointment);
    }

    @Override
    @Transactional
    public void cancelAppointment(UUID userId, UUID appointmentId, String reason) {
        User user = userRepository.findById(userId).orElseThrow();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        if (user.getRole().name().equals("ROLE_PATIENT")) {
            Patient patient = patientRepository.findByUserId(userId).orElseThrow();
            if (!appointment.getPatient().getId().equals(patient.getId())) {
                throw new BadRequestException("Unauthorized");
            }
        } else if (user.getRole().name().equals("ROLE_DOCTOR")) {
            Doctor doctor = doctorRepository.findByUserId(userId).orElseThrow();
            if (!appointment.getDoctor().getId().equals(doctor.getId())) {
                throw new BadRequestException("Unauthorized");
            }
        }

        if (appointment.getCurrentStatus() == AppointmentStatus.CANCELLED || appointment.getCurrentStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Appointment is already cancelled or completed");
        }

        AppointmentStatus oldStatus = appointment.getCurrentStatus();
        appointment.setCurrentStatus(AppointmentStatus.CANCELLED);
        appointment.setCancellationReason(reason);
        
        if (appointment.getQrCode() != null) {
            appointment.getQrCode().setStatus("EXPIRED");
        }

        appointmentRepository.save(appointment);
        recordStatusHistory(appointment, oldStatus, AppointmentStatus.CANCELLED, user, "Cancelled. Reason: " + reason);
        emailService.sendAppointmentCancelled(appointment);
    }

    @Override
    public List<AppointmentDto> getDoctorAppointments(UUID userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return appointmentMapper.toDtoList(appointmentRepository.findByDoctorId(doctor.getId()));
    }

    @Override
    @Transactional
    public AppointmentDto approveAppointment(UUID userId, UUID appointmentId, String remarks) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("Unauthorized access to appointment");
        }

        if (appointment.getCurrentStatus() != AppointmentStatus.PENDING) {
            throw new BadRequestException("Only pending appointments can be approved");
        }

        AppointmentStatus oldStatus = appointment.getCurrentStatus();
        appointment.setCurrentStatus(AppointmentStatus.APPROVED);
        
        generateQRCode(appointment);

        appointmentRepository.save(appointment);
        recordStatusHistory(appointment, oldStatus, AppointmentStatus.APPROVED, doctor.getUser(), remarks);
        
        emailService.sendAppointmentApproved(appointment);
        emailService.sendQRCodeEmail(appointment);

        return appointmentMapper.toDto(appointment);
    }

    @Override
    @Transactional
    public AppointmentDto rejectAppointment(UUID userId, UUID appointmentId, String reason, String remarks) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("Unauthorized access to appointment");
        }

        if (appointment.getCurrentStatus() != AppointmentStatus.PENDING) {
            throw new BadRequestException("Only pending appointments can be rejected");
        }

        AppointmentStatus oldStatus = appointment.getCurrentStatus();
        appointment.setCurrentStatus(AppointmentStatus.REJECTED);
        appointment.setRejectionReason(reason);

        appointmentRepository.save(appointment);
        recordStatusHistory(appointment, oldStatus, AppointmentStatus.REJECTED, doctor.getUser(), remarks);
        
        emailService.sendAppointmentRejected(appointment);

        return appointmentMapper.toDto(appointment);
    }

    @Override
    @Transactional
    public AppointmentDto proposeReschedule(UUID userId, UUID appointmentId, LocalDate newDate, LocalTime newTime, String remarks) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("Unauthorized access to appointment");
        }

        if (appointment.getCurrentStatus() != AppointmentStatus.PENDING) {
            throw new BadRequestException("Only pending appointments can be proposed for reschedule");
        }

        AppointmentStatus oldStatus = appointment.getCurrentStatus();
        appointment.setCurrentStatus(AppointmentStatus.RESCHEDULED);
        appointment.setProposedDate(newDate);
        appointment.setProposedTime(newTime);
        appointment.setRescheduleCount(appointment.getRescheduleCount() + 1);

        appointmentRepository.save(appointment);
        recordStatusHistory(appointment, oldStatus, AppointmentStatus.RESCHEDULED, doctor.getUser(), remarks);
        
        emailService.sendAppointmentRescheduled(appointment);

        return appointmentMapper.toDto(appointment);
    }

    @Override
    @Transactional
    public AppointmentDto markCompleted(UUID userId, UUID appointmentId, String remarks) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("Unauthorized access to appointment");
        }

        if (appointment.getCurrentStatus() != AppointmentStatus.APPROVED) {
            throw new BadRequestException("Only approved appointments can be marked completed");
        }

        AppointmentStatus oldStatus = appointment.getCurrentStatus();
        appointment.setCurrentStatus(AppointmentStatus.COMPLETED);
        
        if (appointment.getQrCode() != null) {
            appointment.getQrCode().setStatus("EXPIRED");
        }

        appointmentRepository.save(appointment);
        recordStatusHistory(appointment, oldStatus, AppointmentStatus.COMPLETED, doctor.getUser(), remarks);
        
        emailService.sendAppointmentCompleted(appointment);

        return appointmentMapper.toDto(appointment);
    }

    @Override
    @Transactional
    public AppointmentDto validateQRCode(UUID userId, String validationToken) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        
        AppointmentQRCode qrCode = qrCodeRepository.findByValidationToken(validationToken)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid QR Code"));
                
        if (!qrCode.getAppointment().getDoctor().getId().equals(doctor.getId())) {
            throw new BadRequestException("This QR code belongs to a different doctor's appointment");
        }
        
        if (!"ACTIVE".equals(qrCode.getStatus()) || qrCode.getExpiryTime().isBefore(ZonedDateTime.now())) {
            throw new BadRequestException("QR Code is expired or already used");
        }

        Appointment appointment = qrCode.getAppointment();
        if (appointment.getCurrentStatus() != AppointmentStatus.APPROVED) {
            throw new BadRequestException("Appointment is not approved");
        }

        qrCode.setStatus("USED");
        
        appointmentRepository.save(appointment);
        qrCodeRepository.save(qrCode);
        
        recordStatusHistory(appointment, appointment.getCurrentStatus(), appointment.getCurrentStatus(), doctor.getUser(), "Checked in via QR Code scan");

        return appointmentMapper.toDto(appointment);
    }

    @Override
    public List<AppointmentStatusHistoryDto> getAppointmentHistory(UUID appointmentId) {
        return appointmentMapper.toHistoryDtoList(historyRepository.findByAppointmentIdOrderByChangedAtDesc(appointmentId));
    }
}
