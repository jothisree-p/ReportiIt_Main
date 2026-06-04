package com.reportit.usermgmt.complaint;

import com.reportit.usermgmt.complaint.ComplaintService.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> create(@RequestBody ComplaintRequest request) {
        return ResponseEntity.ok(complaintService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAll() {
        return ResponseEntity.ok(complaintService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.findById(id));
    }

    @GetMapping("/citizen/me")
    public ResponseEntity<List<ComplaintResponse>> myComplaints() {
        return ResponseEntity.ok(complaintService.findMyComplaints());
    }

    @GetMapping("/officer/assigned")
    public ResponseEntity<List<ComplaintResponse>> assignedToMe() {
        return ResponseEntity.ok(complaintService.findAssignedToMe());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ComplaintResponse> update(@PathVariable Long id, @RequestBody ComplaintUpdateRequest request) {
        return ResponseEntity.ok(complaintService.update(id, request));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<ComplaintResponse> assign(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(complaintService.assignOfficer(id, body.get("officerUserId")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        complaintService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
