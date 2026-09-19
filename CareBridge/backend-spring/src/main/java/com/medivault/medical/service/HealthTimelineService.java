package com.medivault.medical.service;

import com.medivault.medical.dto.TimelineEventDto;

import java.util.List;
import java.util.UUID;

public interface HealthTimelineService {
    List<TimelineEventDto> getPatientTimeline(UUID patientId);
}
