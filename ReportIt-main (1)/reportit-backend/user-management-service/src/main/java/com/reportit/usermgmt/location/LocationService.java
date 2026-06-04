package com.reportit.usermgmt.location;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.entity.Complaint;
import com.reportit.usermgmt.repository.ComplaintRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final ComplaintRepository complaintRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public ReverseGeocodeResponse reverseGeocode(BigDecimal lat, BigDecimal lon) {
        String url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon;
        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        String displayName = response != null ? (String) response.get("display_name") : null;
        return ReverseGeocodeResponse.builder()
                .latitude(lat)
                .longitude(lon)
                .displayName(displayName)
                .build();
    }

    public LocationResponse getComplaintLocation(Long complaintId) {
        Complaint complaint = getComplaint(complaintId);
        return toLocationResponse(complaint);
    }

    @Transactional
    public LocationResponse updateComplaintLocation(Long complaintId, LocationUpdateRequest request) {
        Complaint complaint = getComplaint(complaintId);
        complaint.setLocationText(request.getLocationText());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        return toLocationResponse(complaintRepository.save(complaint));
    }

    private Complaint getComplaint(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ApiException("Complaint not found", HttpStatus.NOT_FOUND));
    }

    private LocationResponse toLocationResponse(Complaint c) {
        return LocationResponse.builder()
                .complaintId(c.getId())
                .complaintCode(c.getComplaintCode())
                .locationText(c.getLocationText())
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .build();
    }

    @Data
    public static class LocationUpdateRequest {
        private String locationText;
        private BigDecimal latitude;
        private BigDecimal longitude;
    }

    @Data
    @Builder
    public static class LocationResponse {
        private Long complaintId;
        private String complaintCode;
        private String locationText;
        private BigDecimal latitude;
        private BigDecimal longitude;
    }

    @Data
    @Builder
    public static class ReverseGeocodeResponse {
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String displayName;
    }
}
