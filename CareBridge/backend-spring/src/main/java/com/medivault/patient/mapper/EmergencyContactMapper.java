package com.medivault.patient.mapper;

import com.medivault.patient.dto.EmergencyContactDto;
import com.medivault.patient.entity.EmergencyContact;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmergencyContactMapper {
    EmergencyContactDto toDto(EmergencyContact entity);
    EmergencyContact toEntity(EmergencyContactDto dto);
    List<EmergencyContactDto> toDtoList(List<EmergencyContact> entities);
}
