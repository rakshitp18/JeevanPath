package com.medivault.platform.scheme.repository;

import com.medivault.platform.scheme.entity.GovernmentScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GovernmentSchemeRepository extends JpaRepository<GovernmentScheme, UUID> {
    List<GovernmentScheme> findByStatus(String status);
}
