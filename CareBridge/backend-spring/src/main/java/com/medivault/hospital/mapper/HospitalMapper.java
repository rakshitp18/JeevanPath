package com.medivault.hospital.mapper;

import com.medivault.hospital.dto.HospitalDto;
import com.medivault.hospital.entity.Hospital;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HospitalMapper {
    HospitalDto toDto(Hospital entity);
    Hospital toEntity(HospitalDto dto);
    List<HospitalDto> toDtoList(List<Hospital> entities);
}
