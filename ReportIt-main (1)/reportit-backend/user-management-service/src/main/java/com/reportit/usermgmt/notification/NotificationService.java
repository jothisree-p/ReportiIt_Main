package com.reportit.usermgmt.notification;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.entity.Notification;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.mongo.MongoSyncService;
import com.reportit.usermgmt.repository.NotificationRepository;
import com.reportit.usermgmt.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final MongoSyncService mongoSyncService;

    @Transactional
    public NotificationResponse create(NotificationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return toResponse(createForUser(user, request.getTitle(), request.getMessage()));
    }

    @Transactional
    public void notifyAdmins(String title, String message) {
        userRepository.findByRole_Name("ADMIN")
                .forEach(admin -> createForUser(admin, title, message));
    }

    @Transactional
    public void notifyUser(User user, String title, String message) {
        if (user != null) {
            createForUser(user, title, message);
        }
    }

    private Notification createForUser(User user, String title, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        Notification saved = notificationRepository.save(notification);
        mongoSyncService.mirrorNotification(saved);
        return saved;
    }

    public List<NotificationResponse> findMine() {
        Long userId = AuthHelper.currentUser().getUserId();
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<NotificationResponse> findAll() {
        return notificationRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public NotificationResponse findById(Long id) {
        return toResponse(getNotification(id));
    }

    @Transactional
    public NotificationResponse markRead(Long id) {
        Notification notification = getNotification(id);
        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        mongoSyncService.mirrorNotification(saved);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ApiException("Notification not found", HttpStatus.NOT_FOUND);
        }
        notificationRepository.deleteById(id);
    }

    private Notification getNotification(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new ApiException("Notification not found", HttpStatus.NOT_FOUND));
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUser().getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build();
    }

    @Data
    public static class NotificationRequest {
        private Long userId;
        private String title;
        private String message;
    }

    @Data
    @Builder
    public static class NotificationResponse {
        private Long id;
        private Long userId;
        private String title;
        private String message;
        private Boolean isRead;
        private java.time.LocalDateTime createdAt;
    }
}
