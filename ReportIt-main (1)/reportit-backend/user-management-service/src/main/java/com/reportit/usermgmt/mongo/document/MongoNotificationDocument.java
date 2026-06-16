package com.reportit.usermgmt.mongo.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MongoNotificationDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long mysqlNotificationId;

    @Indexed
    private Long userId;

    private String title;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
