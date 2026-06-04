package com.reportit.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpSendRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String purpose;
}
