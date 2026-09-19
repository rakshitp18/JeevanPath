package com.medivault.patient.service;

import com.medivault.patient.dto.EmergencyContactDto;
import com.medivault.patient.entity.EmergencyContact;
import com.medivault.patient.entity.Patient;
import com.medivault.patient.mapper.EmergencyContactMapper;
import com.medivault.patient.repository.EmergencyContactRepository;
import com.medivault.patient.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PatientProfileServiceImplTest {

    @Mock private PatientRepository patientRepository;
    @Mock private EmergencyContactRepository emergencyContactRepository;
    @Mock private EmergencyContactMapper emergencyContactMapper;

    @InjectMocks
    private PatientProfileServiceImpl patientProfileService;

    private Patient testPatient;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        testPatient = new Patient();
        testPatient.setId(UUID.randomUUID());
    }

    @Test
    void testAddEmergencyContact() {
        EmergencyContactDto requestDto = EmergencyContactDto.builder()
                .name("Jane Doe")
                .relationship("Wife")
                .phoneNumber("1234567890")
                .isPrimary(true)
                .build();

        EmergencyContact entity = new EmergencyContact();
        entity.setName("Jane Doe");

        when(patientRepository.findByUserId(userId)).thenReturn(Optional.of(testPatient));
        when(emergencyContactRepository.findByPatientId(testPatient.getId())).thenReturn(List.of()); // No existing contacts
        when(emergencyContactMapper.toEntity(requestDto)).thenReturn(entity);
        when(emergencyContactRepository.save(any())).thenReturn(entity);
        when(emergencyContactMapper.toDto(entity)).thenReturn(requestDto);

        EmergencyContactDto response = patientProfileService.addEmergencyContact(userId, requestDto);

        assertNotNull(response);
        assertEquals("Jane Doe", response.getName());
        verify(emergencyContactRepository).save(any(EmergencyContact.class));
    }
}
