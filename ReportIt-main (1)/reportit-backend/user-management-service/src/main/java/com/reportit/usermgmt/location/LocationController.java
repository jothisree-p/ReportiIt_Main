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
    public ResponseEntity<ReverseGeocodeResponse> reverseGeocode(@RequestBody Map<String, Object> body) {
        BigDecimal latitude = toBigDecimal(body.get("latitude"));
        BigDecimal longitude = toBigDecimal(body.get("longitude"));
        return ResponseEntity.ok(locationService.reverseGeocode(latitude, longitude));
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

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof BigDecimal decimal) {
            return decimal;
        }
        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? null : new BigDecimal(text);
    }
}
