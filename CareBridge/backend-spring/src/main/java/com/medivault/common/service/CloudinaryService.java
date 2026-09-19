package com.medivault.common.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map<String, Object> uploadFile(MultipartFile file, String folder) throws IOException {
        String publicId = UUID.randomUUID().toString();
        
        try {
            return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", folder
            ));
        } catch (Exception e) {
            throw new com.medivault.exception.BadRequestException("Cloudinary configuration is invalid or upload failed: " + e.getMessage());
        }
    }

    public void deleteFile(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
