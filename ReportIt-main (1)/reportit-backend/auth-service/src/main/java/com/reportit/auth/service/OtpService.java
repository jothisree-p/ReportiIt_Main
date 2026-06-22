package com.reportit.auth.service;

import com.reportit.auth.entity.OtpToken;
import com.reportit.auth.exception.ApiException;
import com.reportit.auth.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private final OtpTokenRepository otpTokenRepository;
    private final Optional<JavaMailSender> mailSender;
    private final SecureRandom random = new SecureRandom();

    @Value("${reportit.mail.from:}")
    private String mailFrom;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Transactional
    public String sendOtp(String email, String purpose) {
        String normalizedEmail = email.trim().toLowerCase();
        String normalizedPurpose = purpose.trim().toUpperCase();
        String otp = generateNumericCode();
        OtpToken token = buildToken(normalizedEmail, normalizedPurpose, otp, 1);
        sendOtpEmail(normalizedEmail, otp, normalizedPurpose);
        otpTokenRepository.save(token);
        return otp;
    }

    @Transactional
    public Map<String, String> sendSignupVerification(String email, String phone) {
        String normalizedEmail = email.trim().toLowerCase();
        String normalizedPhone = phone == null ? "" : phone.trim();
        String phoneCode = generateNumericCode();

        OtpToken phoneVerification = buildToken(normalizedEmail, phoneVerificationPurpose(normalizedPhone), phoneCode, 10);
        sendSignupPhoneVerificationEmail(normalizedEmail, normalizedPhone, phoneCode);
        otpTokenRepository.save(phoneVerification);

        return Map.of(
                "message", "Phone verification code sent to your registered email.",
                "expiresInMinutes", "10");
    }

    public boolean hasActiveVerification(String email, String purpose) {
        return otpTokenRepository
                .findTopByEmailIgnoreCaseAndPurposeAndUsedTrueAndExpiresAtAfterOrderByCreatedAtDesc(
                        email.trim().toLowerCase(), purpose.trim().toUpperCase(), LocalDateTime.now())
                .isPresent();
    }

    public boolean hasActivePhoneVerification(String email, String phone) {
        return hasActiveVerification(email, phoneVerificationPurpose(phone));
    }

    public String phoneVerificationPurpose(String phone) {
        String normalizedPhone = phone == null ? "" : phone.replaceAll("[^0-9+]", "");
        return "CITIZEN_PHONE_VERIFY:" + normalizedPhone;
    }

    private String generateNumericCode() {
        return String.format("%06d", random.nextInt(1_000_000));
    }

    private OtpToken buildToken(String email, String purpose, String code, int expiresInMinutes) {
        return OtpToken.builder()
                .email(email)
                .otpCode(code)
                .purpose(purpose)
                .expiresAt(LocalDateTime.now().plusMinutes(expiresInMinutes))
                .used(false)
                .build();
    }

    private void sendOtpEmail(String email, String otp, String purpose) {
        JavaMailSender sender = mailSender
                .orElseThrow(() -> new ApiException("ReportIt mail sender is not configured", HttpStatus.SERVICE_UNAVAILABLE));
        if (mailUsername == null || mailUsername.isBlank()) {
            throw new ApiException("REPORTIT_MAIL_USERNAME is not configured", HttpStatus.SERVICE_UNAVAILABLE);
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom == null || mailFrom.isBlank() ? mailUsername : mailFrom);
        message.setTo(email);
        message.setSubject(subjectForPurpose(purpose));
        message.setText(bodyForPurpose(purpose, otp));
        try {
            sender.send(message);
        } catch (Exception ex) {
            log.error("ReportIt OTP email failed. SMTP user={}, from={}, to={}, error={}",
                    mailUsername, message.getFrom(), email, ex.getMessage(), ex);
            throw new ApiException("Unable to send OTP email. SMTP error: " + cleanMailError(ex), HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private void sendSignupPhoneVerificationEmail(String email, String phone, String phoneCode) {
        JavaMailSender sender = mailSender
                .orElseThrow(() -> new ApiException("ReportIt mail sender is not configured", HttpStatus.SERVICE_UNAVAILABLE));
        if (mailUsername == null || mailUsername.isBlank()) {
            throw new ApiException("REPORTIT_MAIL_USERNAME is not configured", HttpStatus.SERVICE_UNAVAILABLE);
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom == null || mailFrom.isBlank() ? mailUsername : mailFrom);
        message.setTo(email);
        message.setSubject("ReportIt Phone Verification Code");
        message.setText("Hello,\n\n"
                + "Phone number to verify: " + (phone.isBlank() ? "Not provided" : phone) + "\n"
                + "Your ReportIt phone verification code is: " + phoneCode + "\n\n"
                + "This code expires in 10 minutes. Enter it on the ReportIt signup page before creating your account.\n\n"
                + "Regards,\n"
                + "ReportIt Security Team");
        try {
            sender.send(message);
        } catch (Exception ex) {
            log.error("ReportIt phone verification email failed. SMTP user={}, from={}, to={}, error={}",
                    mailUsername, message.getFrom(), email, ex.getMessage(), ex);
            throw new ApiException("Unable to send phone verification email. SMTP error: " + cleanMailError(ex), HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    private String cleanMailError(Exception ex) {
        String message = ex.getMessage();
        if (message == null || message.isBlank()) {
            return "Gmail rejected the SMTP request. Check the app password and restart auth-service.";
        }
        return message.replaceAll("[\\r\\n]+", " ").trim();
    }

    private String subjectForPurpose(String purpose) {
        return switch (purpose) {
            case "CITIZEN_PHONE_VERIFY" -> "ReportIt Phone Verification Code";
            default -> "ReportIt Forgot Password OTP";
        };
    }

    private String bodyForPurpose(String purpose, String otp) {
        String label = switch (purpose) {
            case "CITIZEN_PHONE_VERIFY" -> "phone verification code";
            default -> "forgot password OTP";
        };
        return "Hello,\n\n"
                + "Your ReportIt " + label + " is: " + otp + "\n\n"
                + "This code expires in 1 minute. Do not share this code with anyone.\n\n"
                + "Regards,\n"
                + "ReportIt Security Team";
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
