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
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .age(request.getAge())
                .gender(request.getGender())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .mapQuery(request.getMapQuery())
                .department(request.getDepartment())
                .displayId(request.getDisplayId())
                .build();
        return toResponse(profileRepository.save(profile));
    }

    public ProfileResponse getByUserId(Long userId) {
        return profileRepository.findById(userId)
                .map(this::toResponse)
                .orElseThrow(() -> new ApiException("Profile not found", HttpStatus.NOT_FOUND));
    }

    public ProfileResponse getMe() {
        Long userId = AuthHelper.currentUser().getUserId();
        return profileRepository.findById(userId)
                .map(this::toResponse)
                .orElseGet(() -> createDefaultProfile(userId));
    }

    public List<ProfileResponse> getAll() {
        return profileRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProfileResponse update(Long userId, ProfileRequest request) {
        UserProfile profile = profileRepository.findById(userId)
                .orElseGet(() -> buildDefaultProfile(userId));
        apply(profile, request);
        return toResponse(profileRepository.save(profile));
    }

    @Transactional
    public ProfileResponse updateMe(ProfileRequest request) {
        return update(AuthHelper.currentUser().getUserId(), request);
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
                .addressLine1(profile.getAddressLine1())
                .addressLine2(profile.getAddressLine2())
                .age(profile.getAge())
                .gender(profile.getGender())
                .city(profile.getCity())
                .state(profile.getState())
                .pincode(profile.getPincode())
                .mapQuery(profile.getMapQuery())
                .department(profile.getDepartment())
                .displayId(profile.getDisplayId())
                .build();
    }

    private void apply(UserProfile profile, ProfileRequest request) {
        if (request.getPhone() != null) {
            profile.getUser().setPhone(request.getPhone());
            userRepository.save(profile.getUser());
        }
        profile.setAvatarUrl(request.getAvatarUrl());
        profile.setAddress(request.getAddress());
        profile.setAddressLine1(request.getAddressLine1());
        profile.setAddressLine2(request.getAddressLine2());
        profile.setAge(request.getAge());
        profile.setGender(request.getGender());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setPincode(request.getPincode());
        profile.setMapQuery(request.getMapQuery());
        profile.setDepartment(request.getDepartment());
        profile.setDisplayId(request.getDisplayId());
    }

    private ProfileResponse createDefaultProfile(Long userId) {
        return toResponse(profileRepository.save(buildDefaultProfile(userId)));
    }

    private UserProfile buildDefaultProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return UserProfile.builder()
                .user(user)
                .build();
    }

    @Data
    public static class ProfileRequest {
        private Long userId;
        private String phone;
        private String avatarUrl;
        private String address;
        private String addressLine1;
        private String addressLine2;
        private String age;
        private String gender;
        private String city;
        private String state;
        private String pincode;
        private String mapQuery;
        private String department;
        private String displayId;
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
        private String addressLine1;
        private String addressLine2;
        private String age;
        private String gender;
        private String city;
        private String state;
        private String pincode;
        private String mapQuery;
        private String department;
        private String displayId;
    }
}
