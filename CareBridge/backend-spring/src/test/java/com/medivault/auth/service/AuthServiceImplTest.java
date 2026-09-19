package com.medivault.auth.service;

import com.medivault.auth.dto.LoginRequest;
import com.medivault.auth.dto.LoginResponse;
import com.medivault.auth.dto.RegisterPatientRequest;
import com.medivault.constants.enums.Role;
import com.medivault.doctor.repository.DoctorRepository;
import com.medivault.exception.BadRequestException;
import com.medivault.patient.entity.Patient;
import com.medivault.patient.repository.PatientRepository;
import com.medivault.security.CustomUserDetailsService;
import com.medivault.security.JwtUtil;
import com.medivault.security.entity.User;
import com.medivault.security.repository.JwtBlacklistRepository;
import com.medivault.security.repository.LoginHistoryRepository;
import com.medivault.security.repository.OtpVerificationRepository;
import com.medivault.security.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private LoginHistoryRepository loginHistoryRepository;

    @Mock
    private OtpVerificationRepository otpVerificationRepository;

    @Mock
    private JwtBlacklistRepository jwtBlacklistRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private Patient testPatient;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .fullName("Test Patient")
                .email("test@example.com")
                .password("encoded_password")
                .role(Role.PATIENT)
                .active(true)
                .build();
        testUser.setId(UUID.randomUUID());

        testPatient = Patient.builder()
                .user(testUser)
                .fullName("Test Patient")
                .build();
    }

    @Test
    void testRegisterPatient_Success() {
        RegisterPatientRequest request = new RegisterPatientRequest();
        request.setEmail("test@example.com");
        request.setPassword("Password123!");
        request.setFullName("Test Patient");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any())).thenReturn("jwt-token");

        LoginResponse response = authService.registerPatient(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getAccessToken());
        assertEquals(Role.PATIENT, response.getRole());
        
        verify(userRepository).save(any(User.class));
        verify(patientRepository).save(any(Patient.class));
    }

    @Test
    void testRegisterPatient_EmailAlreadyExists() {
        RegisterPatientRequest request = new RegisterPatientRequest();
        request.setEmail("test@example.com");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.registerPatient(request));
    }

    @Test
    void testLogin_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("Password123!");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(any())).thenReturn("jwt-token");

        LoginResponse response = authService.loginRoleBased(request, Role.PATIENT, "127.0.0.1", "Mozilla");

        assertNotNull(response);
        assertEquals("jwt-token", response.getAccessToken());
        verify(userRepository).save(testUser);
        assertNotNull(testUser.getLastLogin());
    }
}
