package com.medivault.patient.mapper;

import com.medivault.patient.dto.PatientMedicalInformationDto;
import com.medivault.patient.entity.PatientMedicalInformation;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PatientMedicalInformationMapper {

    PatientMedicalInformationDto toDto(PatientMedicalInformation entity);
    
    PatientMedicalInformation toEntity(PatientMedicalInformationDto dto);

    default List<String> map(String value) {
        if (value == null || value.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .collect(Collectors.toList());
    }

    default String map(List<String> value) {
        if (value == null || value.isEmpty()) {
            return null;
        }
        return String.join(",", value);
    }

    default Boolean mapStringToBoolean(String value) {
        if (value == null) {
            return null;
        }
        return "YES".equalsIgnoreCase(value) || "true".equalsIgnoreCase(value);
    }

    default String mapBooleanToString(Boolean value) {
        if (value == null) {
            return null;
        }
        return value ? "YES" : "NO";
    }
}
