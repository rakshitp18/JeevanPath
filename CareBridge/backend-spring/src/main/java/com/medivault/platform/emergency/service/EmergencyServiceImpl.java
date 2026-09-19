package com.medivault.platform.emergency.service;

import com.medivault.exception.BadRequestException;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.patient.entity.Patient;
import com.medivault.patient.repository.PatientRepository;
import com.medivault.platform.emergency.dto.EmergencyProfileDto;
import com.medivault.platform.emergency.entity.EmergencyAccessAudit;
import com.medivault.platform.emergency.entity.EmergencyProfile;
import com.medivault.platform.emergency.repository.EmergencyAccessAuditRepository;
import com.medivault.platform.emergency.repository.EmergencyProfileRepository;
import com.medivault.platform.mapper.PlatformMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyServiceImpl implements EmergencyService {

    private final EmergencyProfileRepository profileRepository;
    private final EmergencyAccessAuditRepository auditRepository;
    private final PatientRepository patientRepository;
    private final PlatformMapper mapper;

    @Override
    public EmergencyProfileDto getPatientEmergencyProfile(UUID patientId) {
        EmergencyProfile profile = profileRepository.findByPatientId(patientId)
                .orElseGet(() -> createEmptyProfile(patientId));
        return mapper.toEmergencyProfileDto(profile);
    }

    @Override
    @Transactional
    public EmergencyProfileDto updateEmergencyProfile(UUID patientId, EmergencyProfileDto request) {
        EmergencyProfile profile = profileRepository.findByPatientId(patientId)
                .orElseGet(() -> createEmptyProfile(patientId));

        profile.setBloodGroup(request.getBloodGroup());
        profile.setCriticalAllergies(request.getCriticalAllergies());
        profile.setCriticalDiseases(request.getCriticalDiseases());
        profile.setCurrentMedications(request.getCurrentMedications());
        profile.setOrganDonor(request.getOrganDonor() != null ? request.getOrganDonor() : false);
        profile.setEmergencyNotes(request.getEmergencyNotes());
        profile.setIsEnabled(request.getIsEnabled() != null ? request.getIsEnabled() : false);

        return mapper.toEmergencyProfileDto(profileRepository.save(profile));
    }

    @Override
    @Transactional
    public String generateEmergencyQrToken(UUID patientId) {
        EmergencyProfile profile = profileRepository.findByPatientId(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency profile not found"));

        if (!Boolean.TRUE.equals(profile.getIsEnabled())) {
            throw new BadRequestException("Emergency profile is not enabled for public access");
        }

        String token = UUID.randomUUID().toString();
        profile.setAccessToken(token);
        profile.setTokenExpiry(ZonedDateTime.now().plusHours(24)); // 24 hour expiry
        profileRepository.save(profile);

        return token;
    }

    @Override
    @Transactional
    public EmergencyProfileDto getPublicEmergencyProfile(String token, String ipAddress, String userAgent) {
        EmergencyProfile profile = profileRepository.findByAccessToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired emergency token"));

        if (profile.getTokenExpiry() != null && profile.getTokenExpiry().isBefore(ZonedDateTime.now())) {
            throw new BadRequestException("Emergency token has expired");
        }

        if (!Boolean.TRUE.equals(profile.getIsEnabled())) {
            throw new BadRequestException("Emergency profile access has been revoked");
        }

        // Audit the access
        EmergencyAccessAudit audit = EmergencyAccessAudit.builder()
                .emergencyProfile(profile)
                .accessedByIp(ipAddress)
                .userAgent(userAgent)
                .build();
        auditRepository.save(audit);

        log.warn("Emergency profile accessed for patient {} from IP {}", profile.getPatient().getId(), ipAddress);

        return mapper.toEmergencyProfileDto(profile);
    }

    private EmergencyProfile createEmptyProfile(UUID patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        EmergencyProfile profile = EmergencyProfile.builder()
                .patient(patient)
                .build();
        return profileRepository.save(profile);
    }
}
