package com.medivault.doctor.service;

import com.medivault.doctor.dto.DoctorAvailabilityDto;
import com.medivault.doctor.dto.DoctorDocumentDto;
import com.medivault.doctor.dto.DoctorLeaveDto;
import com.medivault.doctor.dto.DoctorProfileDto;
import com.medivault.doctor.dto.UpdateDoctorProfileRequest;
import com.medivault.doctor.entity.Doctor;
import com.medivault.doctor.entity.DoctorAvailability;
import com.medivault.doctor.entity.DoctorDocument;
import com.medivault.doctor.entity.DoctorLeave;
import com.medivault.doctor.mapper.DoctorAvailabilityMapper;
import com.medivault.doctor.mapper.DoctorDocumentMapper;
import com.medivault.doctor.mapper.DoctorLeaveMapper;
import com.medivault.doctor.mapper.DoctorProfileMapper;
import com.medivault.doctor.repository.DoctorAvailabilityRepository;
import com.medivault.doctor.repository.DoctorDocumentRepository;
import com.medivault.doctor.repository.DoctorLeaveRepository;
import com.medivault.doctor.repository.DoctorRepository;
import com.medivault.exception.BadRequestException;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.hospital.entity.Department;
import com.medivault.hospital.entity.Hospital;
import com.medivault.hospital.repository.DepartmentRepository;
import com.medivault.hospital.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorProfileServiceImpl implements DoctorProfileService {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorLeaveRepository leaveRepository;
    private final DoctorDocumentRepository documentRepository;

    private final DoctorProfileMapper profileMapper;
    private final DoctorAvailabilityMapper availabilityMapper;
    private final DoctorLeaveMapper leaveMapper;
    private final DoctorDocumentMapper documentMapper;

    private Doctor getDoctor(UUID userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    @Override
    public DoctorProfileDto getProfile(UUID userId) {
        return profileMapper.toDto(getDoctor(userId));
    }

    @Override
    @Transactional
    public DoctorProfileDto updateProfile(UUID userId, UpdateDoctorProfileRequest request) {
        Doctor doctor = getDoctor(userId);
        
        if (request.getFullName() != null) doctor.setFullName(request.getFullName());
        if (request.getQualification() != null) doctor.setQualification(request.getQualification());
        if (request.getSpecialization() != null) doctor.setSpecialization(request.getSpecialization());
        if (request.getExperience() != null) doctor.setExperience(request.getExperience());
        if (request.getConsultationFee() != null) doctor.setConsultationFee(request.getConsultationFee());
        if (request.getBiography() != null) doctor.setBiography(request.getBiography());
        if (request.getLanguagesSpoken() != null) doctor.setLanguagesSpoken(profileMapper.mapLanguages(request.getLanguagesSpoken()));
        if (request.getConsultationMode() != null) doctor.setConsultationMode(request.getConsultationMode());
        
        if (request.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));
            doctor.setHospital(hospital);
        }
        
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            // Verify department belongs to hospital
            if (doctor.getHospital() != null && !department.getHospital().getId().equals(doctor.getHospital().getId())) {
                throw new BadRequestException("Department does not belong to the selected hospital");
            }
            doctor.setDepartment(department);
        }

        return profileMapper.toDto(doctorRepository.save(doctor));
    }

    @Override
    public void uploadProfilePhoto(UUID userId, MultipartFile file) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<DoctorAvailabilityDto> getAvailability(UUID userId) {
        return availabilityMapper.toDtoList(availabilityRepository.findByDoctorId(getDoctor(userId).getId()));
    }

    @Override
    @Transactional
    public DoctorAvailabilityDto addAvailability(UUID userId, DoctorAvailabilityDto request) {
        Doctor doctor = getDoctor(userId);
        validateAvailabilityRequest(request);
        
        // Check for overlaps on the same day
        List<DoctorAvailability> existing = availabilityRepository.findByDoctorIdAndDayOfWeek(doctor.getId(), request.getDayOfWeek());
        for (DoctorAvailability avail : existing) {
            if (isTimeOverlapping(request, avail)) {
                throw new BadRequestException("Availability overlaps with an existing schedule on this day");
            }
        }

        DoctorAvailability availability = availabilityMapper.toEntity(request);
        availability.setDoctor(doctor);
        return availabilityMapper.toDto(availabilityRepository.save(availability));
    }

    @Override
    @Transactional
    public DoctorAvailabilityDto updateAvailability(UUID userId, UUID availabilityId, DoctorAvailabilityDto request) {
        Doctor doctor = getDoctor(userId);
        DoctorAvailability availability = availabilityRepository.findByIdAndDoctorId(availabilityId, doctor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found"));
                
        validateAvailabilityRequest(request);

        // Check for overlaps (excluding self)
        List<DoctorAvailability> existing = availabilityRepository.findByDoctorIdAndDayOfWeek(doctor.getId(), request.getDayOfWeek());
        for (DoctorAvailability avail : existing) {
            if (!avail.getId().equals(availability.getId()) && isTimeOverlapping(request, avail)) {
                throw new BadRequestException("Availability overlaps with an existing schedule on this day");
            }
        }

        availability.setDayOfWeek(request.getDayOfWeek());
        availability.setStartTime(request.getStartTime());
        availability.setEndTime(request.getEndTime());
        availability.setBreakTime(request.getBreakTime());
        availability.setConsultationDuration(request.getConsultationDuration());
        availability.setMaxPatientsPerDay(request.getMaxPatientsPerDay());

        return availabilityMapper.toDto(availabilityRepository.save(availability));
    }

    @Override
    @Transactional
    public void deleteAvailability(UUID userId, UUID availabilityId) {
        Doctor doctor = getDoctor(userId);
        DoctorAvailability availability = availabilityRepository.findByIdAndDoctorId(availabilityId, doctor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found"));
        availabilityRepository.delete(availability);
    }

    private void validateAvailabilityRequest(DoctorAvailabilityDto request) {
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new BadRequestException("Start time and end time are required");
        }
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new BadRequestException("Start time cannot be after end time");
        }
        if (request.getStartTime().equals(request.getEndTime())) {
            throw new BadRequestException("Start time cannot be the same as end time");
        }
    }
    
    private boolean isTimeOverlapping(DoctorAvailabilityDto request, DoctorAvailability existing) {
        return request.getStartTime().isBefore(existing.getEndTime()) && request.getEndTime().isAfter(existing.getStartTime());
    }

    @Override
    public List<DoctorLeaveDto> getLeaves(UUID userId) {
        return leaveMapper.toDtoList(leaveRepository.findByDoctorId(getDoctor(userId).getId()));
    }

    @Override
    @Transactional
    public DoctorLeaveDto addLeave(UUID userId, DoctorLeaveDto request) {
        Doctor doctor = getDoctor(userId);
        
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        
        // Additional business rule: Leave blocks availability implicitly.
        // We just save the leave here. An appointment booking engine would check this table.

        DoctorLeave leave = leaveMapper.toEntity(request);
        leave.setDoctor(doctor);
        if (leave.getStatus() == null) {
            leave.setStatus("PENDING");
        }
        
        return leaveMapper.toDto(leaveRepository.save(leave));
    }

    @Override
    @Transactional
    public DoctorLeaveDto updateLeave(UUID userId, UUID leaveId, DoctorLeaveDto request) {
        Doctor doctor = getDoctor(userId);
        DoctorLeave leave = leaveRepository.findByIdAndDoctorId(leaveId, doctor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));
                
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        leave.setLeaveType(request.getLeaveType());
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setReason(request.getReason());
        if (request.getStatus() != null) leave.setStatus(request.getStatus());

        return leaveMapper.toDto(leaveRepository.save(leave));
    }

    @Override
    @Transactional
    public void deleteLeave(UUID userId, UUID leaveId) {
        Doctor doctor = getDoctor(userId);
        DoctorLeave leave = leaveRepository.findByIdAndDoctorId(leaveId, doctor.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Leave not found"));
        leaveRepository.delete(leave);
    }

    @Override
    public List<DoctorDocumentDto> getDocuments(UUID userId) {
        return documentMapper.toDtoList(documentRepository.findByDoctorId(getDoctor(userId).getId()));
    }

    @Override
    @Transactional
    public DoctorDocumentDto uploadDocument(UUID userId, String documentType, MultipartFile file) {
        Doctor doctor = getDoctor(userId);
        
        // Logic to upload file to cloud would go here and get a URL
        String dummyUrl = "https://storage.medivault.com/docs/" + UUID.randomUUID() + ".pdf";
        
        DoctorDocument doc = new DoctorDocument();
        doc.setDoctor(doctor);
        doc.setDocumentType(documentType);
        doc.setDocumentUrl(dummyUrl);
        doc.setUploadedAt(LocalDate.now());
        
        return documentMapper.toDto(documentRepository.save(doc));
    }
}
