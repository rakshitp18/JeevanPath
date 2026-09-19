package com.medivault.platform.notification.dto;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
public class NotificationDto {
    private UUID id;
    private String type;
    private String category;
    private String title;
    private String content;
    private String status;
    private Boolean isRead;
    private ZonedDateTime createdAt;
}
