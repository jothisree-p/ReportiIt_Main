package com.reportit.auth.service;

import com.reportit.auth.entity.OtpToken;
import com.reportit.auth.exception.ApiException;
import com.reportit.auth.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final SecureRandom random = new SecureRandom();

    @Transactional
    public String sendOtp(String email, String purpose) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        OtpToken token = OtpToken.builder()
                .email(email.trim().toLowerCase())
                .otpCode(otp)
                .purpose(purpose.toUpperCase())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .used(false)
                .build();
        otpTokenRepository.save(token);
        // In production, send via email/SMS. For Postman testing, OTP is returned in response.
        return otp;
    }

    @Transactional
    public void verifyOtp(String email, String otp, String purpose) {
        OtpToken token = otpTokenRepository
                .findTopByEmailIgnoreCaseAndPurposeAndUsedFalseOrderByCreatedAtDesc(
                        email.trim().toLowerCase(), purpose.toUpperCase())
                .orElseThrow(() -> new ApiException("OTP not found", HttpStatus.NOT_FOUND));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException("OTP expired", HttpStatus.BAD_REQUEST);
        }
        if (!token.getOtpCode().equals(otp)) {
            throw new ApiException("Invalid OTP", HttpStatus.BAD_REQUEST);
        }
        token.setUsed(true);
        otpTokenRepository.save(token);
    }
}
