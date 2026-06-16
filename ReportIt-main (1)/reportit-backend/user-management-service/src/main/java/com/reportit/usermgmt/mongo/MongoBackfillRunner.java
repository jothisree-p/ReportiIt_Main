package com.reportit.usermgmt.mongo;

import com.reportit.usermgmt.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(20)
@RequiredArgsConstructor
@Slf4j
public class MongoBackfillRunner implements CommandLineRunner {

    private final MongoSyncService mongoSyncService;
    private final ComplaintRepository complaintRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final NotificationRepository notificationRepository;
    private final AiChatMessageRepository aiChatMessageRepository;
    private final UploadedFileRepository uploadedFileRepository;

    @Override
    @Transactional(readOnly = true)
    public void run(String... args) {
        log.info("Starting MongoDB backfill for CivicSafe NoSQL collections.");
        complaintRepository.findAll().forEach(mongoSyncService::mirrorComplaint);
        statusHistoryRepository.findAll().forEach(mongoSyncService::mirrorStatusEvent);
        notificationRepository.findAll().forEach(mongoSyncService::mirrorNotification);
        aiChatMessageRepository.findAll().forEach(mongoSyncService::mirrorAiChatMessage);
        uploadedFileRepository.findAll().forEach(mongoSyncService::mirrorFile);
        log.info("MongoDB backfill completed.");
    }
}
