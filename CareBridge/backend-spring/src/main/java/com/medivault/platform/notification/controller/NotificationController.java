package com.medivault.platform.notification.controller;

import com.medivault.common.ApiResponse;
import com.medivault.platform.notification.dto.NotificationDto;
import com.medivault.platform.notification.service.NotificationService;
import com.medivault.security.CustomUserDetails;
import com.medivault.util.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Endpoints for managing notifications")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get all my notifications")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getMyNotifications(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseBuilder.success(notificationService.getUserNotifications(user.getId()), "Notifications retrieved successfully");
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable UUID id) {
        notificationService.markAsRead(id);
        return ResponseBuilder.success(null, "Notification marked as read");
    }
}
