package com.reportit.usermgmt.officer;

import com.reportit.usermgmt.officer.OfficerService.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officers")
@RequiredArgsConstructor
public class OfficerController {

    private final OfficerService officerService;

    @PostMapping
    public ResponseEntity<OfficerResponse> create(@RequestBody OfficerRequest request) {
        return ResponseEntity.ok(officerService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<OfficerResponse>> getAll() {
        return ResponseEntity.ok(officerService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfficerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(officerService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfficerResponse> update(@PathVariable Long id, @RequestBody OfficerRequest request) {
        return ResponseEntity.ok(officerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        officerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
