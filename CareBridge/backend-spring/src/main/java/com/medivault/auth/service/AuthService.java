package com.medivault.auth.service;

import com.medivault.auth.dto.*;
import com.medivault.constants.enums.Role;

import java.util.UUID;

public interface AuthService {
    LoginResponse registerPatient(RegisterPatientRequest request);
    LoginResponse registerDoctor(RegisterDoctorRequest request);
    LoginResponse loginRoleBased(LoginRequest request, Role expectedRole, String ipAddress, String userAgent);
    LoginResponse refreshToken(String refreshToken);
    
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void verifyEmail(VerifyEmailRequest request);
    void changePassword(UUID userId, ChangePasswordRequest request);
    void logout(String token, UUID userId);
    
    UserResponse getCurrentUser(UUID userId);
}
