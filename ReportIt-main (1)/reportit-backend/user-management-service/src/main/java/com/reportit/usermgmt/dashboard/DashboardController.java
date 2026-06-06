package com.reportit.usermgmt.dashboard;

import com.reportit.usermgmt.dashboard.DashboardService.DashboardStats;
import com.reportit.usermgmt.dashboard.DashboardService.DashboardAnalytics;
import com.reportit.usermgmt.dashboard.DashboardService.OfficerPerformancePoint;
import com.reportit.usermgmt.dashboard.DashboardService.TrendPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin/stats")
    public ResponseEntity<DashboardStats> adminStats() {
        return ResponseEntity.ok(dashboardService.adminStats());
    }

    @GetMapping("/officer/stats")
    public ResponseEntity<DashboardStats> officerStats() {
        return ResponseEntity.ok(dashboardService.officerStats());
    }

    @GetMapping("/citizen/stats")
    public ResponseEntity<DashboardStats> citizenStats() {
        return ResponseEntity.ok(dashboardService.citizenStats());
    }

    @GetMapping("/admin/analytics")
    public ResponseEntity<DashboardAnalytics> adminAnalytics() {
        return ResponseEntity.ok(dashboardService.adminAnalytics());
    }

    @GetMapping("/officer/analytics")
    public ResponseEntity<DashboardAnalytics> officerAnalytics() {
        return ResponseEntity.ok(dashboardService.officerAnalytics());
    }

    @GetMapping("/admin/monthly-complaint-trends")
    public ResponseEntity<List<TrendPoint>> monthlyComplaintTrends() {
        return ResponseEntity.ok(dashboardService.monthlyComplaintTrends());
    }

    @GetMapping("/admin/category-statistics")
    public ResponseEntity<List<TrendPoint>> categoryStatistics() {
        return ResponseEntity.ok(dashboardService.categoryStatistics());
    }

    @GetMapping("/admin/officer-performance")
    public ResponseEntity<List<OfficerPerformancePoint>> officerPerformanceStatistics() {
        return ResponseEntity.ok(dashboardService.officerPerformanceStatistics());
    }

    @GetMapping("/admin/user-registration-trends")
    public ResponseEntity<List<TrendPoint>> userRegistrationTrends() {
        return ResponseEntity.ok(dashboardService.userRegistrationTrends());
    }

    @GetMapping("/admin/status-analytics")
    public ResponseEntity<List<TrendPoint>> statusAnalytics() {
        return ResponseEntity.ok(dashboardService.statusAnalytics());
    }
}
