package com.reportit.auth.config;

import com.reportit.auth.entity.Role;
import com.reportit.auth.entity.User;
import com.reportit.auth.repository.RoleRepository;
import com.reportit.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        ensureRole("CITIZEN");
        ensureRole("OFFICER");
        Role adminRole = ensureRole("ADMIN");
        ensureDefaultAdmin(adminRole);
    }

    private Role ensureRole(String name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(Role.builder().name(name).build()));
    }

    private void ensureDefaultAdmin(Role adminRole) {
        String adminEmail = "admin@reportit.com";
        userRepository.findByEmailIgnoreCase(adminEmail)
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(adminEmail)
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .fullName("System Admin")
                        .phone("6369574855")
                        .role(adminRole)
                        .status("Active")
                        .build()));
    }
}
