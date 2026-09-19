package com.medivault.security.entity;

import com.medivault.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "login_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "login_time", nullable = false)
    private Instant loginTime;

    @Column(name = "logout_time")
    private Instant logoutTime;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(length = 255)
    private String device;

    @Column(length = 255)
    private String browser;
}
