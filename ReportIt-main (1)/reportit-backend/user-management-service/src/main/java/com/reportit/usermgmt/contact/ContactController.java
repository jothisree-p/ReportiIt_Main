package com.reportit.usermgmt.contact;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping("/messages")
    public ResponseEntity<ContactService.ContactResponse> sendMessage(
            @Valid @RequestBody ContactService.ContactRequest request
    ) {
        return ResponseEntity.ok(contactService.sendMessage(request));
    }
}
