package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByComplaint_IdOrderByCreatedAtDesc(Long complaintId);
}
