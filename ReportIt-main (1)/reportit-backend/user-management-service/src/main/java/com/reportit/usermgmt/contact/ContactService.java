package com.reportit.usermgmt.contact;

import com.reportit.usermgmt.common.ApiException;
import com.reportit.usermgmt.entity.ContactMessage;
import com.reportit.usermgmt.repository.ContactMessageRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender mailSender;

    @Value("${reportit.contact.to:reportit.noreply@gmail.com}")
    private String contactInbox;

    @Value("${reportit.mail.from:reportit.noreply@gmail.com}")
    private String fromAddress;

    public ContactResponse sendMessage(ContactRequest request) {
        ContactMessage saved = contactMessageRepository.save(ContactMessage.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim())
                .subject(request.getSubject().trim())
                .message(request.getMessage().trim())
                .mailSent(false)
                .build());

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromAddress);
            mail.setTo(contactInbox);
            mail.setReplyTo(saved.getEmail());
            mail.setSubject("ReportIt Contact: " + saved.getSubject());
            mail.setText("""
                    New ReportIt contact message

                    Name: %s
                    Email: %s
                    Subject: %s

                    Message:
                    %s
                    """.formatted(saved.getName(), saved.getEmail(), saved.getSubject(), saved.getMessage()));
            mailSender.send(mail);

            saved.setMailSent(true);
            saved.setMailError(null);
            ContactMessage updated = contactMessageRepository.save(saved);
            return ContactResponse.builder()
                    .id(updated.getId())
                    .message("Message sent successfully.")
                    .build();
        } catch (Exception ex) {
            String mailError = ex.getMessage() != null ? ex.getMessage() : "Unknown SMTP error";
            saved.setMailSent(false);
            saved.setMailError(mailError);
            contactMessageRepository.save(saved);
            throw new ApiException(
                    "Message saved, but email could not be sent: " + mailError,
                    HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    @Data
    public static class ContactRequest {
        @NotBlank(message = "Name is required")
        @Size(max = 150, message = "Name is too long")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        @Size(max = 255, message = "Email is too long")
        private String email;

        @NotBlank(message = "Subject is required")
        @Size(max = 200, message = "Subject is too long")
        private String subject;

        @NotBlank(message = "Message is required")
        @Size(max = 3000, message = "Message is too long")
        private String message;
    }

    @Data
    @Builder
    public static class ContactResponse {
        private Long id;
        private String message;
    }
}
