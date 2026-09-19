package com.medivault.platform.notification.service;

import com.medivault.platform.notification.dto.NotificationDto;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void sendNotification(UUID userId, String type, String category, String title, String content);
    List<NotificationDto> getUserNotifications(UUID userId);
    void markAsRead(UUID notificationId);
}
