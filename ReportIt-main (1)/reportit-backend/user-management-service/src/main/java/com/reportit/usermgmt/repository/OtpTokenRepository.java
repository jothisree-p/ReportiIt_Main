package com.reportit.usermgmt.repository;

import com.reportit.usermgmt.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findTopByEmailIgnoreCaseAndPurposeAndUsedFalseOrderByCreatedAtDesc(
            String email, String purpose);
}
