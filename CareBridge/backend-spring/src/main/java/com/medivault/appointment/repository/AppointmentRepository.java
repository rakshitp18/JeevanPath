package com.medivault.appointment.repository;

import com.medivault.appointment.entity.Appointment;
import com.medivault.appointment.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByPatientId(UUID patientId);
    List<Appointment> findByDoctorId(UUID doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDate(UUID doctorId, LocalDate date);
    
    // Find non-cancelled appointments for a doctor on a specific date to prevent overlapping
    List<Appointment> findByDoctorIdAndAppointmentDateAndCurrentStatusNotIn(UUID doctorId, LocalDate date, List<AppointmentStatus> statuses);
}
