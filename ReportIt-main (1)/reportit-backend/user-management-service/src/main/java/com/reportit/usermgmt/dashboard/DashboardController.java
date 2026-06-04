package com.reportit.usermgmt.dashboard;

import com.reportit.usermgmt.dashboard.DashboardService.DashboardStats;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
