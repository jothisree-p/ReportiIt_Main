package com.reportit.usermgmt.ai;

import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.entity.AiChatMessage;
import com.reportit.usermgmt.entity.Complaint;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.repository.AiChatMessageRepository;
import com.reportit.usermgmt.repository.CategoryRepository;
import com.reportit.usermgmt.repository.ComplaintRepository;
import com.reportit.usermgmt.repository.OfficerRepository;
import com.reportit.usermgmt.repository.UserRepository;
import com.reportit.usermgmt.security.UserPrincipal;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiChatService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final OfficerRepository officerRepository;
    private final CategoryRepository categoryRepository;
    private final AiChatMessageRepository aiChatMessageRepository;

    @Transactional
    public String reply(String message) {
        UserPrincipal principal = AuthHelper.currentUser();
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        String role = principal.getRole();
        String text = message == null ? "" : message.trim().toLowerCase(Locale.ROOT);

        if (text.isBlank()) {
            return "Tell me what you want to check. I can help with your complaints, case status, officers, users, or categories.";
        }

        saveMessage(user, "user", message.trim());

        String reply;
        if (isGreeting(text)) {
            reply = "Hi! I am ReportIt Assistant. I can help you check complaint status, recent cases, officers, users, categories, and notifications from your saved records.";
        } else if (containsAny(text, "status", "track", "progress", "pending", "resolved", "in progress")) {
            reply = statusReply(role, principal.getUserId());
        } else if (containsAny(text, "complaint", "case", "recent", "report")) {
            reply = complaintReply(role, principal.getUserId());
        } else if (containsAny(text, "officer", "assigned", "police")) {
            reply = officerReply();
        } else if (containsAny(text, "user", "citizen", "registered")) {
            reply = userReply(role);
        } else if (containsAny(text, "category", "type")) {
            reply = categoryReply();
        } else {
            reply = overviewReply(role, principal.getUserId());
        }

        saveMessage(user, "ai", reply);
        return reply;
    }

    public List<AiChatMessageResponse> history() {
        Long userId = AuthHelper.currentUser().getUserId();
        return aiChatMessageRepository.findTop50ByUser_IdOrderByCreatedAtAsc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private String statusReply(String role, Long userId) {
        List<Complaint> complaints = scopedComplaints(role, userId);
        long pending = complaints.stream().filter(c -> equalsStatus(c, "Pending")).count();
        long inProgress = complaints.stream().filter(c -> equalsStatus(c, "In Progress")).count();
        long resolved = complaints.stream().filter(c -> equalsStatus(c, "Resolved")).count();
        long assigned = complaints.stream().filter(c -> c.getAssignedOfficer() != null).count();
        if (complaints.isEmpty()) {
            return "I checked your records and there are no complaints in your panel right now.";
        }
        return "Here is the latest status from your records: you have " + complaints.size()
                + " complaint(s). " + pending + " are pending, " + inProgress
                + " are in progress, " + resolved + " are resolved, and " + assigned
                + " have been assigned to an officer.";
    }

    private String complaintReply(String role, Long userId) {
        List<Complaint> complaints = scopedComplaints(role, userId);
        if (complaints.isEmpty()) {
            return "I checked your records and there are no complaints in your panel yet.";
        }
        return complaints.stream()
                .sorted(Comparator.comparing(Complaint::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(3)
                .map(c -> c.getComplaintCode() + " - " + c.getTitle() + " (" + c.getStatus() + ")")
                .collect(Collectors.joining("\n", "Here are the recent complaints I found:\n", ""));
    }

    private String officerReply() {
        long officers = userRepository.findByRole_Name("OFFICER").size();
        long activeOfficers = userRepository.findByRole_Name("OFFICER").stream()
                .filter(u -> "Active".equalsIgnoreCase(u.getStatus()))
                .count();
        long officerProfiles = officerRepository.count();
        return "I found " + activeOfficers + " active officer(s) out of " + officers
                + " officer account(s). There are " + officerProfiles + " officer profile record(s) saved.";
    }

    private String userReply(String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return "User totals are only available for admins. I can still help you check your complaints or status.";
        }
        long citizens = userRepository.findByRole_Name("CITIZEN").size();
        long officers = userRepository.findByRole_Name("OFFICER").size();
        long admins = userRepository.findByRole_Name("ADMIN").size();
        return "I checked the user records: there are " + citizens + " citizen(s), "
                + officers + " officer(s), and " + admins + " admin account(s).";
    }

    private String categoryReply() {
        List<String> categories = categoryRepository.findAll().stream()
                .map(category -> category.getName())
                .sorted()
                .toList();
        if (categories.isEmpty()) {
            return "No complaint categories have been added yet.";
        }
        return "These complaint categories are available: " + String.join(", ", categories) + ".";
    }

    private String overviewReply(String role, Long userId) {
        List<Complaint> complaints = scopedComplaints(role, userId);
        long totalUsers = "ADMIN".equalsIgnoreCase(role) ? userRepository.count() : 0;
        String usersPart = "ADMIN".equalsIgnoreCase(role) ? " Users: " + totalUsers + "." : "";
        if (complaints.isEmpty()) {
            return "Hi, I checked your panel and there are no complaints visible right now."
                    + usersPart + " You can ask me about status, complaints, officers, users, or categories.";
        }
        return "Hi, I checked your panel and found " + complaints.size()
                + " complaint(s)." + usersPart
                + " Ask me for recent complaints, status counts, officers, users, or categories.";
    }

    private List<Complaint> scopedComplaints(String role, Long userId) {
        if ("CITIZEN".equalsIgnoreCase(role)) {
            return complaintRepository.findByCitizen_Id(userId);
        }
        if ("OFFICER".equalsIgnoreCase(role)) {
            return complaintRepository.findByAssignedOfficer_Id(userId);
        }
        return complaintRepository.findAll();
    }

    private boolean equalsStatus(Complaint complaint, String status) {
        return status.equalsIgnoreCase(complaint.getStatus());
    }

    private boolean containsAny(String text, String... words) {
        for (String word : words) {
            if (text.contains(word)) {
                return true;
            }
        }
        return false;
    }

    private boolean isGreeting(String text) {
        return text.equals("hi")
                || text.equals("hello")
                || text.equals("hey")
                || text.equals("hai")
                || text.equals("hii")
                || text.equals("good morning")
                || text.equals("good afternoon")
                || text.equals("good evening");
    }

    private void saveMessage(User user, String sender, String message) {
        aiChatMessageRepository.save(AiChatMessage.builder()
                .user(user)
                .sender(sender)
                .message(message)
                .build());
    }

    private AiChatMessageResponse toResponse(AiChatMessage message) {
        return AiChatMessageResponse.builder()
                .id(message.getId())
                .sender(message.getSender())
                .text(message.getMessage())
                .createdAt(message.getCreatedAt())
                .build();
    }

    @Data
    @Builder
    public static class AiChatMessageResponse {
        private Long id;
        private String sender;
        private String text;
        private java.time.LocalDateTime createdAt;
    }
}
