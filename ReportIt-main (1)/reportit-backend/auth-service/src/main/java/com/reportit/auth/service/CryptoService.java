package com.reportit.auth.service;

import com.reportit.auth.exception.ApiException;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.spec.MGF1ParameterSpec;
import java.util.Base64;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;

@Service
public class CryptoService {

    private static final String PREFIX = "enc:v1:";

    private KeyPair keyPair;

    @PostConstruct
    void init() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            keyPair = generator.generateKeyPair();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to initialize ReportIt crypto keys", ex);
        }
    }

    public String publicKey() {
        return Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
    }

    public String decryptIfEncrypted(String value) {
        if (value == null || !value.startsWith(PREFIX)) {
            return value;
        }

        try {
            byte[] encrypted = Base64.getDecoder().decode(value.substring(PREFIX.length()));
            Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
            cipher.init(Cipher.DECRYPT_MODE, keyPair.getPrivate(), new OAEPParameterSpec(
                    "SHA-256",
                    "MGF1",
                    MGF1ParameterSpec.SHA256,
                    PSource.PSpecified.DEFAULT
            ));
            return new String(cipher.doFinal(encrypted), java.nio.charset.StandardCharsets.UTF_8);
        } catch (Exception ex) {
            throw new ApiException("Unable to decrypt password payload", HttpStatus.BAD_REQUEST);
        }
    }
}
