package com.reportit.usermgmt.dashboard;

import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.entity.Complaint;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.repository.ComplaintRepository;
import com.reportit.usermgmt.repository.OfficerRepository;
import com.reportit.usermgmt.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final OfficerRepository officerRepository;

    public DashboardStats adminStats() {
        long total = complaintRepository.count();
        long pending = complaintRepository.countByStatus("Pending");
        long inProgress = complaintRepository.countByStatus("In Progress");
        long resolved = complaintRepository.countByStatus("Resolved");
        long rejected = complaintRepository.countByStatus("Rejected");
        return buildStats(total, pending, inProgress, resolved, rejected,
                userRepository.findByRole_Name("CITIZEN").size(),
                userRepository.countByRole_NameAndStatusIgnoreCase("OFFICER", "Active"));
    }

    public DashboardStats officerStats() {
        Long officerId = AuthHelper.currentUser().getUserId();
        var complaints = complaintRepository.findByAssignedOfficer_Id(officerId);
        long total = complaints.size();
        long pending = complaints.stream().filter(c -> "Pending".equals(c.getStatus())).count();
        long inProgress = complaints.stream().filter(c -> "In Progress".equals(c.getStatus())).count();
        long resolved = complaints.stream().filter(c -> "Resolved".equals(c.getStatus())).count();
        long rejected = complaints.stream().filter(c -> "Rejected".equals(c.getStatus())).count();
        return buildStats(total, pending, inProgress, resolved, rejected, null, null);
    }

    public DashboardStats citizenStats() {
        Long citizenId = AuthHelper.currentUser().getUserId();
        var complaints = complaintRepository.findByCitizen_Id(citizenId);
        long total = complaints.size();
        long pending = complaints.stream().filter(c -> "Pending".equals(c.getStatus())).count();
        long inProgress = complaints.stream().filter(c -> "In Progress".equals(c.getStatus())).count();
        long resolved = complaints.stream().filter(c -> "Resolved".equals(c.getStatus())).count();
        long rejected = complaints.stream().filter(c -> "Rejected".equals(c.getStatus())).count();
        return buildStats(total, pending, inProgress, resolved, rejected, null, null);
    }

    public DashboardAnalytics adminAnalytics() {
        List<Complaint> complaints = complaintRepository.findAll();
        List<User> citizens = userRepository.findByRole_Name("CITIZEN");
        return DashboardAnalytics.builder()
                .stats(adminStats())
                .monthlyComplaintTrends(monthlyComplaintTrends(complaints))
                .weeklyComplaintTrends(weeklyComplaintTrends(complaints))
                .categoryStatistics(categoryStatistics(complaints))
                .officerPerformanceStatistics(officerPerformanceStatistics(complaints))
                .userRegistrationTrends(userRegistrationTrends(citizens))
                .complaintStatusAnalytics(statusAnalytics(complaints))
                .build();
    }

    public DashboardAnalytics officerAnalytics() {
        Long officerId = AuthHelper.currentUser().getUserId();
        List<Complaint> complaints = complaintRepository.findByAssignedOfficer_Id(officerId);
        return DashboardAnalytics.builder()
                .stats(officerStats())
                .monthlyComplaintTrends(monthlyComplaintTrends(complaints))
                .weeklyComplaintTrends(weeklyComplaintTrends(complaints))
                .categoryStatistics(categoryStatistics(complaints))
                .complaintStatusAnalytics(statusAnalytics(complaints))
                .build();
    }

    public List<TrendPoint> monthlyComplaintTrends() {
        return monthlyComplaintTrends(complaintRepository.findAll());
    }

    public List<TrendPoint> categoryStatistics() {
        return categoryStatistics(complaintRepository.findAll());
    }

    public List<OfficerPerformancePoint> officerPerformanceStatistics() {
        return officerPerformanceStatistics(complaintRepository.findAll());
    }

    public List<TrendPoint> userRegistrationTrends() {
        return userRegistrationTrends(userRepository.findByRole_Name("CITIZEN"));
    }

    public List<TrendPoint> statusAnalytics() {
        return statusAnalytics(complaintRepository.findAll());
    }

    private List<TrendPoint> monthlyComplaintTrends(List<Complaint> complaints) {
        YearMonth current = YearMonth.now();
        List<TrendPoint> trends = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            long total = complaints.stream()
                    .filter(c -> c.getCreatedAt() != null)
                    .filter(c -> YearMonth.from(c.getCreatedAt()).equals(month))
                    .count();
            long resolved = complaints.stream()
                    .filter(c -> c.getCreatedAt() != null)
                    .filter(c -> YearMonth.from(c.getCreatedAt()).equals(month))
                    .filter(c -> "Resolved".equalsIgnoreCase(c.getStatus()))
                    .count();
            trends.add(TrendPoint.builder()
                    .label(month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .month(month.toString())
                    .total(total)
                    .resolved(resolved)
                    .build());
        }
        return trends;
    }

    private List<TrendPoint> weeklyComplaintTrends(List<Complaint> complaints) {
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(6);
        List<TrendPoint> trends = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate day = start.plusDays(i);
            long total = complaints.stream()
                    .filter(c -> c.getCreatedAt() != null)
                    .filter(c -> c.getCreatedAt().toLocalDate().equals(day))
                    .count();
            trends.add(TrendPoint.builder()
                    .label(day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .date(day.toString())
                    .total(total)
                    .build());
        }
        return trends;
    }

    private List<TrendPoint> categoryStatistics(List<Complaint> complaints) {
        return complaints.stream()
                .collect(Collectors.groupingBy(
                        c -> normalize(c.getCategory(), "General"),
                        Collectors.counting()))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> TrendPoint.builder()
                        .label(entry.getKey())
                        .total(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    private List<TrendPoint> statusAnalytics(List<Complaint> complaints) {
        return List.of("Pending", "In Progress", "Resolved", "Rejected")
                .stream()
                .map(status -> TrendPoint.builder()
                        .label(status)
                        .total(complaints.stream()
                                .filter(c -> status.equalsIgnoreCase(c.getStatus()))
                                .count())
                        .build())
                .collect(Collectors.toList());
    }

    private List<OfficerPerformancePoint> officerPerformanceStatistics(List<Complaint> complaints) {
        return complaints.stream()
                .filter(c -> c.getAssignedOfficer() != null)
                .collect(Collectors.groupingBy(Complaint::getAssignedOfficer))
                .entrySet()
                .stream()
                .map(entry -> {
                    List<Complaint> assigned = entry.getValue();
                    long resolved = assigned.stream()
                            .filter(c -> "Resolved".equalsIgnoreCase(c.getStatus()))
                            .count();
                    return OfficerPerformancePoint.builder()
                            .officerId(entry.getKey().getId())
                            .officerName(entry.getKey().getFullName())
                            .assigned(assigned.size())
                            .resolved(resolved)
                            .resolutionRate(assigned.isEmpty() ? 0 :
                                    (int) Math.round(resolved * 100.0 / assigned.size()))
                            .build();
                })
                .sorted(Comparator.comparing(OfficerPerformancePoint::getResolved).reversed())
                .collect(Collectors.toList());
    }

    private List<TrendPoint> userRegistrationTrends(List<User> users) {
        YearMonth current = YearMonth.now();
        List<TrendPoint> trends = new ArrayList<>();
        for (int i = 11; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            long total = users.stream()
                    .map(User::getJoinedAt)
                    .filter(Objects::nonNull)
                    .filter(date -> YearMonth.from(date).equals(month))
                    .count();
            trends.add(TrendPoint.builder()
                    .label(month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .month(month.toString())
                    .total(total)
                    .build());
        }
        return trends;
    }

    private String normalize(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private DashboardStats buildStats(long total, long pending, long inProgress, long resolved, long rejected,
                                      Integer citizens, Long officers) {
        int rate = total > 0 ? (int) Math.round((resolved * 100.0) / total) : 0;
        return DashboardStats.builder()
                .totalComplaints(total)
                .pending(pending)
                .inProgress(inProgress)
                .resolved(resolved)
                .rejected(rejected)
                .resolutionRate(rate)
                .totalCitizens(citizens)
                .totalOfficers(officers)
                .build();
    }

    @Data
    @Builder
    public static class DashboardStats {
        private long totalComplaints;
        private long pending;
        private long inProgress;
        private long resolved;
        private long rejected;
        private int resolutionRate;
        private Integer totalCitizens;
        private Long totalOfficers;
    }

    @Data
    @Builder
    public static class DashboardAnalytics {
        private DashboardStats stats;
        private List<TrendPoint> monthlyComplaintTrends;
        private List<TrendPoint> weeklyComplaintTrends;
        private List<TrendPoint> categoryStatistics;
        private List<OfficerPerformancePoint> officerPerformanceStatistics;
        private List<TrendPoint> userRegistrationTrends;
        private List<TrendPoint> complaintStatusAnalytics;
    }

    @Data
    @Builder
    public static class TrendPoint {
        private String label;
        private String month;
        private String date;
        private long total;
        private long resolved;
    }

    @Data
    @Builder
    public static class OfficerPerformancePoint {
        private Long officerId;
        private String officerName;
        private long assigned;
        private long resolved;
        private int resolutionRate;
    }
}
