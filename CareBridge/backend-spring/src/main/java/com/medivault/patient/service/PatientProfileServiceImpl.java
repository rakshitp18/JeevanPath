package com.medivault.patient.service;

import com.medivault.exception.BadRequestException;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.patient.dto.EmergencyContactDto;
import com.medivault.patient.dto.FamilyMemberDto;
import com.medivault.patient.dto.InsuranceInformationDto;
import com.medivault.patient.dto.PatientMedicalInformationDto;
import com.medivault.patient.dto.PatientProfileDto;
import com.medivault.patient.dto.UpdatePatientProfileRequest;
import com.medivault.patient.entity.EmergencyContact;
import com.medivault.patient.entity.FamilyMember;
import com.medivault.patient.entity.InsuranceInformation;
import com.medivault.patient.entity.Patient;
import com.medivault.patient.entity.PatientMedicalInformation;
import com.medivault.patient.mapper.EmergencyContactMapper;
import com.medivault.patient.mapper.FamilyMemberMapper;
import com.medivault.patient.mapper.InsuranceInformationMapper;
import com.medivault.patient.mapper.PatientMedicalInformationMapper;
import com.medivault.patient.mapper.PatientProfileMapper;
import com.medivault.patient.repository.EmergencyContactRepository;
import com.medivault.patient.repository.FamilyMemberRepository;
import com.medivault.patient.repository.InsuranceInformationRepository;
import com.medivault.patient.repository.PatientMedicalInformationRepository;
import com.medivault.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientProfileServiceImpl implements PatientProfileService {

    private final PatientRepository patientRepository;
    private final PatientMedicalInformationRepository medicalInfoRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final InsuranceInformationRepository insuranceInfoRepository;
    private final FamilyMemberRepository familyMemberRepository;

    private final PatientProfileMapper profileMapper;
    private final PatientMedicalInformationMapper medicalInfoMapper;
    private final EmergencyContactMapper emergencyContactMapper;
    private final InsuranceInformationMapper insuranceMapper;
    private final FamilyMemberMapper familyMemberMapper;

    private Patient getPatient(UUID userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
    }

    @Override
    public PatientProfileDto getProfile(UUID userId) {
        return profileMapper.toDto(getPatient(userId));
    }

    @Override
    @Transactional
    public PatientProfileDto updateProfile(UUID userId, UpdatePatientProfileRequest request) {
        Patient patient = getPatient(userId);
        
        if (request.getFullName() != null) patient.setFullName(request.getFullName());
        if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) patient.setGender(request.getGender());
        if (request.getBloodGroup() != null) patient.setBloodGroup(request.getBloodGroup());
        if (request.getHeight() != null) patient.setHeight(request.getHeight());
        if (request.getWeight() != null) patient.setWeight(request.getWeight());
        if (request.getPhone() != null) patient.setPhone(request.getPhone());
        if (request.getAlternatePhone() != null) patient.setAlternatePhone(request.getAlternatePhone());
        if (request.getAddress() != null) patient.setAddress(request.getAddress());
        if (request.getCity() != null) patient.setCity(request.getCity());
        if (request.getState() != null) patient.setState(request.getState());
        if (request.getCountry() != null) patient.setCountry(request.getCountry());
        if (request.getPostalCode() != null) patient.setPostalCode(request.getPostalCode());
        if (request.getEmergencyContact() != null) patient.setEmergencyContact(request.getEmergencyContact());

        patientRepository.save(patient);
        return profileMapper.toDto(patient);
    }

    @Override
    public void uploadProfilePhoto(UUID userId, MultipartFile file) {
        // Implementation for cloud storage (e.g., Cloudinary/AWS S3) would go here
        throw new UnsupportedOperationException("File upload to be implemented with external storage provider");
    }

    @Override
    @Transactional
    public void deleteProfilePhoto(UUID userId) {
        Patient patient = getPatient(userId);
        patient.setProfileImage(null);
        patientRepository.save(patient);
    }

    @Override
    public PatientMedicalInformationDto getMedicalInformation(UUID userId) {
        Patient patient = getPatient(userId);
        return medicalInfoRepository.findByPatientId(patient.getId())
                .map(medicalInfoMapper::toDto)
                .orElse(new PatientMedicalInformationDto());
    }

    @Override
    @Transactional
    public PatientMedicalInformationDto updateMedicalInformation(UUID userId, PatientMedicalInformationDto request) {
        Patient patient = getPatient(userId);
        PatientMedicalInformation medicalInfo = medicalInfoRepository.findByPatientId(patient.getId())
                .orElse(new PatientMedicalInformation());

        medicalInfo.setPatient(patient);
        medicalInfo.setAllergies(medicalInfoMapper.map(request.getAllergies()));
        medicalInfo.setChronicDiseases(medicalInfoMapper.map(request.getChronicDiseases()));
        medicalInfo.setCurrentConditions(medicalInfoMapper.map(request.getCurrentConditions()));
        medicalInfo.setCurrentMedications(medicalInfoMapper.map(request.getCurrentMedications()));
        medicalInfo.setPastSurgeries(medicalInfoMapper.map(request.getPastSurgeries()));
        medicalInfo.setDisabilities(medicalInfoMapper.map(request.getDisabilities()));
        
        if (request.getOrganDonorStatus() != null) medicalInfo.setOrganDonorStatus(medicalInfoMapper.mapStringToBoolean(request.getOrganDonorStatus()));
        if (request.getSmokingStatus() != null) medicalInfo.setSmokingStatus(request.getSmokingStatus());
        if (request.getAlcoholConsumption() != null) medicalInfo.setAlcoholConsumption(request.getAlcoholConsumption());
        if (request.getVaccinationStatus() != null) medicalInfo.setVaccinationStatus(request.getVaccinationStatus());

        return medicalInfoMapper.toDto(medicalInfoRepository.save(medicalInfo));
    }

    @Override
    public List<EmergencyContactDto> getEmergencyContacts(UUID userId) {
        Patient patient = getPatient(userId);
        return emergencyContactMapper.toDtoList(emergencyContactRepository.findByPatientId(patient.getId()));
    }

    @Override
    @Transactional
    public EmergencyContactDto addEmergencyContact(UUID userId, EmergencyContactDto request) {
        Patient patient = getPatient(userId);
        
        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            resetPrimaryContacts(patient.getId());
        }

        EmergencyContact contact = emergencyContactMapper.toEntity(request);
        contact.setPatient(patient);
        
        return emergencyContactMapper.toDto(emergencyContactRepository.save(contact));
    }

    @Override
    @Transactional
    public EmergencyContactDto updateEmergencyContact(UUID userId, UUID contactId, EmergencyContactDto request) {
        Patient patient = getPatient(userId);
        EmergencyContact contact = emergencyContactRepository.findByIdAndPatientId(contactId, patient.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Emergency contact not found"));

        if (Boolean.TRUE.equals(request.getIsPrimary()) && !Boolean.TRUE.equals(contact.getIsPrimary())) {
            resetPrimaryContacts(patient.getId());
        }

        if (request.getName() != null) contact.setName(request.getName());
        if (request.getRelationship() != null) contact.setRelationship(request.getRelationship());
        if (request.getPhoneNumber() != null) contact.setPhoneNumber(request.getPhoneNumber());
        if (request.getAlternateNumber() != null) contact.setAlternateNumber(request.getAlternateNumber());
        if (request.getEmail() != null) contact.setEmail(request.getEmail());
        if (request.getAddress() != null) contact.setAddress(request.getAddress());
        if (request.getIsPrimary() != null) contact.setIsPrimary(request.getIsPrimary());

        return emergencyContactMapper.toDto(emergencyContactRepository.save(contact));
    }

    @Override
    @Transactional
    public void deleteEmergencyContact(UUID userId, UUID contactId) {
        Patient patient = getPatient(userId);
        EmergencyContact contact = emergencyContactRepository.findByIdAndPatientId(contactId, patient.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Emergency contact not found"));
        emergencyContactRepository.delete(contact);
    }

    private void resetPrimaryContacts(UUID patientId) {
        List<EmergencyContact> contacts = emergencyContactRepository.findByPatientId(patientId);
        for (EmergencyContact c : contacts) {
            if (Boolean.TRUE.equals(c.getIsPrimary())) {
                c.setIsPrimary(false);
                emergencyContactRepository.save(c);
            }
        }
    }

    @Override
    public InsuranceInformationDto getInsuranceInformation(UUID userId) {
        Patient patient = getPatient(userId);
        return insuranceInfoRepository.findByPatientId(patient.getId())
                .map(insuranceMapper::toDto)
                .orElse(new InsuranceInformationDto());
    }

    @Override
    @Transactional
    public InsuranceInformationDto updateInsuranceInformation(UUID userId, InsuranceInformationDto request) {
        Patient patient = getPatient(userId);
        InsuranceInformation insurance = insuranceInfoRepository.findByPatientId(patient.getId())
                .orElse(new InsuranceInformation());

        insurance.setPatient(patient);
        if (request.getProvider() != null) insurance.setProvider(request.getProvider());
        if (request.getPolicyNumber() != null) insurance.setPolicyNumber(request.getPolicyNumber());
        if (request.getPolicyHolder() != null) insurance.setPolicyHolder(request.getPolicyHolder());
        if (request.getCoverageType() != null) insurance.setCoverageType(request.getCoverageType());
        if (request.getCoverageAmount() != null) insurance.setCoverageAmount(request.getCoverageAmount());
        if (request.getIssueDate() != null) insurance.setIssueDate(request.getIssueDate());
        if (request.getExpiryDate() != null) insurance.setExpiryDate(request.getExpiryDate());
        if (request.getPolicyStatus() != null) insurance.setPolicyStatus(request.getPolicyStatus());
        if (request.getEmergencyCoverage() != null) insurance.setEmergencyCoverage(request.getEmergencyCoverage());

        return insuranceMapper.toDto(insuranceInfoRepository.save(insurance));
    }

    @Override
    public List<FamilyMemberDto> getFamilyMembers(UUID userId) {
        Patient patient = getPatient(userId);
        return familyMemberMapper.toDtoList(familyMemberRepository.findByPatientId(patient.getId()));
    }

    @Override
    @Transactional
    public FamilyMemberDto addFamilyMember(UUID userId, FamilyMemberDto request) {
        Patient patient = getPatient(userId);
        FamilyMember member = familyMemberMapper.toEntity(request);
        member.setPatient(patient);
        return familyMemberMapper.toDto(familyMemberRepository.save(member));
    }

    @Override
    @Transactional
    public FamilyMemberDto updateFamilyMember(UUID userId, UUID memberId, FamilyMemberDto request) {
        Patient patient = getPatient(userId);
        FamilyMember member = familyMemberRepository.findByIdAndPatientId(memberId, patient.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found"));

        if (request.getName() != null) member.setName(request.getName());
        if (request.getRelationship() != null) member.setRelationship(request.getRelationship());
        if (request.getGender() != null) member.setGender(request.getGender());
        if (request.getAge() != null) member.setAge(request.getAge());
        if (request.getBloodGroup() != null) member.setBloodGroup(request.getBloodGroup());
        if (request.getPhoneNumber() != null) member.setPhoneNumber(request.getPhoneNumber());
        if (request.getMedicalNotes() != null) member.setMedicalNotes(request.getMedicalNotes());

        return familyMemberMapper.toDto(familyMemberRepository.save(member));
    }

    @Override
    @Transactional
    public void deleteFamilyMember(UUID userId, UUID memberId) {
        Patient patient = getPatient(userId);
        FamilyMember member = familyMemberRepository.findByIdAndPatientId(memberId, patient.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found"));
        familyMemberRepository.delete(member);
    }

    @Override
    @Transactional
    public void deactivateProfile(UUID userId) {
        Patient patient = getPatient(userId);
        patient.getUser().setActive(false); // Cascading deactivate
        patientRepository.save(patient);
    }

    @Override
    @Transactional
    public void reactivateProfile(UUID userId) {
        Patient patient = getPatient(userId);
        if (!patient.getUser().isActive()) {
            patient.getUser().setActive(true);
            patientRepository.save(patient);
        } else {
            throw new BadRequestException("Profile is already active");
        }
    }
}
