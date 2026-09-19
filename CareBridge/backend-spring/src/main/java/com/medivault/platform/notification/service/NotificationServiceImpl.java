package com.medivault.platform.notification.service;

import com.medivault.platform.notification.dto.NotificationDto;
import com.medivault.platform.notification.entity.Notification;
import com.medivault.platform.notification.repository.NotificationRepository;
import com.medivault.platform.mapper.PlatformMapper;
import com.medivault.security.entity.User;
import com.medivault.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PlatformMapper mapper;

    @Override
    @Transactional
    public void sendNotification(UUID userId, String type, String category, String title, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .category(category)
                .title(title)
                .content(content)
                .status("PENDING")
                .build();

        notification = notificationRepository.save(notification);

        // Stub for actual email sending logic
        try {
            log.info("Sending {} notification to {}: {}", type, user.getEmail(), title);
            notification.setStatus("SENT");
        } catch (Exception e) {
            log.error("Failed to send notification", e);
            notification.setStatus("FAILED");
        }

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationDto> getUserNotifications(UUID userId) {
        return mapper.toNotificationDtoList(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @Override
    @Transactional
    public void markAsRead(UUID notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }
}
