package com.medivault.doctor.mapper;

import com.medivault.auth.dto.RegisterDoctorRequest;
import com.medivault.doctor.entity.Doctor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DoctorMapper {
    @Mapping(target = "fullName", source = "fullName")
    Doctor toEntity(RegisterDoctorRequest request);
}
