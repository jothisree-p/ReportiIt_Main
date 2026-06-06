package com.reportit.usermgmt.config;

import com.reportit.usermgmt.entity.Permission;
import com.reportit.usermgmt.entity.Role;
import com.reportit.usermgmt.repository.PermissionRepository;
import com.reportit.usermgmt.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        ensureComplaintSoftDeleteColumns();
        ensureProfileColumns();
        ensureOfficerColumns();
        List.of("CITIZEN", "OFFICER", "ADMIN").forEach(this::ensureRole);
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

    private void ensureComplaintSoftDeleteColumns() {
        runSchemaUpdate("ALTER TABLE complaints ADD COLUMN citizen_deleted BOOLEAN NOT NULL DEFAULT FALSE");
        runSchemaUpdate("ALTER TABLE complaints ADD COLUMN citizen_deleted_at TIMESTAMP NULL");
    }

    private void ensureProfileColumns() {
        runSchemaUpdate("ALTER TABLE user_profiles ADD COLUMN address_line1 VARCHAR(255)");
        runSchemaUpdate("ALTER TABLE user_profiles ADD COLUMN address_line2 VARCHAR(255)");
        runSchemaUpdate("ALTER TABLE user_profiles ADD COLUMN age VARCHAR(20)");
        runSchemaUpdate("ALTER TABLE user_profiles ADD COLUMN gender VARCHAR(40)");
        runSchemaUpdate("ALTER TABLE user_profiles ADD COLUMN map_query VARCHAR(255)");
        runSchemaUpdate("ALTER TABLE user_profiles ADD COLUMN department VARCHAR(120)");
        runSchemaUpdate("ALTER TABLE user_profiles ADD COLUMN display_id VARCHAR(80)");
    }

    private void ensureOfficerColumns() {
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN age VARCHAR(20)");
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN gender VARCHAR(40)");
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN station VARCHAR(120)");
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN department VARCHAR(120)");
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN experience VARCHAR(80)");
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN shift VARCHAR(80)");
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN address TEXT");
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN map_query VARCHAR(255)");
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN emergency VARCHAR(80)");
        runSchemaUpdate("ALTER TABLE officers ADD COLUMN joined_date VARCHAR(80)");
    }

    private void runSchemaUpdate(String sql) {
        try {
            jdbcTemplate.execute(sql);
        } catch (Exception ignored) {
            // Column already exists or the table is not created yet; Hibernate/JPA handles normal table creation.
        }
    }
}
