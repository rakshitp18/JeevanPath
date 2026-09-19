package com.medivault.appointment.mapper;

import com.medivault.appointment.dto.AppointmentDto;
import com.medivault.appointment.dto.AppointmentStatusHistoryDto;
import com.medivault.appointment.entity.Appointment;
import com.medivault.appointment.entity.AppointmentStatusHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AppointmentMapper {

    @Mapping(target = "patientId", source = "patient.id")
    @Mapping(target = "patientName", source = "patient.fullName")
    @Mapping(target = "doctorId", source = "doctor.id")
    @Mapping(target = "doctorName", source = "doctor.fullName")
    @Mapping(target = "hospitalId", source = "hospital.id")
    @Mapping(target = "hospitalName", source = "hospital.name")
    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "qrValidationToken", source = "qrCode.validationToken")
    AppointmentDto toDto(Appointment entity);

    List<AppointmentDto> toDtoList(List<Appointment> entities);

    @Mapping(target = "changedBy", source = "changedBy.id")
    AppointmentStatusHistoryDto toHistoryDto(AppointmentStatusHistory entity);

    List<AppointmentStatusHistoryDto> toHistoryDtoList(List<AppointmentStatusHistory> entities);
}
