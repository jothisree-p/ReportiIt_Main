package com.reportit.usermgmt.profile;

import com.reportit.usermgmt.profile.ProfileService.ProfileRequest;
import com.reportit.usermgmt.profile.ProfileService.ProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ProfileResponse> create(@RequestBody ProfileRequest request) {
        return ResponseEntity.ok(profileService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<ProfileResponse>> getAll() {
        return ResponseEntity.ok(profileService.getAll());
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMe() {
        return ResponseEntity.ok(profileService.getMe());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getById(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.getByUserId(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ProfileResponse> update(@PathVariable Long userId, @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(profileService.update(userId, request));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> delete(@PathVariable Long userId) {
        profileService.delete(userId);
        return ResponseEntity.noContent().build();
    }
}
