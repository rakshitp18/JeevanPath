package com.medivault.hospital.service;

import com.medivault.hospital.dto.DepartmentDto;
import com.medivault.hospital.dto.HospitalDto;

import java.util.List;
import java.util.UUID;

public interface HospitalService {
    List<HospitalDto> getAllHospitals();
    HospitalDto getHospitalById(UUID id);
    List<DepartmentDto> getDepartmentsByHospitalId(UUID hospitalId);
}
