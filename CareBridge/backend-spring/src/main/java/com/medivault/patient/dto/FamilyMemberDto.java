package com.medivault.patient.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMemberDto {
    private UUID id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    private String gender;

    private Integer age;

    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group")
    private String bloodGroup;

    @Pattern(regexp = "^\\+?[0-9\\-\\s]{10,15}$", message = "Invalid phone number format")
    private String phoneNumber;

    private String medicalNotes;
}
