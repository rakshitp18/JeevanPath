package com.medivault.appointment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class AvailableSlotDto {
    private LocalTime time;
    private boolean isAvailable; // Contextual, mostly true if returned
}
