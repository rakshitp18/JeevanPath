package com.medivault.platform.dashboard.service;

import com.medivault.appointment.entity.Appointment;
import com.medivault.appointment.repository.AppointmentRepository;
import com.medivault.doctor.entity.Doctor;
import com.medivault.doctor.repository.DoctorRepository;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.patient.entity.Patient;
import com.medivault.patient.repository.PatientRepository;
import com.medivault.platform.dashboard.dto.DoctorDashboardDto;
import com.medivault.platform.dashboard.dto.PatientDashboardDto;
import com.medivault.platform.emergency.entity.EmergencyProfile;
import com.medivault.platform.emergency.repository.EmergencyProfileRepository;
import com.medivault.platform.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationRepository notificationRepository;
    private final EmergencyProfileRepository emergencyProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public PatientDashboardDto getPatientDashboard(UUID userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        int unreadNotifications = notificationRepository.countByUserIdAndIsReadFalse(userId);
        
        Optional<EmergencyProfile> profile = emergencyProfileRepository.findByPatientId(patient.getId());
        boolean emergencyConfigured = profile.isPresent() && Boolean.TRUE.equals(profile.get().getIsEnabled());

        return PatientDashboardDto.builder()
                .activeReminders(0) // Stub for medicine reminders count
                .unreadNotifications(unreadNotifications)
                .emergencyProfileConfigured(emergencyConfigured)
                .upcomingAppointments(List.of()) // Stub for upcoming appointments
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorDashboardDto getDoctorDashboard(UUID userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        List<Appointment> todayAppointments = appointmentRepository.findByDoctorId(doctor.getId()).stream()
                .filter(app -> app.getAppointmentDate().equals(LocalDate.now()))
                .collect(Collectors.toList());

        long completed = todayAppointments.stream()
                .filter(app -> app.getCurrentStatus().equals("COMPLETED"))
                .count();

        long pending = todayAppointments.stream()
                .filter(app -> app.getCurrentStatus().equals("CONFIRMED") || app.getCurrentStatus().equals("CHECKED_IN"))
                .count();

        return DoctorDashboardDto.builder()
                .todayAppointmentsCount(todayAppointments.size())
                .completedConsultations((int) completed)
                .pendingConsultations((int) pending)
                .totalPatients(0) // Stub
                .todayAppointments(List.of()) // Stub
                .build();
    }
}
