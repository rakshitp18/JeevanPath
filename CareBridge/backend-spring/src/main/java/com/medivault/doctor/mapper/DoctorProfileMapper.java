package com.medivault.doctor.mapper;

import com.medivault.doctor.dto.DoctorProfileDto;
import com.medivault.doctor.entity.Doctor;
import com.medivault.hospital.mapper.DepartmentMapper;
import com.medivault.hospital.mapper.HospitalMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {HospitalMapper.class, DepartmentMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DoctorProfileMapper {

    DoctorProfileDto toDto(Doctor entity);

    default List<String> mapLanguages(String value) {
        if (value == null || value.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .collect(Collectors.toList());
    }

    default String mapLanguages(List<String> value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        return String.join(",", value);
    }
}
