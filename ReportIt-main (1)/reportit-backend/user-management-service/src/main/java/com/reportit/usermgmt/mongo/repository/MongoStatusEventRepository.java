package com.reportit.usermgmt.mongo.repository;

import com.reportit.usermgmt.mongo.document.MongoStatusEventDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoStatusEventRepository extends MongoRepository<MongoStatusEventDocument, String> {
    boolean existsByMysqlHistoryId(Long mysqlHistoryId);
}
