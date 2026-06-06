package com.reportit.usermgmt.officer;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.entity.Officer;
import com.reportit.usermgmt.entity.Role;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.repository.OfficerRepository;
import com.reportit.usermgmt.repository.RoleRepository;
import com.reportit.usermgmt.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfficerService {

    private final OfficerRepository officerRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public OfficerResponse create(OfficerRequest request) {
        if (!request.getEmail().endsWith("@reportit.com")) {
            throw new ApiException("Officer email must end with @reportit.com", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new ApiException("Email already exists", HttpStatus.CONFLICT);
        }
        Role officerRole = roleRepository.findByName("OFFICER")
                .orElseThrow(() -> new ApiException("OFFICER role not found", HttpStatus.INTERNAL_SERVER_ERROR));

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getName())
                .phone(request.getPhone())
                .role(officerRole)
                .status(request.getStatus() != null ? request.getStatus() : "Active")
                .build();
        user = userRepository.save(user);

        Officer officer = Officer.builder()
                .user(user)
                .badge(request.getBadge())
                .position(request.getPosition())
                .zone(request.getZone())
                .initials(request.getInitials())
                .activeCases(request.getActiveCases())
                .age(request.getAge())
                .gender(request.getGender())
                .station(request.getStation())
                .department(request.getDepartment())
                .experience(request.getExperience())
                .shift(request.getShift())
                .address(request.getAddress())
                .mapQuery(request.getMapQuery())
                .emergency(request.getEmergency())
                .joinedDate(request.getJoinedDate())
                .build();
        return toResponse(officerRepository.save(officer));
    }

    public List<OfficerResponse> findAll() {
        return officerRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OfficerResponse findById(Long userId) {
        return toResponse(getOfficer(userId));
    }

    @Transactional
    public OfficerResponse update(Long userId, OfficerRequest request) {
        Officer officer = getOfficer(userId);
        User user = officer.getUser();
        if (request.getName() != null) user.setFullName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getStatus() != null) user.setStatus(request.getStatus());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getBadge() != null) officer.setBadge(request.getBadge());
        if (request.getPosition() != null) officer.setPosition(request.getPosition());
        if (request.getZone() != null) officer.setZone(request.getZone());
        if (request.getInitials() != null) officer.setInitials(request.getInitials());
        if (request.getActiveCases() != null) officer.setActiveCases(request.getActiveCases());
        if (request.getAge() != null) officer.setAge(request.getAge());
        if (request.getGender() != null) officer.setGender(request.getGender());
        if (request.getStation() != null) officer.setStation(request.getStation());
        if (request.getDepartment() != null) officer.setDepartment(request.getDepartment());
        if (request.getExperience() != null) officer.setExperience(request.getExperience());
        if (request.getShift() != null) officer.setShift(request.getShift());
        if (request.getAddress() != null) officer.setAddress(request.getAddress());
        if (request.getMapQuery() != null) officer.setMapQuery(request.getMapQuery());
        if (request.getEmergency() != null) officer.setEmergency(request.getEmergency());
        if (request.getJoinedDate() != null) officer.setJoinedDate(request.getJoinedDate());
        userRepository.save(user);
        return toResponse(officerRepository.save(officer));
    }

    @Transactional
    public void delete(Long userId) {
        deactivate(userId);
    }

    @Transactional
    public OfficerResponse deactivate(Long userId) {
        Officer officer = getOfficer(userId);
        User user = officer.getUser();
        user.setStatus("Inactive");
        officer.setActiveCases("Inactive");
        userRepository.save(user);
        return toResponse(officerRepository.save(officer));
    }

    private Officer getOfficer(Long userId) {
        return officerRepository.findById(userId)
                .orElseThrow(() -> new ApiException("Officer not found", HttpStatus.NOT_FOUND));
    }

    private OfficerResponse toResponse(Officer officer) {
        User user = officer.getUser();
        return OfficerResponse.builder()
                .userId(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .badge(officer.getBadge())
                .position(officer.getPosition())
                .zone(officer.getZone())
                .initials(officer.getInitials())
                .activeCases(officer.getActiveCases())
                .age(officer.getAge())
                .gender(officer.getGender())
                .station(officer.getStation())
                .department(officer.getDepartment())
                .experience(officer.getExperience())
                .shift(officer.getShift())
                .address(officer.getAddress())
                .mapQuery(officer.getMapQuery())
                .emergency(officer.getEmergency())
                .joinedDate(officer.getJoinedDate())
                .build();
    }

    @Data
    public static class OfficerRequest {
        private String name;
        private String email;
        private String phone;
        private String password;
        private String badge;
        private String position;
        private String zone;
        private String initials;
        private String activeCases;
        private String status;
        private String age;
        private String gender;
        private String station;
        private String department;
        private String experience;
        private String shift;
        private String address;
        private String mapQuery;
        private String emergency;
        private String joinedDate;
    }

    @Data
    @Builder
    public static class OfficerResponse {
        private Long userId;
        private String name;
        private String email;
        private String phone;
        private String status;
        private String badge;
        private String position;
        private String zone;
        private String initials;
        private String activeCases;
        private String age;
        private String gender;
        private String station;
        private String department;
        private String experience;
        private String shift;
        private String address;
        private String mapQuery;
        private String emergency;
        private String joinedDate;
    }
}
