package com.medivault.hospital.service;

import com.medivault.exception.ResourceNotFoundException;
import com.medivault.hospital.dto.DepartmentDto;
import com.medivault.hospital.dto.HospitalDto;
import com.medivault.hospital.entity.Hospital;
import com.medivault.hospital.mapper.DepartmentMapper;
import com.medivault.hospital.mapper.HospitalMapper;
import com.medivault.hospital.repository.DepartmentRepository;
import com.medivault.hospital.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final DepartmentRepository departmentRepository;
    private final HospitalMapper hospitalMapper;
    private final DepartmentMapper departmentMapper;

    @Override
    public List<HospitalDto> getAllHospitals() {
        return hospitalMapper.toDtoList(hospitalRepository.findAll());
    }

    @Override
    public HospitalDto getHospitalById(UUID id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found"));
        return hospitalMapper.toDto(hospital);
    }

    @Override
    public List<DepartmentDto> getDepartmentsByHospitalId(UUID hospitalId) {
        if (!hospitalRepository.existsById(hospitalId)) {
            throw new ResourceNotFoundException("Hospital not found");
        }
        return departmentMapper.toDtoList(departmentRepository.findByHospitalId(hospitalId));
    }
}
