package com.medivault.hospital.mapper;

import com.medivault.hospital.dto.DepartmentDto;
import com.medivault.hospital.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DepartmentMapper {
    
    @Mapping(target = "hospitalId", source = "hospital.id")
    DepartmentDto toDto(Department entity);
    
    List<DepartmentDto> toDtoList(List<Department> entities);
}
