package com.reportit.usermgmt.mongo.repository;

import com.reportit.usermgmt.mongo.document.MongoAiChatMessageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoAiChatMessageRepository extends MongoRepository<MongoAiChatMessageDocument, String> {
    boolean existsByMysqlMessageId(Long mysqlMessageId);
}
