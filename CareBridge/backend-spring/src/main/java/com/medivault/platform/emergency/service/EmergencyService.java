package com.medivault.platform.emergency.service;

import com.medivault.platform.emergency.dto.EmergencyProfileDto;

import java.util.UUID;

public interface EmergencyService {
    EmergencyProfileDto getPatientEmergencyProfile(UUID patientId);
    EmergencyProfileDto updateEmergencyProfile(UUID patientId, EmergencyProfileDto request);
    String generateEmergencyQrToken(UUID patientId);
    EmergencyProfileDto getPublicEmergencyProfile(String token, String ipAddress, String userAgent);
}
