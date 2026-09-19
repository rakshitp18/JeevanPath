package com.medivault.hospital.entity;

import com.medivault.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital extends BaseEntity {

    @Column(name = "hospital_name", nullable = false)
    private String hospitalName;

    @Column(name = "registration_number", unique = true, length = 100)
    private String registrationNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(name = "pincode", length = 20)
    private String pincode;

    @Column(length = 20)
    private String phone;

    private String email;

    public String getName() {
        return hospitalName;
    }

    public UUID getHospitalId() {
        return getId();
    }
}
