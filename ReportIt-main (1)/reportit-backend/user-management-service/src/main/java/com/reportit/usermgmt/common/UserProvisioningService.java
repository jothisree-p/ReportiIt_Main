package com.reportit.usermgmt.common;

import com.reportit.usermgmt.entity.Role;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.repository.RoleRepository;
import com.reportit.usermgmt.repository.UserRepository;
import com.reportit.usermgmt.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProvisioningService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User ensureCurrentUser() {
        UserPrincipal principal = AuthHelper.currentUser();

        return userRepository.findById(principal.getUserId())
                .or(() -> userRepository.findByEmailIgnoreCase(principal.getEmail()))
                .orElseGet(() -> createFromPrincipal(principal));
    }

    private User createFromPrincipal(UserPrincipal principal) {
        String roleName = principal.getRole() != null ? principal.getRole().toUpperCase() : "CITIZEN";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.findByName("CITIZEN")
                        .orElseThrow(() -> new ApiException("Role not found", HttpStatus.INTERNAL_SERVER_ERROR)));

        String email = principal.getEmail().trim().toLowerCase();
        String displayName = email.contains("@")
                ? email.substring(0, email.indexOf('@'))
                : email;

        return userRepository.save(User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                .fullName(displayName)
                .role(role)
                .status("Active")
                .build());
    }
}
