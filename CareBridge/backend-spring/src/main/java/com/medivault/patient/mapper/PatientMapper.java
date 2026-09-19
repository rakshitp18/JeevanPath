package com.medivault.patient.mapper;

import com.medivault.auth.dto.RegisterPatientRequest;
import com.medivault.patient.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PatientMapper {
    @Mapping(target = "fullName", source = "fullName")
    Patient toEntity(RegisterPatientRequest request);
}
