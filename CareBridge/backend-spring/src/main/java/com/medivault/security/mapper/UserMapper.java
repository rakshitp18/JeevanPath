package com.medivault.security.mapper;

import com.medivault.auth.dto.AuthResponse;
import com.medivault.doctor.entity.Doctor;
import com.medivault.patient.entity.Patient;
import com.medivault.security.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "profile", source = ".", qualifiedByName = "mapProfile")
    AuthResponse.UserDto toDto(User user);

    @Named("mapProfile")
    default AuthResponse.ProfileDto mapProfile(User user) {
        if (user.getPatient() != null) {
            Patient patient = user.getPatient();
            return AuthResponse.ProfileDto.builder()
                    .fullName(patient.getFullName())
                    .profileImage(patient.getProfileImage())
                    .build();
        } else if (user.getDoctor() != null) {
            Doctor doctor = user.getDoctor();
            return AuthResponse.ProfileDto.builder()
                    .fullName(doctor.getFullName())
                    .profileImage(doctor.getProfileImage())
                    .build();
        }
        return null;
    }
}
