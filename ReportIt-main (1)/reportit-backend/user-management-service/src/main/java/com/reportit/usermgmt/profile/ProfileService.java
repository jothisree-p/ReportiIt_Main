package com.reportit.usermgmt.profile;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.entity.UserProfile;
import com.reportit.usermgmt.repository.UserProfileRepository;
import com.reportit.usermgmt.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProfileResponse create(ProfileRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        if (profileRepository.existsById(user.getId())) {
            throw new ApiException("Profile already exists", HttpStatus.CONFLICT);
        }
        UserProfile profile = UserProfile.builder()
                .user(user)
                .avatarUrl(request.getAvatarUrl())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .build();
        return toResponse(profileRepository.save(profile));
    }

    public ProfileResponse getByUserId(Long userId) {
        return profileRepository.findById(userId)
                .map(this::toResponse)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));
    }

    public ProfileResponse getMe() {
        return getByUserId(AuthHelper.currentUser().getUserId());
    }

    public List<ProfileResponse> getAll() {
        return profileRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProfileResponse update(Long userId, ProfileRequest request) {
        UserProfile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));
        profile.setAvatarUrl(request.getAvatarUrl());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setPincode(request.getPincode());
        return toResponse(profileRepository.save(profile));
    }

    @Transactional
    public void delete(Long userId) {
        if (!profileRepository.existsById(userId)) {
            throw new ApiException("Profile not found", HttpStatus.NOT_FOUND);
        }
        profileRepository.deleteById(userId);
    }

    private ProfileResponse toResponse(UserProfile profile) {
        User user = profile.getUser();
        return ProfileResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(profile.getAvatarUrl())
                .address(profile.getAddress())
                .city(profile.getCity())
                .state(profile.getState())
                .pincode(profile.getPincode())
                .build();
    }

    @Data
    public static class ProfileRequest {
        private Long userId;
        private String avatarUrl;
        private String address;
        private String city;
        private String state;
        private String pincode;
    }

    @lombok.Data
    @lombok.Builder
    public static class ProfileResponse {
        private Long userId;
        private String email;
        private String fullName;
        private String phone;
        private String avatarUrl;
        private String address;
        private String city;
        private String state;
        private String pincode;
    }
}
