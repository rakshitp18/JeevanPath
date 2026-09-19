package com.medivault.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${medivault.cloudinary.cloud-name}")
    private String cloudName;

    @Value("${medivault.cloudinary.api-key}")
    private String apiKey;

    @Value("${medivault.cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        return new Cloudinary(config);
    }

    @jakarta.annotation.PostConstruct
    public void verifyConfig() {
        System.out.println("==================================================");
        System.out.println("CLOUDINARY CONFIGURATION STATUS:");
        System.out.println("Cloud Name loaded = " + (cloudName != null && !cloudName.isEmpty() ? "YES" : "NO"));
        System.out.println("API Key loaded = " + (apiKey != null && !apiKey.isEmpty() ? "YES" : "NO"));
        System.out.println("API Secret loaded = " + (apiSecret != null && !apiSecret.isEmpty() ? "YES" : "NO"));
        System.out.println("==================================================");
    }
}
