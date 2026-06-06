package com.reportit.usermgmt.fileupload;

import com.reportit.usermgmt.fileupload.FileUploadService.FileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("complaintId") Long complaintId) throws IOException {
        return ResponseEntity.ok(fileUploadService.upload(file, complaintId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(fileUploadService.findById(id));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
        FileResponse meta = fileUploadService.findById(id);
        Resource resource = fileUploadService.loadAsResource(id);
        MediaType mediaType = meta.getContentType() != null && !meta.getContentType().isBlank()
                ? MediaType.parseMediaType(meta.getContentType())
                : MediaType.APPLICATION_OCTET_STREAM;
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + meta.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<List<FileResponse>> byComplaint(@PathVariable Long complaintId) {
        return ResponseEntity.ok(fileUploadService.findByComplaint(complaintId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
        fileUploadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
