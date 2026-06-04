package com.reportit.usermgmt.config;

import com.reportit.usermgmt.entity.Officer;
import com.reportit.usermgmt.entity.Permission;
import com.reportit.usermgmt.entity.Role;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.repository.OfficerRepository;
import com.reportit.usermgmt.repository.PermissionRepository;
import com.reportit.usermgmt.repository.RoleRepository;
import com.reportit.usermgmt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final OfficerRepository officerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List.of("CITIZEN", "OFFICER", "ADMIN").forEach(this::ensureRole);
        seedAdminIfMissing();
        seedDemoOfficerIfMissing();
        List.of(
                "COMPLAINT_CREATE", "COMPLAINT_READ", "COMPLAINT_UPDATE", "COMPLAINT_DELETE",
                "USER_MANAGE", "OFFICER_MANAGE"
        ).forEach(code -> permissionRepository.findByCode(code)
                .orElseGet(() -> permissionRepository.save(Permission.builder()
                        .code(code)
                        .description(code)
                        .build())));
    }

    private void ensureRole(String name) {
        roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(Role.builder().name(name).build()));
    }

    private void seedAdminIfMissing() {
        if (userRepository.findByEmailIgnoreCase("admin@reportit.com").isPresent()) {
            return;
        }
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ADMIN role missing"));
        userRepository.save(User.builder()
                .email("admin@reportit.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .fullName("System Admin")
                .role(adminRole)
                .status("Active")
                .build());
    }

    private void seedDemoOfficerIfMissing() {
        if (userRepository.findByEmailIgnoreCase("officer@reportit.com").isPresent()) {
            return;
        }
        Role officerRole = roleRepository.findByName("OFFICER")
                .orElseThrow(() -> new IllegalStateException("OFFICER role missing"));
        User user = userRepository.save(User.builder()
                .email("officer@reportit.com")
                .passwordHash(passwordEncoder.encode("officer123"))
                .fullName("Demo Officer")
                .role(officerRole)
                .status("Active")
                .build());
        officerRepository.save(Officer.builder()
                .user(user)
                .badge("DEMO-001")
                .position("Inspector")
                .zone("Zone A")
                .initials("DO")
                .activeCases("0")
                .build());
    }
}
