package com.medivault.patient.mapper;

import com.medivault.patient.dto.PatientProfileDto;
import com.medivault.patient.entity.Patient;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDate;
import java.time.Period;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PatientProfileMapper {

    PatientProfileDto toDto(Patient patient);

    @AfterMapping
    default void calculateCalculatedFields(Patient patient, @MappingTarget PatientProfileDto.PatientProfileDtoBuilder dtoBuilder) {
        if (patient.getDateOfBirth() != null) {
            dtoBuilder.age(Period.between(patient.getDateOfBirth(), LocalDate.now()).getYears());
        }
        
        if (patient.getHeight() != null && patient.getWeight() != null && patient.getHeight() > 0) {
            // BMI = weight(kg) / (height(m) * height(m))
            double heightInMeters = patient.getHeight() / 100.0;
            double bmi = patient.getWeight() / (heightInMeters * heightInMeters);
            // Round to 2 decimal places
            dtoBuilder.bmi(Math.round(bmi * 100.0) / 100.0);
        }
    }
}
