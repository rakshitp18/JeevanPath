package com.medivault;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

/**
 * Main entry point for the MediVault Spring Boot application.
 */
@SpringBootApplication
public class MediVaultApplication {

    /**
     * Enforce UTC globally to prevent timezone drift across the application
     * and database, which is critical for healthcare appointments.
     */
    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(MediVaultApplication.class, args);
    }
}
