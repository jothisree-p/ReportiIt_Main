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
        ensureRole("ADMIN");

        seedUserIfMissing("admin@reportit.com", "admin123", "ADMIN", "System Admin");
        seedUserIfMissing("officer@reportit.com", "officer123", "OFFICER", "Demo Officer");
    }

    private void seedUserIfMissing(String email, String password, String roleName, String fullName) {
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            return;
        }
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException(roleName + " role missing"));
        userRepository.save(User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .fullName(fullName)
                .role(role)
                .status("Active")
                .build());
    }

    private Role ensureRole(String name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(Role.builder().name(name).build()));
    }
}
