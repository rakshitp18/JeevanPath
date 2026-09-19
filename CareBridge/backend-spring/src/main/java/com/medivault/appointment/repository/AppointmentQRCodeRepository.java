package com.medivault.appointment.repository;

import com.medivault.appointment.entity.AppointmentQRCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentQRCodeRepository extends JpaRepository<AppointmentQRCode, UUID> {
    Optional<AppointmentQRCode> findByValidationToken(String token);
    Optional<AppointmentQRCode> findByAppointmentId(UUID appointmentId);
}
