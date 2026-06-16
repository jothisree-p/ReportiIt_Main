package com.reportit.usermgmt.mongo.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MongoComplaintDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long mysqlComplaintId;

    @Indexed(unique = true)
    private String complaintCode;

    private String title;
    private String category;
    private String description;
    private String locationText;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocalDate incidentDate;
    private String incidentTime;
    private String priority;
    private String status;

    @Indexed
    private Long citizenId;
    private String citizenName;

    @Indexed
    private Long assignedOfficerId;
    private String assignedOfficerName;

    private Boolean citizenDeleted;
    private LocalDateTime citizenDeletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<String> investigationNotes = new ArrayList<>();
}
