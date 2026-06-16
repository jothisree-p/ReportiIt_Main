package com.reportit.usermgmt.mongo.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ai_chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MongoAiChatMessageDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long mysqlMessageId;

    @Indexed
    private Long userId;

    private String sender;
    private String message;
    private LocalDateTime createdAt;
}
