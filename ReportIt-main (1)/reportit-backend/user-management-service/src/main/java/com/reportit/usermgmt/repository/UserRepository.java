package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    List<User> findByRole_Name(String roleName);
    long countByRole_NameAndStatusIgnoreCase(String roleName, String status);
}
