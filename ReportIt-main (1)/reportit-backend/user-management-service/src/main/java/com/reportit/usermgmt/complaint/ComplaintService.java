package com.reportit.usermgmt.complaint;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.common.UserProvisioningService;
import com.reportit.usermgmt.entity.Complaint;
import com.reportit.usermgmt.entity.ComplaintNote;
import com.reportit.usermgmt.entity.Notification;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.repository.*;
import com.reportit.usermgmt.status.StatusService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final ComplaintNoteRepository noteRepository;
    private final NotificationRepository notificationRepository;
    private final StatusService statusService;
    private final UserProvisioningService userProvisioningService;

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
                .priority(request.getPriority() != null ? request.getPriority() : "Medium")
                .status("Pending")
                .citizen(citizen)
                .build();

        complaint = complaintRepository.save(complaint);
        statusService.recordStatusChange(complaint, null, "Pending", citizen, "Complaint filed");
        notify(citizen, "Complaint Submitted", "Your complaint " + complaint.getComplaintCode() + " was submitted.");
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
        return complaintRepository.findByCitizen_Id(citizen.getId()).stream().map(this::toResponse).collect(Collectors.toList());
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
        if (request.getPriority() != null) complaint.setPriority(request.getPriority());
        if (request.getStatus() != null) complaint.setStatus(request.getStatus());

        complaint = complaintRepository.save(complaint);

        if (request.getStatus() != null && !request.getStatus().equals(oldStatus)) {
            User changer = userRepository.findById(AuthHelper.currentUser().getUserId()).orElse(null);
            statusService.recordStatusChange(complaint, oldStatus, request.getStatus(), changer, request.getRemark());
            notify(complaint.getCitizen(), "Status Updated",
                    "Complaint " + complaint.getComplaintCode() + " is now " + request.getStatus());
        }

        if (request.getNote() != null && !request.getNote().isBlank()) {
            User officer = userRepository.findById(AuthHelper.currentUser().getUserId()).orElse(null);
            noteRepository.save(ComplaintNote.builder()
                    .complaint(complaint)
                    .officer(officer)
                    .noteText(request.getNote())
                    .build());
        }

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
        complaint.setStatus("In Progress");
        complaint = complaintRepository.save(complaint);
        notify(officer, "Case Assigned", "Complaint " + complaint.getComplaintCode() + " assigned to you.");
        notify(complaint.getCitizen(), "Officer Assigned", "An officer was assigned to " + complaint.getComplaintCode());
        return toResponse(complaint);
    }

    @Transactional
    public void delete(Long id) {
        if (!complaintRepository.existsById(id)) {
            throw new ApiException("Complaint not found", HttpStatus.NOT_FOUND);
        }
        complaintRepository.deleteById(id);
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
        notificationRepository.save(Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .isRead(false)
                .build());
    }

    private ComplaintResponse toResponse(Complaint c) {
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
        private String priority;
        private String status;
        private String remark;
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
    }
}
