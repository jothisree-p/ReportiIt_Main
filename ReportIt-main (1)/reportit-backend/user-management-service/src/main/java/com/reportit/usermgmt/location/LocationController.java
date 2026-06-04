package com.reportit.usermgmt.location;

import com.reportit.usermgmt.location.LocationService.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping("/reverse-geocode")
    public ResponseEntity<ReverseGeocodeResponse> reverseGeocode(@RequestBody Map<String, BigDecimal> body) {
        return ResponseEntity.ok(locationService.reverseGeocode(body.get("latitude"), body.get("longitude")));
    }

    @GetMapping("/complaints/{complaintId}")
    public ResponseEntity<LocationResponse> get(@PathVariable Long complaintId) {
        return ResponseEntity.ok(locationService.getComplaintLocation(complaintId));
    }

    @PutMapping("/complaints/{complaintId}")
    public ResponseEntity<LocationResponse> update(
            @PathVariable Long complaintId,
            @RequestBody LocationUpdateRequest request) {
        return ResponseEntity.ok(locationService.updateComplaintLocation(complaintId, request));
    }
}
