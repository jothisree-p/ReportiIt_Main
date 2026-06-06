package com.reportit.auth.service;

import com.reportit.auth.entity.OtpToken;
import com.reportit.auth.exception.ApiException;
import com.reportit.auth.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final Optional<JavaMailSender> mailSender;
    private final SecureRandom random = new SecureRandom();

    @Value("${reportit.mail.from:}")
    private String mailFrom;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Transactional
    public String sendOtp(String email, String purpose) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        String normalizedEmail = email.trim().toLowerCase();
        OtpToken token = OtpToken.builder()
                .email(normalizedEmail)
                .otpCode(otp)
                .purpose(purpose.toUpperCase())
                .expiresAt(LocalDateTime.now().plusMinutes(1))
                .used(false)
                .build();
        sendOtpEmail(normalizedEmail, otp);
        otpTokenRepository.save(token);
        return otp;
    }

    private void sendOtpEmail(String email, String otp) {
        JavaMailSender sender = mailSender
                .orElseThrow(() -> new ApiException("ReportIt mail sender is not configured", HttpStatus.SERVICE_UNAVAILABLE));
        if (mailUsername == null || mailUsername.isBlank()) {
            throw new ApiException("REPORTIT_MAIL_USERNAME is not configured", HttpStatus.SERVICE_UNAVAILABLE);
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom == null || mailFrom.isBlank() ? mailUsername : mailFrom);
        message.setTo(email);
        message.setSubject("ReportIt Forgot Password OTP");
        message.setText("Hello,\n\n"
                + "Your ReportIt forgot password OTP is: " + otp + "\n\n"
                + "This OTP expires in 1 minute. Do not share this code with anyone.\n\n"
                + "Regards,\n"
                + "ReportIt Security Team");
        try {
            sender.send(message);
        } catch (Exception ex) {
            throw new ApiException("Unable to send OTP email. Check ReportIt SMTP username/password.", HttpStatus.SERVICE_UNAVAILABLE);
        }
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
