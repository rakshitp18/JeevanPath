package com.medivault.hospital.repository;

import com.medivault.hospital.entity.Receptionist;
import com.medivault.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReceptionistRepository extends JpaRepository<Receptionist, UUID> {
    Optional<Receptionist> findByUser(User user);
    Optional<Receptionist> findByUserId(UUID userId);
}
