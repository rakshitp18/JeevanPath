package com.medivault.doctor.service;

import com.medivault.doctor.dto.DoctorAvailabilityDto;
import com.medivault.doctor.dto.DoctorLeaveDto;
import com.medivault.doctor.entity.Doctor;
import com.medivault.doctor.entity.DoctorAvailability;
import com.medivault.doctor.entity.DoctorLeave;
import com.medivault.doctor.mapper.DoctorAvailabilityMapper;
import com.medivault.doctor.mapper.DoctorLeaveMapper;
import com.medivault.doctor.repository.DoctorAvailabilityRepository;
import com.medivault.doctor.repository.DoctorLeaveRepository;
import com.medivault.doctor.repository.DoctorRepository;
import com.medivault.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoctorProfileServiceImplTest {

    @Mock private DoctorRepository doctorRepository;
    @Mock private DoctorAvailabilityRepository availabilityRepository;
    @Mock private DoctorLeaveRepository leaveRepository;
    @Mock private DoctorAvailabilityMapper availabilityMapper;
    @Mock private DoctorLeaveMapper leaveMapper;

    @InjectMocks
    private DoctorProfileServiceImpl doctorProfileService;

    private Doctor testDoctor;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        testDoctor = new Doctor();
        testDoctor.setId(UUID.randomUUID());
    }

    @Test
    void testAddAvailability_OverlapException() {
        DoctorAvailabilityDto request = DoctorAvailabilityDto.builder()
                .dayOfWeek("MONDAY")
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(12, 0))
                .consultationDuration(30)
                .build();

        DoctorAvailability existing = new DoctorAvailability();
        existing.setDayOfWeek("MONDAY");
        existing.setStartTime(LocalTime.of(11, 0)); // Overlaps with 10 to 12
        existing.setEndTime(LocalTime.of(13, 0));

        when(doctorRepository.findByUserId(userId)).thenReturn(Optional.of(testDoctor));
        when(availabilityRepository.findByDoctorIdAndDayOfWeek(testDoctor.getId(), "MONDAY")).thenReturn(List.of(existing));

        assertThrows(BadRequestException.class, () -> {
            doctorProfileService.addAvailability(userId, request);
        });
    }

    @Test
    void testAddLeave_EndDateBeforeStartDateException() {
        DoctorLeaveDto request = DoctorLeaveDto.builder()
                .leaveType("SICK")
                .startDate(LocalDate.now().plusDays(2))
                .endDate(LocalDate.now().plusDays(1)) // End before start
                .build();

        when(doctorRepository.findByUserId(userId)).thenReturn(Optional.of(testDoctor));

        assertThrows(BadRequestException.class, () -> {
            doctorProfileService.addLeave(userId, request);
        });
    }
}
