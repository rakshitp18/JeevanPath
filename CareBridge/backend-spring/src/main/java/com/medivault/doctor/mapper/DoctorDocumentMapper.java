package com.medivault.doctor.mapper;

import com.medivault.doctor.dto.DoctorDocumentDto;
import com.medivault.doctor.entity.DoctorDocument;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DoctorDocumentMapper {
    DoctorDocumentDto toDto(DoctorDocument entity);
    List<DoctorDocumentDto> toDtoList(List<DoctorDocument> entities);
}
