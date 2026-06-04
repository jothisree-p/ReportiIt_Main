package com.reportit.usermgmt.status;

import com.reportit.usermgmt.status.StatusService.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/status")
@RequiredArgsConstructor
public class StatusController {

    private final StatusService statusService;

    @PostMapping("/complaints/{complaintId}")
    public ResponseEntity<StatusHistoryResponse> addStatus(
            @PathVariable Long complaintId,
            @RequestBody StatusRequest request) {
        return ResponseEntity.ok(statusService.addStatus(complaintId, request));
    }

    @GetMapping("/complaints/{complaintId}/history")
    public ResponseEntity<List<StatusHistoryResponse>> getHistory(@PathVariable Long complaintId) {
        return ResponseEntity.ok(statusService.getHistory(complaintId));
    }

    @GetMapping("/track/{complaintCode}")
    public ResponseEntity<TrackResponse> track(@PathVariable String complaintCode) {
        return ResponseEntity.ok(statusService.trackByCode(complaintCode));
    }
}
