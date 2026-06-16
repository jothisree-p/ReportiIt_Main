package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.ComplaintFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComplaintFeedbackRepository extends JpaRepository<ComplaintFeedback, Long> {
    Optional<ComplaintFeedback> findByComplaint_Id(Long complaintId);
    Optional<ComplaintFeedback> findByComplaint_IdAndCitizen_Id(Long complaintId, Long citizenId);
    List<ComplaintFeedback> findByOfficer_IdOrderByUpdatedAtDesc(Long officerId);
    List<ComplaintFeedback> findAllByOrderByUpdatedAtDesc();
}
