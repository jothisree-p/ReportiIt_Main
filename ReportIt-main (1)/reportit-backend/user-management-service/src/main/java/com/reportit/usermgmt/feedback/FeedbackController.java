package com.reportit.usermgmt.feedback;

import com.reportit.usermgmt.feedback.FeedbackService.FeedbackRequest;
import com.reportit.usermgmt.feedback.FeedbackService.FeedbackResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/complaints/{complaintId}")
    public ResponseEntity<FeedbackResponse> saveForComplaint(
            @PathVariable Long complaintId,
            @RequestBody FeedbackRequest request
    ) {
        return ResponseEntity.ok(feedbackService.saveForComplaint(complaintId, request));
    }

    @GetMapping("/complaints/{complaintId}")
    public ResponseEntity<FeedbackResponse> findForComplaint(@PathVariable Long complaintId) {
        return ResponseEntity.ok(feedbackService.findForComplaint(complaintId));
    }

    @GetMapping("/officer/me")
    public ResponseEntity<List<FeedbackResponse>> findMineForOfficer() {
        return ResponseEntity.ok(feedbackService.findMineForOfficer());
    }

    @GetMapping("/admin")
    public ResponseEntity<List<FeedbackResponse>> findAllForAdmin() {
        return ResponseEntity.ok(feedbackService.findAllForAdmin());
    }
}
