package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficerRepository extends JpaRepository<Officer, Long> {}
