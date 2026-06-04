package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByComplaintCode(String complaintCode);
    List<Complaint> findByCitizen_Id(Long citizenId);
    List<Complaint> findByAssignedOfficer_Id(Long officerId);
    long countByStatus(String status);
}
