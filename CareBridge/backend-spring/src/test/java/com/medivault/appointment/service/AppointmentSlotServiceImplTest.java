package com.medivault.appointment.service;

import com.medivault.appointment.dto.AvailableSlotDto;
import com.medivault.appointment.entity.Appointment;
import com.medivault.appointment.repository.AppointmentRepository;
import com.medivault.doctor.entity.DoctorAvailability;
import com.medivault.doctor.entity.DoctorLeave;
import com.medivault.doctor.repository.DoctorAvailabilityRepository;
import com.medivault.doctor.repository.DoctorLeaveRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppointmentSlotServiceImplTest {

    @Mock private DoctorAvailabilityRepository availabilityRepository;
    @Mock private DoctorLeaveRepository leaveRepository;
    @Mock private AppointmentRepository appointmentRepository;

    @InjectMocks
    private AppointmentSlotServiceImpl slotService;

    private UUID doctorId;
    private LocalDate futureDate;

    @BeforeEach
    void setUp() {
        doctorId = UUID.randomUUID();
        futureDate = LocalDate.now().plusDays(5); // Ensure it's in the future
    }

    @Test
    void testGetAvailableSlots_Success() {
        DoctorAvailability avail = new DoctorAvailability();
        avail.setStartTime(LocalTime.of(9, 0));
        avail.setEndTime(LocalTime.of(10, 0));
        avail.setConsultationDuration(30);

        when(leaveRepository.findByDoctorId(doctorId)).thenReturn(List.of());
        when(availabilityRepository.findByDoctorIdAndDayOfWeek(eq(doctorId), any(String.class))).thenReturn(List.of(avail));
        when(appointmentRepository.findByDoctorIdAndAppointmentDateAndCurrentStatusNotIn(eq(doctorId), eq(futureDate), any()))
                .thenReturn(List.of());

        List<AvailableSlotDto> slots = slotService.getAvailableSlots(doctorId, futureDate);

        assertEquals(2, slots.size()); // 9:00 and 9:30
        assertEquals(LocalTime.of(9, 0), slots.get(0).getTime());
        assertEquals(LocalTime.of(9, 30), slots.get(1).getTime());
    }

    @Test
    void testGetAvailableSlots_OnLeave() {
        DoctorLeave leave = new DoctorLeave();
        leave.setStartDate(futureDate.minusDays(1));
        leave.setEndDate(futureDate.plusDays(1));
        leave.setStatus("APPROVED");

        when(leaveRepository.findByDoctorId(doctorId)).thenReturn(List.of(leave));

        List<AvailableSlotDto> slots = slotService.getAvailableSlots(doctorId, futureDate);

        assertTrue(slots.isEmpty()); // Should be blocked by leave
    }

    @Test
    void testGetAvailableSlots_WithBookedAppointment() {
        DoctorAvailability avail = new DoctorAvailability();
        avail.setStartTime(LocalTime.of(9, 0));
        avail.setEndTime(LocalTime.of(10, 0));
        avail.setConsultationDuration(30);

        Appointment booked = new Appointment();
        booked.setAppointmentTime(LocalTime.of(9, 30));

        when(leaveRepository.findByDoctorId(doctorId)).thenReturn(List.of());
        when(availabilityRepository.findByDoctorIdAndDayOfWeek(eq(doctorId), any(String.class))).thenReturn(List.of(avail));
        when(appointmentRepository.findByDoctorIdAndAppointmentDateAndCurrentStatusNotIn(eq(doctorId), eq(futureDate), any()))
                .thenReturn(List.of(booked));

        List<AvailableSlotDto> slots = slotService.getAvailableSlots(doctorId, futureDate);

        assertEquals(1, slots.size());
        assertEquals(LocalTime.of(9, 0), slots.get(0).getTime()); // 9:30 should be removed
    }
}
