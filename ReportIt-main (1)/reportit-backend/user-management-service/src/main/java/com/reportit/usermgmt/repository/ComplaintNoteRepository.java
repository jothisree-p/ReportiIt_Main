package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.ComplaintNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintNoteRepository extends JpaRepository<ComplaintNote, Long> {
    List<ComplaintNote> findByComplaint_IdOrderByCreatedAtDesc(Long complaintId);
}
