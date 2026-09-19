package com.medivault.patient.mapper;

import com.medivault.patient.dto.FamilyMemberDto;
import com.medivault.patient.entity.FamilyMember;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FamilyMemberMapper {
    FamilyMemberDto toDto(FamilyMember entity);
    FamilyMember toEntity(FamilyMemberDto dto);
    List<FamilyMemberDto> toDtoList(List<FamilyMember> entities);
}
