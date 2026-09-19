package com.medivault.platform.emergency.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "emergency_access_audits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyAccessAudit {
    
    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @ManyToOne(optional = false)
    @JoinColumn(name = "emergency_profile_id", nullable = false)
    private EmergencyProfile emergencyProfile;

    @Column(name = "accessed_by_ip", length = 50)
    private String accessedByIp;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "accessed_at", nullable = false)
    @Builder.Default
    private ZonedDateTime accessedAt = ZonedDateTime.now();
}
