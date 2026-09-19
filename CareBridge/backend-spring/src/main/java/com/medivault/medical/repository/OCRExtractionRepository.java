package com.medivault.medical.repository;

import com.medivault.medical.entity.OCRExtraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OCRExtractionRepository extends JpaRepository<OCRExtraction, UUID> {
}
