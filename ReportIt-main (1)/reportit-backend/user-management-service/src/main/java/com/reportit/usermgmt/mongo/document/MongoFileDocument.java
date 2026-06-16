package com.reportit.usermgmt.mongo.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "evidence_files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MongoFileDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long mysqlFileId;

    @Indexed
    private Long complaintId;

    @Indexed
    private String complaintCode;

    private Long uploadedByUserId;
    private String fileName;
    private String filePath;
    private String contentType;
    private Long sizeBytes;
    private LocalDateTime uploadedAt;
}
