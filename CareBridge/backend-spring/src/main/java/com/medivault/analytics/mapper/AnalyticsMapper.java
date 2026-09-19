package com.medivault.analytics.mapper;

import com.medivault.analytics.dto.VitalLogDto;
import com.medivault.analytics.entity.VitalLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AnalyticsMapper {

    @Mapping(target = "userId", source = "patient.user.id")
    VitalLogDto toDto(VitalLog entity);

    @Mapping(target = "patient", ignore = true)
    VitalLog toEntity(VitalLogDto dto);
}
