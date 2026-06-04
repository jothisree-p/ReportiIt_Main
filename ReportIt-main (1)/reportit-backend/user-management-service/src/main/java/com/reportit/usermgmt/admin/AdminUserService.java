package com.reportit.usermgmt.admin;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.entity.Role;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.repository.RoleRepository;
import com.reportit.usermgmt.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new ApiException("Email already exists", HttpStatus.CONFLICT);
        }
        Role role = roleRepository.findByName("CITIZEN")
                .orElseThrow(() -> new ApiException("CITIZEN role not found", HttpStatus.INTERNAL_SERVER_ERROR));
        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(role)
                .status(request.getStatus() != null ? request.getStatus() : "Active")
                .joinedAt(LocalDate.now())
                .build();
        return toResponse(userRepository.save(user));
    }

    public List<UserResponse> findAllCitizens() {
        return userRepository.findByRole_Name("CITIZEN").stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public UserResponse findById(Long id) {
        return toResponse(getUser(id));
    }

    @Transactional
    public UserResponse update(Long id, UserRequest request) {
        User user = getUser(id);
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getStatus() != null) user.setStatus(request.getStatus());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateStatus(Long id, String status) {
        User user = getUser(id);
        user.setStatus(status);
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = getUser(id);
        if (!"CITIZEN".equalsIgnoreCase(user.getRole().getName())) {
            throw new ApiException("Can only delete citizen users", HttpStatus.BAD_REQUEST);
        }
        userRepository.delete(user);
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .joinedAt(user.getJoinedAt())
                .role(user.getRole().getName())
                .build();
    }

    @Data
    public static class UserRequest {
        private String fullName;
        private String email;
        private String phone;
        private String password;
        private String status;
    }

    @Data
    @Builder
    public static class UserResponse {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String status;
        private LocalDate joinedAt;
        private String role;
    }
}
