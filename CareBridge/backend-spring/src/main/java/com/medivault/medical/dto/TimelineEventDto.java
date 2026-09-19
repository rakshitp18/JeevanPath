package com.medivault.medical.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
@Builder
public class TimelineEventDto {
    private String eventType; // APPOINTMENT, MEDICAL_RECORD, PRESCRIPTION, DOCUMENT
    private String title;
    private String description;
    private ZonedDateTime eventDate;
    private Object eventData; // The actual DTO
}
