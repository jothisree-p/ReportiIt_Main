package com.reportit.usermgmt.role;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.entity.Permission;
import com.reportit.usermgmt.entity.Role;
import com.reportit.usermgmt.entity.RolePermission;
import com.reportit.usermgmt.repository.PermissionRepository;
import com.reportit.usermgmt.repository.RolePermissionRepository;
import com.reportit.usermgmt.repository.RoleRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;

    @Transactional
    public RoleResponse create(RoleRequest request) {
        if (roleRepository.findByName(request.getName()).isPresent()) {
            throw new ApiException("Role already exists", HttpStatus.CONFLICT);
        }
        Role role = roleRepository.save(Role.builder().name(request.getName().toUpperCase()).build());
        return toResponse(role);
    }

    public List<RoleResponse> findAll() {
        return roleRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public RoleResponse findById(Long id) {
        return toResponse(getRole(id));
    }

    @Transactional
    public RoleResponse update(Long id, RoleRequest request) {
        Role role = getRole(id);
        role.setName(request.getName().toUpperCase());
        return toResponse(roleRepository.save(role));
    }

    @Transactional
    public void delete(Long id) {
        roleRepository.delete(getRole(id));
    }

    public List<String> getPermissions(Long roleId) {
        return rolePermissionRepository.findByRoleId(roleId).stream()
                .map(rp -> rp.getPermission().getCode())
                .collect(Collectors.toList());
    }

    @Transactional
    public void assignPermission(Long roleId, String permissionCode) {
        Role role = getRole(roleId);
        Permission permission = permissionRepository.findByCode(permissionCode)
                .orElseGet(() -> permissionRepository.save(Permission.builder()
                        .code(permissionCode)
                        .description(permissionCode)
                        .build()));
        RolePermission rp = RolePermission.builder()
                .roleId(role.getId())
                .permissionId(permission.getId())
                .role(role)
                .permission(permission)
                .build();
        rolePermissionRepository.save(rp);
    }

    private Role getRole(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ApiException("Role not found", HttpStatus.NOT_FOUND));
    }

    private RoleResponse toResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .permissions(getPermissions(role.getId()))
                .build();
    }

    @Data
    public static class RoleRequest {
        private String name;
    }

    @Data
    @Builder
    public static class RoleResponse {
        private Long id;
        private String name;
        private List<String> permissions;
    }
}
