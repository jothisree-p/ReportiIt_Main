package com.reportit.usermgmt.complaint;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.common.UserProvisioningService;
import com.reportit.usermgmt.entity.Complaint;
import com.reportit.usermgmt.entity.ComplaintNote;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.mongo.MongoSyncService;
import com.reportit.usermgmt.notification.NotificationService;
import com.reportit.usermgmt.repository.*;
import com.reportit.usermgmt.status.StatusService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final ComplaintNoteRepository noteRepository;
    private final StatusService statusService;
    private final UserProvisioningService userProvisioningService;
    private final NotificationService notificationService;
    private final MongoSyncService mongoSyncService;

    @Transactional
    public ComplaintResponse create(ComplaintRequest request) {
        User citizen = userProvisioningService.ensureCurrentUser();

        Complaint complaint = Complaint.builder()
                .complaintCode(generateCode())
                .title(request.getTitle())
                .category(request.getCategory())
                .description(request.getDescription())
                .locationText(request.getLocationText())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .incidentDate(request.getIncidentDate())
                .incidentTime(request.getIncidentTime())
                .priority("Pending")
                .status("Pending")
                .citizen(citizen)
                .build();

        complaint = complaintRepository.save(complaint);
        statusService.recordStatusChange(complaint, null, "Pending", citizen, "Complaint filed");
        mongoSyncService.mirrorComplaint(complaint);
        notify(citizen, "Complaint Submitted", "Your complaint " + complaint.getComplaintCode() + " was submitted.");
        notificationService.notifyAdmins("New Complaint Reported",
                citizen.getFullName() + " reported " + complaint.getComplaintCode() + ": " + complaint.getTitle());
        return toResponse(complaint);
    }

    public List<ComplaintResponse> findAll() {
        return complaintRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ComplaintResponse findById(Long id) {
        return toResponse(getComplaint(id));
    }

    public List<ComplaintResponse> findMyComplaints() {
        User citizen = userProvisioningService.ensureCurrentUser();
        return complaintRepository.findByCitizen_Id(citizen.getId()).stream()
                .filter(complaint -> !Boolean.TRUE.equals(complaint.getCitizenDeleted()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> findAssignedToMe() {
        Long officerId = AuthHelper.currentUser().getUserId();
        return complaintRepository.findByAssignedOfficer_Id(officerId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse update(Long id, ComplaintUpdateRequest request) {
        Complaint complaint = getComplaint(id);
        String oldStatus = complaint.getStatus();

        if (request.getTitle() != null) complaint.setTitle(request.getTitle());
        if (request.getCategory() != null) complaint.setCategory(request.getCategory());
        if (request.getDescription() != null) complaint.setDescription(request.getDescription());
        if (request.getLocationText() != null) complaint.setLocationText(request.getLocationText());
        if (request.getLatitude() != null) complaint.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) complaint.setLongitude(request.getLongitude());
        if (request.getIncidentDate() != null) complaint.setIncidentDate(request.getIncidentDate());
        if (request.getIncidentTime() != null) complaint.setIncidentTime(request.getIncidentTime());
        if (request.getPriority() != null) complaint.setPriority(request.getPriority());
        if (request.getStatus() != null) complaint.setStatus(request.getStatus());

        complaint = complaintRepository.save(complaint);
        User changer = userRepository.findById(AuthHelper.currentUser().getUserId()).orElse(null);
        mongoSyncService.mirrorComplaint(complaint);

        if (changer != null && "CITIZEN".equalsIgnoreCase(AuthHelper.currentUser().getRole())) {
            notificationService.notifyAdmins("Complaint Edited by Citizen",
                    complaint.getComplaintCode() + " was updated by " + changer.getFullName() + ".");
        }

        if (request.getStatus() != null && !request.getStatus().equals(oldStatus)) {
            statusService.recordStatusChange(complaint, oldStatus, request.getStatus(), changer, request.getRemark());
            notify(complaint.getCitizen(), "Status Updated",
                    "Complaint " + complaint.getComplaintCode() + " is now " + request.getStatus());
            if ("Resolved".equalsIgnoreCase(request.getStatus())) {
                notificationService.notifyAdmins("Case Solved",
                        "Officer marked " + complaint.getComplaintCode() + " as resolved.");
            }
        }

        if (request.getNote() != null && !request.getNote().isBlank()) {
            String note = request.getNote().trim();
            User officer = userRepository.findById(AuthHelper.currentUser().getUserId()).orElse(null);
            boolean duplicateNote = noteRepository.findByComplaint_IdOrderByCreatedAtDesc(complaint.getId()).stream()
                    .anyMatch(existing -> note.equalsIgnoreCase(existing.getNoteText().trim()));
            if (!duplicateNote) {
                noteRepository.save(ComplaintNote.builder()
                        .complaint(complaint)
                        .officer(officer)
                        .noteText(note)
                        .build());
                mongoSyncService.mirrorComplaint(complaint);
            }
        }

        return toResponse(complaint);
    }

    @Transactional
    public ComplaintResponse addNote(Long id, ComplaintNoteRequest request) {
        Complaint complaint = getComplaint(id);
        String note = request.getNote() != null ? request.getNote().trim() : "";
        if (note.isBlank()) {
            throw new ApiException("Investigation note is required", HttpStatus.BAD_REQUEST);
        }

        boolean duplicateNote = noteRepository.findByComplaint_IdOrderByCreatedAtDesc(complaint.getId()).stream()
                .anyMatch(existing -> note.equalsIgnoreCase(existing.getNoteText().trim()));
        if (duplicateNote) {
            return toResponse(complaint);
        }

        User officer = userRepository.findById(AuthHelper.currentUser().getUserId()).orElse(null);
        noteRepository.save(ComplaintNote.builder()
                .complaint(complaint)
                .officer(officer)
                .noteText(note)
                .build());
        mongoSyncService.mirrorComplaint(complaint);
        statusService.recordStatusChange(complaint, complaint.getStatus(), complaint.getStatus(), officer,
                "Investigation note added");
        notify(complaint.getCitizen(), "Investigation Note Added",
                "An officer added a new note for " + complaint.getComplaintCode() + ".");

        return toResponse(complaint);
    }

    @Transactional
    public ComplaintResponse assignOfficer(Long id, Long officerUserId) {
        Complaint complaint = getComplaint(id);
        User officer = userRepository.findById(officerUserId)
                .orElseThrow(() -> new ApiException("Officer not found", HttpStatus.NOT_FOUND));
        if (!"OFFICER".equalsIgnoreCase(officer.getRole().getName())) {
            throw new ApiException("User is not an officer", HttpStatus.BAD_REQUEST);
        }
        complaint.setAssignedOfficer(officer);
        complaint.setStatus("Assigned");
        complaint = complaintRepository.save(complaint);
        mongoSyncService.mirrorComplaint(complaint);
        notify(officer, "Case Assigned", "Complaint " + complaint.getComplaintCode() + " assigned to you.");
        notify(complaint.getCitizen(), "Officer Assigned", "An officer was assigned to " + complaint.getComplaintCode());
        return toResponse(complaint);
    }

    @Transactional
    public void delete(Long id) {
        Complaint complaint = getComplaint(id);
        Long currentUserId = AuthHelper.currentUser().getUserId();
        if (complaint.getCitizen() != null && !complaint.getCitizen().getId().equals(currentUserId)) {
            throw new ApiException("Only the complaint owner can delete it from My Complaints", HttpStatus.FORBIDDEN);
        }
        complaint.setCitizenDeleted(true);
        complaint.setCitizenDeletedAt(LocalDateTime.now());
        complaintRepository.save(complaint);
        mongoSyncService.mirrorComplaint(complaint);
        notificationService.notifyAdmins("Complaint Deleted by Citizen",
                complaint.getComplaintCode() + " was removed from the citizen view but kept in admin records.");
    }

    private Complaint getComplaint(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ApiException("Complaint not found", HttpStatus.NOT_FOUND));
    }

    private String generateCode() {
        long count = complaintRepository.count() + 1;
        return "CMP-" + Year.now().getValue() + "-" + String.format("%03d", count);
    }

    private void notify(User user, String title, String message) {
        notificationService.notifyUser(user, title, message);
    }

    private ComplaintResponse toResponse(Complaint c) {
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
                .citizenDeleted(Boolean.TRUE.equals(c.getCitizenDeleted()))
                .citizenDeletedAt(c.getCitizenDeletedAt())
                .investigationNotes(notes)
                .build();
    }

    @Data
    public static class ComplaintRequest {
        private String title;
        private String category;
        private String description;
        private String locationText;
        private java.math.BigDecimal latitude;
        private java.math.BigDecimal longitude;
        private LocalDate incidentDate;
        private String incidentTime;
        private String priority;
    }

    @Data
    public static class ComplaintUpdateRequest {
        private String title;
        private String category;
        private String description;
        private String locationText;
        private java.math.BigDecimal latitude;
        private java.math.BigDecimal longitude;
        private LocalDate incidentDate;
        private String incidentTime;
        private String priority;
        private String status;
        private String remark;
        private String note;
    }

    @Data
    public static class ComplaintNoteRequest {
        private String note;
    }

    @Data
    @Builder
    public static class ComplaintResponse {
        private Long id;
        private String complaintCode;
        private String title;
        private String category;
        private String description;
        private String locationText;
        private java.math.BigDecimal latitude;
        private java.math.BigDecimal longitude;
        private LocalDate incidentDate;
        private String incidentTime;
        private String priority;
        private String status;
        private Long citizenId;
        private String citizenName;
        private Long assignedOfficerId;
        private String assignedOfficerName;
        private java.time.LocalDateTime createdAt;
        private Boolean citizenDeleted;
        private java.time.LocalDateTime citizenDeletedAt;
        private List<String> investigationNotes;
    }
}
