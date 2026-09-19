package com.medivault.doctor.mapper;

import com.medivault.doctor.dto.DoctorAvailabilityDto;
import com.medivault.doctor.entity.DoctorAvailability;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DoctorAvailabilityMapper {
    DoctorAvailabilityDto toDto(DoctorAvailability entity);
    DoctorAvailability toEntity(DoctorAvailabilityDto dto);
    List<DoctorAvailabilityDto> toDtoList(List<DoctorAvailability> entities);
}
