package com.reportit.auth.controller;

import com.reportit.auth.dto.*;
import com.reportit.auth.service.AuthService;
import com.reportit.auth.service.CryptoService;
import com.reportit.auth.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final CryptoService cryptoService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        request.setPassword(cryptoService.decryptIfEncrypted(request.getPassword()));
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        request.setPassword(cryptoService.decryptIfEncrypted(request.getPassword()));
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/crypto/public-key")
    public ResponseEntity<Map<String, String>> publicKey() {
        return ResponseEntity.ok(Map.of(
                "algorithm", "RSA-OAEP-256",
                "publicKey", cryptoService.publicKey()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.refresh(body.get("refreshToken")));
    }

    @PostMapping("/otp/send")
    public ResponseEntity<Map<String, String>> sendOtp(@Valid @RequestBody OtpSendRequest request) {
        otpService.sendOtp(request.getEmail(), request.getPurpose());
        return ResponseEntity.ok(Map.of(
                "message", "OTP sent successfully to your registered email",
                "note", "The OTP expires in 1 minute."));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<Map<String, String>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getOtp(), request.getPurpose());
        return ResponseEntity.ok(Map.of("message", "OTP verified"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        request.setNewPassword(cryptoService.decryptIfEncrypted(request.getNewPassword()));
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }
}
