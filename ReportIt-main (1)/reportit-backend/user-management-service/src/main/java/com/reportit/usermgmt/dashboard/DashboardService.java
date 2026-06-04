package com.reportit.usermgmt.dashboard;

import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.repository.ComplaintRepository;
import com.reportit.usermgmt.repository.OfficerRepository;
import com.reportit.usermgmt.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
                officerRepository.count());
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
}
