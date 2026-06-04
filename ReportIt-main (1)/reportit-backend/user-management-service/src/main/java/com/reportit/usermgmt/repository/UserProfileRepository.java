package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {}
