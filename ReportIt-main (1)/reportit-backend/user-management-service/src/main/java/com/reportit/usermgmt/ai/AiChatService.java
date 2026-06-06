package com.reportit.usermgmt.ai;

import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.entity.Complaint;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.repository.CategoryRepository;
import com.reportit.usermgmt.repository.ComplaintRepository;
import com.reportit.usermgmt.repository.OfficerRepository;
import com.reportit.usermgmt.repository.UserRepository;
import com.reportit.usermgmt.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    public String reply(String message) {
        UserPrincipal principal = AuthHelper.currentUser();
        String role = principal.getRole();
        String text = message == null ? "" : message.trim().toLowerCase(Locale.ROOT);

        if (text.isBlank()) {
            return "Please type a question about complaints, status, officers, users, or categories.";
        }

        if (containsAny(text, "status", "track", "progress", "pending", "resolved", "in progress")) {
            return statusReply(role, principal.getUserId());
        }

        if (containsAny(text, "complaint", "case", "recent", "report")) {
            return complaintReply(role, principal.getUserId());
        }

        if (containsAny(text, "officer", "assigned", "police")) {
            return officerReply();
        }

        if (containsAny(text, "user", "citizen", "registered")) {
            return userReply(role);
        }

        if (containsAny(text, "category", "type")) {
            return categoryReply();
        }

        return overviewReply(role, principal.getUserId());
    }

    private String statusReply(String role, Long userId) {
        List<Complaint> complaints = scopedComplaints(role, userId);
        long pending = complaints.stream().filter(c -> equalsStatus(c, "Pending")).count();
        long inProgress = complaints.stream().filter(c -> equalsStatus(c, "In Progress")).count();
        long resolved = complaints.stream().filter(c -> equalsStatus(c, "Resolved")).count();
        long assigned = complaints.stream().filter(c -> c.getAssignedOfficer() != null).count();
        return "From the database: " + complaints.size() + " complaint(s), " + pending
                + " pending, " + inProgress + " in progress, " + resolved
                + " resolved, and " + assigned + " assigned.";
    }

    private String complaintReply(String role, Long userId) {
        List<Complaint> complaints = scopedComplaints(role, userId);
        if (complaints.isEmpty()) {
            return "The database has no complaints for your panel yet.";
        }
        return complaints.stream()
                .sorted(Comparator.comparing(Complaint::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(3)
                .map(c -> c.getComplaintCode() + " - " + c.getTitle() + " (" + c.getStatus() + ")")
                .collect(Collectors.joining("\n", "Recent database complaints:\n", ""));
    }

    private String officerReply() {
        long officers = userRepository.findByRole_Name("OFFICER").size();
        long activeOfficers = userRepository.findByRole_Name("OFFICER").stream()
                .filter(u -> "Active".equalsIgnoreCase(u.getStatus()))
                .count();
        long officerProfiles = officerRepository.count();
        return "From the database: " + activeOfficers + " active officer(s), "
                + officers + " officer login account(s), and " + officerProfiles + " officer profile record(s).";
    }

    private String userReply(String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return "User totals are available to admins. You can ask me about your complaints or status.";
        }
        long citizens = userRepository.findByRole_Name("CITIZEN").size();
        long officers = userRepository.findByRole_Name("OFFICER").size();
        long admins = userRepository.findByRole_Name("ADMIN").size();
        return "From the database: " + citizens + " citizen(s), " + officers
                + " officer(s), and " + admins + " admin account(s).";
    }

    private String categoryReply() {
        List<String> categories = categoryRepository.findAll().stream()
                .map(category -> category.getName())
                .sorted()
                .toList();
        if (categories.isEmpty()) {
            return "No complaint categories are stored in the database yet.";
        }
        return "Database categories: " + String.join(", ", categories) + ".";
    }

    private String overviewReply(String role, Long userId) {
        List<Complaint> complaints = scopedComplaints(role, userId);
        long totalUsers = "ADMIN".equalsIgnoreCase(role) ? userRepository.count() : 0;
        String usersPart = "ADMIN".equalsIgnoreCase(role) ? " Users: " + totalUsers + "." : "";
        return "ReportIt database summary: " + complaints.size()
                + " complaint(s) visible in your panel." + usersPart
                + " Ask about status, recent complaints, officers, users, or categories.";
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
}
