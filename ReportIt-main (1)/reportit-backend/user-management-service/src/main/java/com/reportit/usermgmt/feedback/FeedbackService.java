package com.reportit.usermgmt.feedback;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.common.UserProvisioningService;
import com.reportit.usermgmt.entity.Complaint;
import com.reportit.usermgmt.entity.ComplaintFeedback;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.notification.NotificationService;
import com.reportit.usermgmt.repository.ComplaintFeedbackRepository;
import com.reportit.usermgmt.repository.ComplaintRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintFeedbackRepository feedbackRepository;
    private final UserProvisioningService userProvisioningService;
    private final NotificationService notificationService;

    @Transactional
    public FeedbackResponse saveForComplaint(Long complaintId, FeedbackRequest request) {
        User citizen = userProvisioningService.ensureCurrentUser();
        Complaint complaint = getComplaint(complaintId);

        if (complaint.getCitizen() == null || !complaint.getCitizen().getId().equals(citizen.getId())) {
            throw new ApiException("Only the complaint owner can submit feedback", HttpStatus.FORBIDDEN);
        }

        int rating = request.getRating() == null ? 0 : request.getRating();
        if (rating < 1 || rating > 5) {
            throw new ApiException("Feedback rating must be between 1 and 5", HttpStatus.BAD_REQUEST);
        }

        ComplaintFeedback feedback = feedbackRepository
                .findByComplaint_IdAndCitizen_Id(complaint.getId(), citizen.getId())
                .orElseGet(() -> ComplaintFeedback.builder()
                        .complaint(complaint)
                        .citizen(citizen)
                        .build());

        feedback.setOfficer(complaint.getAssignedOfficer());
        feedback.setRating(rating);
        feedback.setComment(request.getComment() == null ? "" : request.getComment().trim());
        feedback.setUpdatedAt(LocalDateTime.now());

        ComplaintFeedback saved = feedbackRepository.save(feedback);

        notificationService.notifyAdmins("Citizen Feedback Received",
                citizen.getFullName() + " rated " + complaint.getComplaintCode() + " with " + rating + " stars.");
        notificationService.notifyUser(complaint.getAssignedOfficer(), "Feedback Received",
                citizen.getFullName() + " sent feedback for " + complaint.getComplaintCode() + ".");

        return toResponse(saved);
    }

    public FeedbackResponse findForComplaint(Long complaintId) {
        ComplaintFeedback feedback = feedbackRepository.findByComplaint_Id(complaintId)
                .orElseThrow(() -> new ApiException("No feedback submitted for this complaint", HttpStatus.NOT_FOUND));
        authorizeView(feedback);
        return toResponse(feedback);
    }

    public List<FeedbackResponse> findMineForOfficer() {
        Long officerId = AuthHelper.currentUser().getUserId();
        return feedbackRepository.findByOfficer_IdOrderByUpdatedAtDesc(officerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponse> findAllForAdmin() {
        if (!"ADMIN".equalsIgnoreCase(AuthHelper.currentUser().getRole())) {
            throw new ApiException("Only admins can view all feedback", HttpStatus.FORBIDDEN);
        }
        return feedbackRepository.findAllByOrderByUpdatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private Complaint getComplaint(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ApiException("Complaint not found", HttpStatus.NOT_FOUND));
    }

    private void authorizeView(ComplaintFeedback feedback) {
        Long userId = AuthHelper.currentUser().getUserId();
        String role = AuthHelper.currentUser().getRole();
        boolean canView =
                "ADMIN".equalsIgnoreCase(role)
                        || (feedback.getCitizen() != null && feedback.getCitizen().getId().equals(userId))
                        || (feedback.getOfficer() != null && feedback.getOfficer().getId().equals(userId));
        if (!canView) {
            throw new ApiException("You cannot view this feedback", HttpStatus.FORBIDDEN);
        }
    }

    private FeedbackResponse toResponse(ComplaintFeedback feedback) {
        Complaint complaint = feedback.getComplaint();
        User citizen = feedback.getCitizen();
        User officer = feedback.getOfficer();
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .complaintId(complaint != null ? complaint.getId() : null)
                .complaintCode(complaint != null ? complaint.getComplaintCode() : null)
                .complaintTitle(complaint != null ? complaint.getTitle() : null)
                .citizenId(citizen != null ? citizen.getId() : null)
                .citizenName(citizen != null ? citizen.getFullName() : null)
                .officerId(officer != null ? officer.getId() : null)
                .officerName(officer != null ? officer.getFullName() : "Not assigned")
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .createdAt(feedback.getCreatedAt())
                .updatedAt(feedback.getUpdatedAt())
                .build();
    }

    @Data
    public static class FeedbackRequest {
        private Integer rating;
        private String comment;
    }

    @Data
    @Builder
    public static class FeedbackResponse {
        private Long id;
        private Long complaintId;
        private String complaintCode;
        private String complaintTitle;
        private Long citizenId;
        private String citizenName;
        private Long officerId;
        private String officerName;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}
