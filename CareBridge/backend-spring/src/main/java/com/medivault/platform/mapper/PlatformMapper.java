package com.medivault.platform.mapper;

import com.medivault.platform.emergency.dto.EmergencyProfileDto;
import com.medivault.platform.emergency.entity.EmergencyProfile;
import com.medivault.platform.notification.dto.NotificationDto;
import com.medivault.platform.notification.entity.Notification;
import com.medivault.platform.scheme.dto.GovernmentSchemeDto;
import com.medivault.platform.scheme.entity.GovernmentScheme;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PlatformMapper {

    NotificationDto toNotificationDto(Notification entity);

    List<NotificationDto> toNotificationDtoList(List<Notification> entities);

    @Mapping(target = "patientId", source = "patient.id")
    @Mapping(target = "patientName", source = "patient.fullName")
    EmergencyProfileDto toEmergencyProfileDto(EmergencyProfile entity);

    GovernmentSchemeDto toSchemeDto(GovernmentScheme entity);

    List<GovernmentSchemeDto> toSchemeDtoList(List<GovernmentScheme> entities);

    default java.time.ZonedDateTime map(java.time.Instant instant) {
        return instant == null ? null : instant.atZone(java.time.ZoneId.of("UTC"));
    }
}
