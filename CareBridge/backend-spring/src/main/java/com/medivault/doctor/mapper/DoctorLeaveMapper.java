package com.medivault.doctor.mapper;

import com.medivault.doctor.dto.DoctorLeaveDto;
import com.medivault.doctor.entity.DoctorLeave;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DoctorLeaveMapper {
    DoctorLeaveDto toDto(DoctorLeave entity);
    DoctorLeave toEntity(DoctorLeaveDto dto);
    List<DoctorLeaveDto> toDtoList(List<DoctorLeave> entities);
}
