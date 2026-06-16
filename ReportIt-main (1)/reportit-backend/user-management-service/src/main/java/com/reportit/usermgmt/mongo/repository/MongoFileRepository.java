package com.reportit.usermgmt.mongo.repository;

import com.reportit.usermgmt.mongo.document.MongoFileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MongoFileRepository extends MongoRepository<MongoFileDocument, String> {
    boolean existsByMysqlFileId(Long mysqlFileId);
}
