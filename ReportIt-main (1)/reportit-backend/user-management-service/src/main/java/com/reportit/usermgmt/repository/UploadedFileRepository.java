package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
    List<UploadedFile> findByComplaint_Id(Long complaintId);
}
