package com.reportit.usermgmt.otp;

import com.reportit.usermgmt.common.ApiException;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OtpService {

    @Value("${auth.service-url}")
    private String authServiceUrl;

    @Transactional
    public Map<String, String> sendOtp(OtpRequest request) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.postForObject(
                    authServiceUrl + "/api/auth/otp/send",
                    Map.of("email", request.getEmail(), "purpose", request.getPurpose()),
                    Map.class);
        } catch (Exception e) {
            throw new ApiException("Unable to send OTP through auth-service. Check auth-service and ReportIt SMTP settings.", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @Transactional
    public Map<String, String> verifyOtp(OtpVerifyRequest request) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.postForObject(
                    authServiceUrl + "/api/auth/otp/verify",
                    Map.of("email", request.getEmail(), "otp", request.getOtp(), "purpose", request.getPurpose()),
                    Map.class);
        } catch (Exception e) {
            throw new ApiException("Unable to verify OTP through auth-service.", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @Data
    public static class OtpRequest {
        private String email;
        private String purpose;
    }

    @Data
    public static class OtpVerifyRequest {
        private String email;
        private String otp;
        private String purpose;
    }
}
