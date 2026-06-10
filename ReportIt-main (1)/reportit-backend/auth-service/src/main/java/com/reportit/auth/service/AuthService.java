package com.reportit.auth.service;

import com.reportit.auth.dto.*;
import com.reportit.auth.entity.Role;
import com.reportit.auth.entity.User;
import com.reportit.auth.exception.ApiException;
import com.reportit.auth.repository.RoleRepository;
import com.reportit.auth.repository.UserRepository;
import com.reportit.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT);
        }

        if (!otpService.hasActivePhoneVerification(request.getEmail(), request.getPhone())) {
            throw new ApiException("Please verify your phone number before creating the account", HttpStatus.BAD_REQUEST);
        }

        Role citizenRole = roleRepository.findByName("CITIZEN")
                .orElseThrow(() -> new ApiException("CITIZEN role not found", HttpStatus.INTERNAL_SERVER_ERROR));

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(citizenRole)
                .status("Active")
                .build();

        user = userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String expectedRole = request.getRole().trim().toUpperCase();
        if (!user.getRole().getName().equalsIgnoreCase(expectedRole)) {
            throw new ApiException("Role mismatch for this account", HttpStatus.FORBIDDEN);
        }

        if ("OFFICER".equalsIgnoreCase(expectedRole)
                && !user.getEmail().endsWith("@reportit.com")) {
            throw new ApiException("Officer email must end with @reportit.com", HttpStatus.FORBIDDEN);
        }

        if (!"Active".equalsIgnoreCase(user.getStatus())) {
            throw new ApiException("Account is not active", HttpStatus.FORBIDDEN);
        }

        return buildAuthResponse(user);
    }

    public AuthResponse refresh(String refreshToken) {
        try {
            var claims = jwtUtil.parseClaims(refreshToken);
            if (!"refresh".equals(claims.get("type"))) {
                throw new ApiException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
            }
            Long userId = claims.get("userId", Long.class);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED));
            return buildAuthResponse(user);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
        }
    }

    @Transactional
    public void resetPassword(ForgotPasswordRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getOtp(), "FORGOT_PASSWORD");
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String role = user.getRole().getName();
        return AuthResponse.builder()
                .accessToken(jwtUtil.generateAccessToken(user.getId(), user.getEmail(), role))
                .refreshToken(jwtUtil.generateRefreshToken(user.getId(), user.getEmail(), role))
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(role)
                .build();
    }
}
