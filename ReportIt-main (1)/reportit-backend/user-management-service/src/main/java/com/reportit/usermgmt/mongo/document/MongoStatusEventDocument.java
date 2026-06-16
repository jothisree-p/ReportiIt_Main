package com.reportit.usermgmt.mongo.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "status_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MongoStatusEventDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long mysqlHistoryId;

    @Indexed
    private Long complaintId;

    @Indexed
    private String complaintCode;

    private String oldStatus;
    private String newStatus;
    private Long changedByUserId;
    private String changedByName;
    private String remark;
    private LocalDateTime createdAt;
}
