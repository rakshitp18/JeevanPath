package com.medivault.appointment.service;

import com.medivault.appointment.dto.AvailableSlotDto;
import com.medivault.appointment.entity.Appointment;
import com.medivault.appointment.entity.AppointmentStatus;
import com.medivault.appointment.repository.AppointmentRepository;
import com.medivault.doctor.entity.DoctorAvailability;
import com.medivault.doctor.entity.DoctorLeave;
import com.medivault.doctor.repository.DoctorAvailabilityRepository;
import com.medivault.doctor.repository.DoctorLeaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentSlotServiceImpl implements AppointmentSlotService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorLeaveRepository leaveRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public List<AvailableSlotDto> getAvailableSlots(UUID doctorId, LocalDate date) {
        // 1. If date is in the past, no slots available
        if (date.isBefore(LocalDate.now())) {
            return new ArrayList<>();
        }

        // 2. Check if doctor is on leave
        List<DoctorLeave> leaves = leaveRepository.findByDoctorId(doctorId);
        boolean onLeave = leaves.stream().anyMatch(leave -> 
            !date.isBefore(leave.getStartDate()) && !date.isAfter(leave.getEndDate()) && "APPROVED".equals(leave.getStatus())
        );
        if (onLeave) {
            return new ArrayList<>(); // No slots on leave days
        }

        // 3. Get availability for the day of week
        String dayOfWeek = date.getDayOfWeek().name();
        List<DoctorAvailability> availabilities = availabilityRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek);
        if (availabilities.isEmpty()) {
            return new ArrayList<>();
        }

        // 4. Generate all possible base slots from availabilities
        List<LocalTime> baseSlots = new ArrayList<>();
        for (DoctorAvailability availability : availabilities) {
            LocalTime current = availability.getStartTime();
            while (current.plusMinutes(availability.getConsultationDuration()).isBefore(availability.getEndTime()) 
                   || current.plusMinutes(availability.getConsultationDuration()).equals(availability.getEndTime())) {
                
                // Check if current slot falls into break time
                boolean isBreak = false;
                if (availability.getBreakTime() != null) {
                     if (current.equals(availability.getBreakTime())) {
                         isBreak = true;
                     }
                }
                
                if (!isBreak) {
                    baseSlots.add(current);
                }
                
                current = current.plusMinutes(availability.getConsultationDuration());
            }
        }

        // 5. Fetch booked appointments to filter out
        List<AppointmentStatus> ignoreStatuses = Arrays.asList(AppointmentStatus.CANCELLED, AppointmentStatus.REJECTED);
        List<Appointment> bookedAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateAndCurrentStatusNotIn(doctorId, date, ignoreStatuses);
        
        List<LocalTime> bookedTimes = bookedAppointments.stream()
                .map(Appointment::getAppointmentTime)
                .collect(Collectors.toList());

        // 6. Filter slots (booked + past times for today)
        LocalTime now = LocalTime.now();
        boolean isToday = date.equals(LocalDate.now());

        return baseSlots.stream()
                .filter(slot -> !bookedTimes.contains(slot)) // Remove booked
                .filter(slot -> !isToday || slot.isAfter(now)) // Remove past times if today
                .map(slot -> new AvailableSlotDto(slot, true))
                .collect(Collectors.toList());
    }
}
