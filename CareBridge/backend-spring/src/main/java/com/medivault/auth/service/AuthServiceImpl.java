package com.medivault.auth.service;

import com.medivault.auth.dto.*;
import com.medivault.constants.enums.AccountStatus;
import com.medivault.constants.enums.Role;
import com.medivault.doctor.entity.Doctor;
import com.medivault.doctor.repository.DoctorRepository;
import com.medivault.exception.BadRequestException;
import com.medivault.exception.CustomException;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.patient.entity.Patient;
import com.medivault.patient.repository.PatientRepository;
import com.medivault.security.CustomUserDetails;
import com.medivault.security.CustomUserDetailsService;
import com.medivault.security.JwtUtil;
import com.medivault.security.entity.JwtBlacklist;
import com.medivault.security.entity.LoginHistory;
import com.medivault.security.entity.OtpVerification;
import com.medivault.security.entity.User;
import com.medivault.security.repository.JwtBlacklistRepository;
import com.medivault.security.repository.LoginHistoryRepository;
import com.medivault.security.repository.OtpVerificationRepository;
import com.medivault.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final JwtBlacklistRepository jwtBlacklistRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final EmailService emailService;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_TIME_DURATION_MINUTES = 15;
    private static final SecureRandom random = new SecureRandom();

    @Override
    @Transactional
    public LoginResponse registerPatient(RegisterPatientRequest request) {
        validateEmailAndPhone(request.getEmail(), request.getPhoneNumber());

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PATIENT)
                .accountStatus(AccountStatus.ACTIVE)
                .emailVerified(false)
                .active(true)
                .build();
        user = userRepository.save(user);

        Patient patient = Patient.builder()
                .user(user)
                .fullName(request.getFullName())
                .build();
        patientRepository.save(patient);

        sendOtpForVerification(user.getEmail());

        return buildLoginResponse(user, "REGISTER");
    }

    @Override
    @Transactional
    public LoginResponse registerDoctor(RegisterDoctorRequest request) {
        validateEmailAndPhone(request.getEmail(), null);

        if (request.getMedicalRegistrationNumber() != null && doctorRepository.existsByMedicalRegistrationNumber(request.getMedicalRegistrationNumber())) {
            throw new BadRequestException("Medical Registration Number is already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.DOCTOR)
                .accountStatus(AccountStatus.ACTIVE)
                .emailVerified(false)
                .active(true)
                .build();
        user = userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .user(user)
                .fullName(request.getFullName())
                .medicalRegistrationNumber(request.getMedicalRegistrationNumber())
                .qualification(request.getQualification())
                .specialization(request.getSpecialization())
                .build();
        doctorRepository.save(doctor);

        sendOtpForVerification(user.getEmail());

        return buildLoginResponse(user, "REGISTER");
    }

    @Override
    @Transactional
    public LoginResponse loginRoleBased(LoginRequest request, Role expectedRole, String ipAddress, String userAgent) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (expectedRole != null && user.getRole() != expectedRole && user.getRole() != Role.SUPER_ADMIN) {
            throw new BadRequestException("Unauthorized role access. Account role is: " + user.getRole());
        }

        if (user.getAccountStatus() == AccountStatus.LOCKED || user.getAccountStatus() == AccountStatus.SUSPENDED) {
            throw new CustomException("Account is " + user.getAccountStatus() + ". Please contact support.", "ACCOUNT_DISABLED", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.setAccountStatus(AccountStatus.LOCKED);
                user.setAccountLockedUntil(Instant.now().plus(LOCK_TIME_DURATION_MINUTES, ChronoUnit.MINUTES));
            }
            userRepository.save(user);
            throw new BadRequestException("Invalid email or password");
        }

        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);
        user.setLastLogin(Instant.now());
        userRepository.save(user);

        // Record Login History
        try {
            LoginHistory history = LoginHistory.builder()
                    .user(user)
                    .loginTime(Instant.now())
                    .ipAddress(ipAddress)
                    .browser(userAgent)
                    .device("Web Client")
                    .build();
            loginHistoryRepository.save(history);
        } catch (Exception e) {
            log.warn("Failed to record login history: {}", e.getMessage());
        }

        return buildLoginResponse(user, "LOGIN");
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        String email = jwtUtil.extractUsername(refreshToken);
        CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(email);

        if (jwtUtil.isTokenValid(refreshToken, userDetails) && !jwtBlacklistRepository.existsByToken(refreshToken)) {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            return buildLoginResponse(user, "REFRESH");
        }
        throw new BadRequestException("Invalid or expired refresh token");
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with provided email"));

        String otp = generateOtp();
        OtpVerification otpObj = OtpVerification.builder()
                .email(user.getEmail())
                .otpCode(otp)
                .purpose("PASSWORD_RESET")
                .expiryTime(Instant.now().plus(15, ChronoUnit.MINUTES))
                .used(false)
                .build();
        otpVerificationRepository.save(otpObj);

        emailService.sendPasswordResetEmail(user.getEmail(), otp);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        OtpVerification otpObj = otpVerificationRepository
                .findFirstByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc(request.getEmail(), "PASSWORD_RESET")
                .orElseThrow(() -> new BadRequestException("Invalid or expired OTP"));

        if (!otpObj.getOtpCode().equals(request.getOtpCode()) || otpObj.getExpiryTime().isBefore(Instant.now())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpObj.setUsed(true);
        otpVerificationRepository.save(otpObj);
    }

    @Override
    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        OtpVerification otpObj = otpVerificationRepository
                .findFirstByEmailAndPurposeAndUsedFalseOrderByCreatedAtDesc(request.getEmail(), "EMAIL_VERIFICATION")
                .orElseThrow(() -> new BadRequestException("Invalid or expired OTP"));

        if (!otpObj.getOtpCode().equals(request.getOtpCode()) || otpObj.getExpiryTime().isBefore(Instant.now())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEmailVerified(true);
        userRepository.save(user);

        otpObj.setUsed(true);
        otpVerificationRepository.save(otpObj);
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void logout(String token, UUID userId) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            Instant expiry = jwtUtil.extractExpiration(jwt).toInstant();
            JwtBlacklist blacklist = JwtBlacklist.builder()
                    .token(jwt)
                    .expiresAt(expiry)
                    .build();
            jwtBlacklistRepository.save(blacklist);
        }
    }

    @Override
    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    private void validateEmailAndPhone(String email, String phoneNumber) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email " + email + " is already registered");
        }
        if (phoneNumber != null && !phoneNumber.isBlank() && userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new BadRequestException("Phone number " + phoneNumber + " is already registered");
        }
    }

    private String generateOtp() {
        return String.format("%06d", random.nextInt(900000) + 100000);
    }

    private void sendOtpForVerification(String email) {
        String otp = generateOtp();
        OtpVerification otpObj = OtpVerification.builder()
                .email(email)
                .otpCode(otp)
                .purpose("EMAIL_VERIFICATION")
                .expiryTime(Instant.now().plus(15, ChronoUnit.MINUTES))
                .used(false)
                .build();
        otpVerificationRepository.save(otpObj);
        emailService.sendVerificationEmail(email, otp);
    }

    private LoginResponse buildLoginResponse(User user, String type) {
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateToken(userDetails);

        List<String> permissions = getPermissionsForRole(user.getRole());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(user))
                .role(user.getRole())
                .permissions(permissions)
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .accountStatus(user.getAccountStatus())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }

    private List<String> getPermissionsForRole(Role role) {
        List<String> perms = new ArrayList<>();
        switch (role) {
            case PATIENT:
                perms.add("READ_OWN_RECORDS");
                perms.add("BOOK_APPOINTMENT");
                perms.add("VIEW_PRESCRIPTIONS");
                break;
            case DOCTOR:
                perms.add("READ_PATIENT_RECORDS");
                perms.add("WRITE_PRESCRIPTION");
                perms.add("MANAGE_SCHEDULE");
                break;
            case RECEPTIONIST:
                perms.add("CREATE_PATIENT");
                perms.add("SCHEDULE_APPOINTMENT");
                perms.add("CHECK_IN");
                break;
            case HOSPITAL_MANAGER:
                perms.add("MANAGE_STAFF");
                perms.add("VIEW_ANALYTICS");
                perms.add("MANAGE_HOSPITAL");
                break;
            case SUPER_ADMIN:
                perms.add("ALL_PERMISSIONS");
                break;
        }
        return perms;
    }
}
