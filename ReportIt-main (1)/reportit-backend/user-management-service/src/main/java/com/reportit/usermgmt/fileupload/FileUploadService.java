package com.reportit.usermgmt.fileupload;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.common.AuthHelper;
import com.reportit.usermgmt.entity.Complaint;
import com.reportit.usermgmt.entity.UploadedFile;
import com.reportit.usermgmt.entity.User;
import com.reportit.usermgmt.mongo.MongoSyncService;
import com.reportit.usermgmt.repository.ComplaintRepository;
import com.reportit.usermgmt.repository.UploadedFileRepository;
import com.reportit.usermgmt.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final UploadedFileRepository fileRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final MongoSyncService mongoSyncService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public FileResponse upload(MultipartFile file, Long complaintId) throws IOException {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ApiException("Complaint not found", HttpStatus.NOT_FOUND));
        User uploader = userRepository.findById(AuthHelper.currentUser().getUserId())
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));

        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String storedName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path target = dir.resolve(storedName);
        Files.copy(file.getInputStream(), target);

        UploadedFile uploaded = UploadedFile.builder()
                .complaint(complaint)
                .uploadedBy(uploader)
                .fileName(file.getOriginalFilename())
                .filePath(target.toString())
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .build();
        UploadedFile saved = fileRepository.save(uploaded);
        mongoSyncService.mirrorFile(saved);
        mongoSyncService.mirrorComplaint(complaint);
        return toResponse(saved);
    }

    public FileResponse findById(Long id) {
        return toResponse(getFile(id));
    }

    public List<FileResponse> findByComplaint(Long complaintId) {
        return fileRepository.findByComplaint_Id(complaintId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public Resource loadAsResource(Long id) throws IOException {
        UploadedFile file = getFile(id);
        Path path = Paths.get(file.getFilePath());
        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists()) {
            throw new ApiException("File not found on disk", HttpStatus.NOT_FOUND);
        }
        return resource;
    }

    @Transactional
    public void delete(Long id) throws IOException {
        UploadedFile file = getFile(id);
        Files.deleteIfExists(Paths.get(file.getFilePath()));
        fileRepository.delete(file);
    }

    private UploadedFile getFile(Long id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new ApiException("File not found", HttpStatus.NOT_FOUND));
    }

    private FileResponse toResponse(UploadedFile f) {
        return FileResponse.builder()
                .id(f.getId())
                .complaintId(f.getComplaint() != null ? f.getComplaint().getId() : null)
                .fileName(f.getFileName())
                .contentType(f.getContentType())
                .sizeBytes(f.getSizeBytes())
                .uploadedAt(f.getUploadedAt())
                .build();
    }

    @Data
    @Builder
    public static class FileResponse {
        private Long id;
        private Long complaintId;
        private String fileName;
        private String contentType;
        private Long sizeBytes;
        private java.time.LocalDateTime uploadedAt;
    }
}
