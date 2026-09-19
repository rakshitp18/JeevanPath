package com.medivault.hospital.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDto {
    private UUID id;
    private String name;
    private String registrationNumber;
    private String hospitalType;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String phone;
    private String email;
    private String website;
    private Double latitude;
    private Double longitude;
    private String status;
}
