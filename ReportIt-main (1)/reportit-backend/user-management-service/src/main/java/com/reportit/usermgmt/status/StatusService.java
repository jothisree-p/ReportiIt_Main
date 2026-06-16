package com.reportit.usermgmt.status;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.complaint.ComplaintService.ComplaintResponse;
import com.reportit.usermgmt.entity.Complaint;
import com.reportit.usermgmt.entity.StatusHistory;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.mongo.MongoSyncService;
import com.reportit.usermgmt.repository.ComplaintNoteRepository;
import com.reportit.usermgmt.repository.ComplaintRepository;
import com.reportit.usermgmt.repository.StatusHistoryRepository;
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
public class StatusService {

    private final StatusHistoryRepository statusHistoryRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintNoteRepository noteRepository;
    private final MongoSyncService mongoSyncService;

    @Transactional
    public void recordStatusChange(Complaint complaint, String oldStatus, String newStatus, User changedBy, String remark) {
        StatusHistory history = statusHistoryRepository.save(StatusHistory.builder()
                .complaint(complaint)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedBy(changedBy)
                .remark(remark)
                .build());
        mongoSyncService.mirrorStatusEvent(history);
    }

    @Transactional
    public StatusHistoryResponse addStatus(Long complaintId, StatusRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ApiException("Complaint not found", HttpStatus.NOT_FOUND));
        String oldStatus = complaint.getStatus();
        complaint.setStatus(request.getNewStatus());
        complaintRepository.save(complaint);
        StatusHistory history = statusHistoryRepository.save(StatusHistory.builder()
                .complaint(complaint)
                .oldStatus(oldStatus)
                .newStatus(request.getNewStatus())
                .remark(request.getRemark())
                .build());
        mongoSyncService.mirrorComplaint(complaint);
        mongoSyncService.mirrorStatusEvent(history);
        return toResponse(history);
    }

    public List<StatusHistoryResponse> getHistory(Long complaintId) {
        return statusHistoryRepository.findByComplaint_IdOrderByCreatedAtDesc(complaintId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TrackResponse trackByCode(String complaintCode) {
        Complaint complaint = complaintRepository.findByComplaintCode(complaintCode)
                .orElseThrow(() -> new ApiException("Complaint not found", HttpStatus.NOT_FOUND));
        List<StatusHistoryResponse> history = getHistory(complaint.getId());
        return TrackResponse.builder()
                .complaint(toComplaintResponse(complaint))
                .history(history)
                .build();
    }

    private ComplaintResponse toComplaintResponse(Complaint c) {
        List<String> notes = noteRepository.findByComplaint_IdOrderByCreatedAtDesc(c.getId())
                .stream()
                .map(com.reportit.usermgmt.entity.ComplaintNote::getNoteText)
                .map(String::trim)
                .filter(note -> !note.isBlank())
                .distinct()
                .collect(Collectors.toList());

        return ComplaintResponse.builder()
                .id(c.getId())
                .complaintCode(c.getComplaintCode())
                .title(c.getTitle())
                .category(c.getCategory())
                .description(c.getDescription())
                .locationText(c.getLocationText())
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .incidentDate(c.getIncidentDate())
                .incidentTime(c.getIncidentTime())
                .priority(c.getPriority())
                .status(c.getStatus())
                .citizenId(c.getCitizen() != null ? c.getCitizen().getId() : null)
                .citizenName(c.getCitizen() != null ? c.getCitizen().getFullName() : null)
                .assignedOfficerId(c.getAssignedOfficer() != null ? c.getAssignedOfficer().getId() : null)
                .assignedOfficerName(c.getAssignedOfficer() != null ? c.getAssignedOfficer().getFullName() : null)
                .createdAt(c.getCreatedAt())
                .investigationNotes(notes)
                .build();
    }

    private StatusHistoryResponse toResponse(StatusHistory h) {
        return StatusHistoryResponse.builder()
                .id(h.getId())
                .complaintId(h.getComplaint().getId())
                .oldStatus(h.getOldStatus())
                .newStatus(h.getNewStatus())
                .remark(h.getRemark())
                .createdAt(h.getCreatedAt())
                .build();
    }

    @Data
    public static class StatusRequest {
        private String newStatus;
        private String remark;
    }

    @Data
    @Builder
    public static class StatusHistoryResponse {
        private Long id;
        private Long complaintId;
        private String oldStatus;
        private String newStatus;
        private String remark;
        private java.time.LocalDateTime createdAt;
    }

    @Data
    @Builder
    public static class TrackResponse {
        private ComplaintResponse complaint;
        private List<StatusHistoryResponse> history;
    }
}
