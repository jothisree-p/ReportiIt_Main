package com.reportit.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    /** CITIZEN, OFFICER, or ADMIN */
    @NotBlank
    private String role;
}
