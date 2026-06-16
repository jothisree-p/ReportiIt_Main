package com.reportit.usermgmt.mongo.repository;

import com.reportit.usermgmt.mongo.document.MongoNotificationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MongoNotificationRepository extends MongoRepository<MongoNotificationDocument, String> {
    boolean existsByMysqlNotificationId(Long mysqlNotificationId);
    Optional<MongoNotificationDocument> findByMysqlNotificationId(Long mysqlNotificationId);
}
