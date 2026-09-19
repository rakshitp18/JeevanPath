package com.medivault.platform.emergency.service;

import com.medivault.exception.BadRequestException;
import com.medivault.platform.emergency.entity.EmergencyProfile;
import com.medivault.platform.emergency.repository.EmergencyAccessAuditRepository;
import com.medivault.platform.emergency.repository.EmergencyProfileRepository;
import com.medivault.platform.mapper.PlatformMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmergencyServiceImplTest {

    @Mock private EmergencyProfileRepository profileRepository;
    @Mock private EmergencyAccessAuditRepository auditRepository;
    @Mock private PlatformMapper mapper;

    @InjectMocks
    private EmergencyServiceImpl emergencyService;

    @Test
    void testGetPublicEmergencyProfile_ExpiredToken() {
        EmergencyProfile profile = new EmergencyProfile();
        profile.setIsEnabled(true);
        profile.setTokenExpiry(ZonedDateTime.now().minusHours(1)); // Expired 1 hour ago

        when(profileRepository.findByAccessToken("expired-token")).thenReturn(Optional.of(profile));

        assertThrows(BadRequestException.class, () -> {
            emergencyService.getPublicEmergencyProfile("expired-token", "127.0.0.1", "Browser");
        });
    }

    @Test
    void testGetPublicEmergencyProfile_DisabledProfile() {
        EmergencyProfile profile = new EmergencyProfile();
        profile.setIsEnabled(false); // Disabled
        profile.setTokenExpiry(ZonedDateTime.now().plusHours(1));

        when(profileRepository.findByAccessToken("disabled-token")).thenReturn(Optional.of(profile));

        assertThrows(BadRequestException.class, () -> {
            emergencyService.getPublicEmergencyProfile("disabled-token", "127.0.0.1", "Browser");
        });
    }
}
