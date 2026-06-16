package com.reportit.usermgmt.mongo;

import com.reportit.usermgmt.entity.*;
import com.reportit.usermgmt.mongo.document.*;
import com.reportit.usermgmt.mongo.repository.*;
import com.reportit.usermgmt.repository.ComplaintNoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MongoSyncService {

    private final MongoComplaintRepository mongoComplaintRepository;
    private final MongoStatusEventRepository mongoStatusEventRepository;
    private final MongoNotificationRepository mongoNotificationRepository;
    private final MongoAiChatMessageRepository mongoAiChatMessageRepository;
    private final MongoFileRepository mongoFileRepository;
    private final ComplaintNoteRepository complaintNoteRepository;

    public void mirrorComplaint(Complaint complaint) {
        if (complaint == null || complaint.getId() == null) return;
        safe("complaint " + complaint.getId(), () -> {
            List<String> notes = complaintNoteRepository.findByComplaint_IdOrderByCreatedAtDesc(complaint.getId())
                    .stream()
                    .map(ComplaintNote::getNoteText)
                    .map(String::trim)
                    .filter(note -> !note.isBlank())
                    .distinct()
                    .toList();

            MongoComplaintDocument document = mongoComplaintRepository
                    .findByMysqlComplaintId(complaint.getId())
                    .orElseGet(MongoComplaintDocument::new);

            document.setMysqlComplaintId(complaint.getId());
            document.setComplaintCode(complaint.getComplaintCode());
            document.setTitle(complaint.getTitle());
            document.setCategory(complaint.getCategory());
            document.setDescription(complaint.getDescription());
            document.setLocationText(complaint.getLocationText());
            document.setLatitude(complaint.getLatitude());
            document.setLongitude(complaint.getLongitude());
            document.setIncidentDate(complaint.getIncidentDate());
            document.setIncidentTime(complaint.getIncidentTime());
            document.setPriority(complaint.getPriority());
            document.setStatus(complaint.getStatus());
            document.setCitizenId(complaint.getCitizen() != null ? complaint.getCitizen().getId() : null);
            document.setCitizenName(complaint.getCitizen() != null ? complaint.getCitizen().getFullName() : null);
            document.setAssignedOfficerId(complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getId() : null);
            document.setAssignedOfficerName(complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getFullName() : null);
            document.setCitizenDeleted(Boolean.TRUE.equals(complaint.getCitizenDeleted()));
            document.setCitizenDeletedAt(complaint.getCitizenDeletedAt());
            document.setCreatedAt(complaint.getCreatedAt());
            document.setUpdatedAt(complaint.getUpdatedAt());
            document.setInvestigationNotes(notes);

            mongoComplaintRepository.save(document);
        });
    }

    public void mirrorStatusEvent(StatusHistory history) {
        if (history == null || history.getId() == null) return;
        safe("status history " + history.getId(), () -> {
            if (mongoStatusEventRepository.existsByMysqlHistoryId(history.getId())) return;

            Complaint complaint = history.getComplaint();
            User changedBy = history.getChangedBy();
            mongoStatusEventRepository.save(MongoStatusEventDocument.builder()
                    .mysqlHistoryId(history.getId())
                    .complaintId(complaint != null ? complaint.getId() : null)
                    .complaintCode(complaint != null ? complaint.getComplaintCode() : null)
                    .oldStatus(history.getOldStatus())
                    .newStatus(history.getNewStatus())
                    .changedByUserId(changedBy != null ? changedBy.getId() : null)
                    .changedByName(changedBy != null ? changedBy.getFullName() : null)
                    .remark(history.getRemark())
                    .createdAt(history.getCreatedAt())
                    .build());
        });
    }

    public void mirrorNotification(Notification notification) {
        if (notification == null || notification.getId() == null) return;
        safe("notification " + notification.getId(), () -> {
            MongoNotificationDocument document = mongoNotificationRepository
                    .findByMysqlNotificationId(notification.getId())
                    .orElseGet(MongoNotificationDocument::new);
            document.setMysqlNotificationId(notification.getId());
            document.setUserId(notification.getUser() != null ? notification.getUser().getId() : null);
            document.setTitle(notification.getTitle());
            document.setMessage(notification.getMessage());
            document.setIsRead(Boolean.TRUE.equals(notification.getIsRead()));
            document.setCreatedAt(notification.getCreatedAt());
            mongoNotificationRepository.save(document);
        });
    }

    public void mirrorAiChatMessage(AiChatMessage message) {
        if (message == null || message.getId() == null) return;
        safe("AI chat message " + message.getId(), () -> {
            if (mongoAiChatMessageRepository.existsByMysqlMessageId(message.getId())) return;

            mongoAiChatMessageRepository.save(MongoAiChatMessageDocument.builder()
                    .mysqlMessageId(message.getId())
                    .userId(message.getUser() != null ? message.getUser().getId() : null)
                    .sender(message.getSender())
                    .message(message.getMessage())
                    .createdAt(message.getCreatedAt())
                    .build());
        });
    }

    public void mirrorFile(UploadedFile file) {
        if (file == null || file.getId() == null) return;
        safe("file " + file.getId(), () -> {
            if (mongoFileRepository.existsByMysqlFileId(file.getId())) return;

            Complaint complaint = file.getComplaint();
            mongoFileRepository.save(MongoFileDocument.builder()
                    .mysqlFileId(file.getId())
                    .complaintId(complaint != null ? complaint.getId() : null)
                    .complaintCode(complaint != null ? complaint.getComplaintCode() : null)
                    .uploadedByUserId(file.getUploadedBy() != null ? file.getUploadedBy().getId() : null)
                    .fileName(file.getFileName())
                    .filePath(file.getFilePath())
                    .contentType(file.getContentType())
                    .sizeBytes(file.getSizeBytes())
                    .uploadedAt(file.getUploadedAt())
                    .build());
        });
    }

    private void safe(String label, Runnable action) {
        try {
            action.run();
        } catch (RuntimeException ex) {
            log.warn("MongoDB sync skipped for {}: {}", label, ex.getMessage());
        }
    }
}
