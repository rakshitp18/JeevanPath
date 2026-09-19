package com.medivault.appointment.service;

import com.medivault.appointment.dto.AvailableSlotDto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentSlotService {
    List<AvailableSlotDto> getAvailableSlots(UUID doctorId, LocalDate date);
}
