package com.medivault.doctor.service;

import com.medivault.doctor.dto.DoctorAvailabilityDto;
import com.medivault.doctor.dto.DoctorDocumentDto;
import com.medivault.doctor.dto.DoctorLeaveDto;
import com.medivault.doctor.dto.DoctorProfileDto;
import com.medivault.doctor.dto.UpdateDoctorProfileRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface DoctorProfileService {
    
    // Core Profile
    DoctorProfileDto getProfile(UUID userId);
    DoctorProfileDto updateProfile(UUID userId, UpdateDoctorProfileRequest request);
    void uploadProfilePhoto(UUID userId, MultipartFile file);
    
    // Availability
    List<DoctorAvailabilityDto> getAvailability(UUID userId);
    DoctorAvailabilityDto addAvailability(UUID userId, DoctorAvailabilityDto request);
    DoctorAvailabilityDto updateAvailability(UUID userId, UUID availabilityId, DoctorAvailabilityDto request);
    void deleteAvailability(UUID userId, UUID availabilityId);
    
    // Leaves
    List<DoctorLeaveDto> getLeaves(UUID userId);
    DoctorLeaveDto addLeave(UUID userId, DoctorLeaveDto request);
    DoctorLeaveDto updateLeave(UUID userId, UUID leaveId, DoctorLeaveDto request);
    void deleteLeave(UUID userId, UUID leaveId);
    
    // Documents
    List<DoctorDocumentDto> getDocuments(UUID userId);
    DoctorDocumentDto uploadDocument(UUID userId, String documentType, MultipartFile file);
}
