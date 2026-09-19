package com.medivault.patient.mapper;

import com.medivault.patient.dto.InsuranceInformationDto;
import com.medivault.patient.entity.InsuranceInformation;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InsuranceInformationMapper {
    InsuranceInformationDto toDto(InsuranceInformation entity);
    InsuranceInformation toEntity(InsuranceInformationDto dto);
}
