package com.reportit.usermgmt.otp;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.entity.OtpToken;
import com.reportit.usermgmt.repository.OtpTokenRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final SecureRandom random = new SecureRandom();

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
            String otp = String.format("%06d", random.nextInt(1_000_000));
            otpTokenRepository.save(OtpToken.builder()
                    .email(request.getEmail().trim().toLowerCase())
                    .otpCode(otp)
                    .purpose(request.getPurpose().toUpperCase())
                    .expiresAt(LocalDateTime.now().plusMinutes(10))
                    .used(false)
                    .build());
            return Map.of("message", "OTP sent (local fallback)", "otp", otp);
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
            OtpToken token = otpTokenRepository
                    .findTopByEmailIgnoreCaseAndPurposeAndUsedFalseOrderByCreatedAtDesc(
                            request.getEmail(), request.getPurpose().toUpperCase())
                    .orElseThrow(() -> new ApiException("OTP not found", HttpStatus.NOT_FOUND));
            if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
                throw new ApiException("OTP expired", HttpStatus.BAD_REQUEST);
            }
            if (!token.getOtpCode().equals(request.getOtp())) {
                throw new ApiException("Invalid OTP", HttpStatus.BAD_REQUEST);
            }
            token.setUsed(true);
            otpTokenRepository.save(token);
            return Map.of("message", "OTP verified (local fallback)");
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
