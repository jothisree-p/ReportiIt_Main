package com.reportit.usermgmt.mongo.repository;

import com.reportit.usermgmt.mongo.document.MongoComplaintDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MongoComplaintRepository extends MongoRepository<MongoComplaintDocument, String> {
    Optional<MongoComplaintDocument> findByMysqlComplaintId(Long mysqlComplaintId);
}
