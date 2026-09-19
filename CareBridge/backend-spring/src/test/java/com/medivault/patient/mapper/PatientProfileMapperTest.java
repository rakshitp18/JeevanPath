package com.medivault.patient.mapper;

import com.medivault.patient.dto.PatientProfileDto;
import com.medivault.patient.entity.Patient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class PatientProfileMapperTest {

    private PatientProfileMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = Mappers.getMapper(PatientProfileMapper.class);
    }

    @Test
    void testToDtoWithCalculatedFields() {
        Patient patient = new Patient();
        patient.setFullName("John Doe");
        patient.setDateOfBirth(LocalDate.now().minusYears(30)); // 30 years old
        patient.setHeight(175.0); // 1.75 meters
        patient.setWeight(70.0);  // 70 kg

        PatientProfileDto dto = mapper.toDto(patient);

        assertNotNull(dto);
        assertEquals("John Doe", dto.getFullName());
        assertEquals(30, dto.getAge());
        
        // BMI = 70 / (1.75 * 1.75) = 22.86
        assertEquals(22.86, dto.getBmi(), 0.01);
    }
}
