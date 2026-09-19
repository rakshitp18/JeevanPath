package com.medivault.auth.config;

import com.medivault.constants.enums.AccountStatus;
import com.medivault.constants.enums.Role;
import com.medivault.security.entity.User;
import com.medivault.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            seedUser("doctor@medivault.io", "DoctorPass123!", "Dr. Sarah Jenkins", "+19876543210", Role.DOCTOR);
            seedUser("patient@medivault.io", "PatientPass123!", "John Doe", "+19876543211", Role.PATIENT);
            seedUser("receptionist@medivault.io", "ReceptionPass123!", "Alice Smith", "+19876543212", Role.RECEPTIONIST);
            seedUser("manager@medivault.io", "ManagerPass123!", "Robert Taylor", "+19876543213", Role.HOSPITAL_MANAGER);
            seedUser("admin@medivault.io", "AdminPass123!", "Super Admin", "+19876543214", Role.SUPER_ADMIN);
        } catch (Exception e) {
            log.warn("Data initialization note: {}", e.getMessage());
        }
    }

    private void seedUser(String email, String rawPassword, String fullName, String phone, Role role) {
        if (!userRepository.existsByEmail(email)) {
            log.info("Seeding demo account for role {}: {}", role, email);
            User user = User.builder()
                    .fullName(fullName)
                    .email(email)
                    .phoneNumber(phone)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .accountStatus(AccountStatus.ACTIVE)
                    .emailVerified(true)
                    .active(true)
                    .build();
            userRepository.save(user);
        }
    }
}
