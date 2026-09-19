package com.medivault.patient.service;

import com.medivault.patient.dto.EmergencyContactDto;
import com.medivault.patient.dto.FamilyMemberDto;
import com.medivault.patient.dto.InsuranceInformationDto;
import com.medivault.patient.dto.PatientMedicalInformationDto;
import com.medivault.patient.dto.PatientProfileDto;
import com.medivault.patient.dto.UpdatePatientProfileRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface PatientProfileService {
    
    // Core Profile
    PatientProfileDto getProfile(UUID userId);
    PatientProfileDto updateProfile(UUID userId, UpdatePatientProfileRequest request);
    void uploadProfilePhoto(UUID userId, MultipartFile file);
    void deleteProfilePhoto(UUID userId);
    
    // Medical Information
    PatientMedicalInformationDto getMedicalInformation(UUID userId);
    PatientMedicalInformationDto updateMedicalInformation(UUID userId, PatientMedicalInformationDto request);
    
    // Emergency Contacts
    List<EmergencyContactDto> getEmergencyContacts(UUID userId);
    EmergencyContactDto addEmergencyContact(UUID userId, EmergencyContactDto request);
    EmergencyContactDto updateEmergencyContact(UUID userId, UUID contactId, EmergencyContactDto request);
    void deleteEmergencyContact(UUID userId, UUID contactId);
    
    // Insurance
    InsuranceInformationDto getInsuranceInformation(UUID userId);
    InsuranceInformationDto updateInsuranceInformation(UUID userId, InsuranceInformationDto request);
    
    // Family Members
    List<FamilyMemberDto> getFamilyMembers(UUID userId);
    FamilyMemberDto addFamilyMember(UUID userId, FamilyMemberDto request);
    FamilyMemberDto updateFamilyMember(UUID userId, UUID memberId, FamilyMemberDto request);
    void deleteFamilyMember(UUID userId, UUID memberId);
    
    // Account Management
    void deactivateProfile(UUID userId);
    void reactivateProfile(UUID userId);
}
