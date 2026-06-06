package com.reportit.usermgmt.ai;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiChatController {

    private final AiChatService aiChatService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        return ResponseEntity.ok(new AiChatResponse(aiChatService.reply(request.getMessage())));
    }

    @Data
    public static class AiChatRequest {
        private String message;
    }

    @Data
    public static class AiChatResponse {
        private final String reply;
    }
}
