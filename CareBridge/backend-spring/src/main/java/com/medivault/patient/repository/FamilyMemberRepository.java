package com.medivault.patient.repository;

import com.medivault.patient.entity.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, UUID> {
    List<FamilyMember> findByPatientId(UUID patientId);
    Optional<FamilyMember> findByIdAndPatientId(UUID id, UUID patientId);
}
