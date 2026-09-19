package com.medivault.hospital.repository;

import com.medivault.hospital.entity.HospitalManager;
import com.medivault.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface HospitalManagerRepository extends JpaRepository<HospitalManager, UUID> {
    Optional<HospitalManager> findByUser(User user);
    Optional<HospitalManager> findByUserId(UUID userId);
}
