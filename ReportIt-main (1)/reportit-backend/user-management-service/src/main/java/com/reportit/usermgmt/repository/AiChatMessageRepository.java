package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.AiChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiChatMessageRepository extends JpaRepository<AiChatMessage, Long> {
    List<AiChatMessage> findTop50ByUser_IdOrderByCreatedAtAsc(Long userId);
}
