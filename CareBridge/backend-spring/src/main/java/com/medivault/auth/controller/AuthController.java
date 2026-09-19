package com.medivault.auth.controller;

import com.medivault.auth.dto.*;
import com.medivault.auth.service.AuthService;
import com.medivault.common.ApiResponse;
import com.medivault.constants.enums.Role;
import com.medivault.security.CustomUserDetails;
import com.medivault.util.ResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/auth", "/api/v1/auth"})
@RequiredArgsConstructor
@Tag(name = "Authentication System", description = "Role-based authentication & authorization endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Generic user login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ResponseBuilder.success(authService.loginRoleBased(request, null, getClientIp(httpRequest), getUserAgent(httpRequest)), "Login successful");
    }

    @PostMapping("/patient/register")
    @Operation(summary = "Register a new Patient account")
    public ResponseEntity<ApiResponse<LoginResponse>> registerPatient(@Valid @RequestBody RegisterPatientRequest request) {
        return ResponseBuilder.success(authService.registerPatient(request), "Patient registered successfully", HttpStatus.CREATED);
    }

    @PostMapping("/patient/login")
    @Operation(summary = "Login for Patient role")
    public ResponseEntity<ApiResponse<LoginResponse>> patientLogin(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ResponseBuilder.success(authService.loginRoleBased(request, Role.PATIENT, getClientIp(httpRequest), getUserAgent(httpRequest)), "Patient login successful");
    }

    @PostMapping("/doctor/login")
    @Operation(summary = "Login for Doctor role")
    public ResponseEntity<ApiResponse<LoginResponse>> doctorLogin(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ResponseBuilder.success(authService.loginRoleBased(request, Role.DOCTOR, getClientIp(httpRequest), getUserAgent(httpRequest)), "Doctor login successful");
    }

    @PostMapping("/reception/login")
    @Operation(summary = "Login for Receptionist role")
    public ResponseEntity<ApiResponse<LoginResponse>> receptionistLogin(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ResponseBuilder.success(authService.loginRoleBased(request, Role.RECEPTIONIST, getClientIp(httpRequest), getUserAgent(httpRequest)), "Receptionist login successful");
    }

    @PostMapping("/manager/login")
    @Operation(summary = "Login for Hospital Manager role")
    public ResponseEntity<ApiResponse<LoginResponse>> managerLogin(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ResponseBuilder.success(authService.loginRoleBased(request, Role.HOSPITAL_MANAGER, getClientIp(httpRequest), getUserAgent(httpRequest)), "Hospital Manager login successful");
    }

    @PostMapping("/admin/login")
    @Operation(summary = "Login for Super Admin role")
    public ResponseEntity<ApiResponse<LoginResponse>> adminLogin(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ResponseBuilder.success(authService.loginRoleBased(request, Role.SUPER_ADMIN, getClientIp(httpRequest), getUserAgent(httpRequest)), "Admin login successful");
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user session", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(name = "Authorization", required = false) String token,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        authService.logout(token, userDetails != null ? userDetails.getId() : null);
        return ResponseBuilder.success(null, "Logged out successfully");
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh JWT access token")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@RequestParam String refreshToken) {
        return ResponseBuilder.success(authService.refreshToken(refreshToken), "Token refreshed successfully");
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Send OTP for password reset")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseBuilder.success(null, "Password reset OTP sent to registered email");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using OTP code")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseBuilder.success(null, "Password reset successfully");
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify user email address using OTP code")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);
        return ResponseBuilder.success(null, "Email verified successfully");
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password for authenticated user", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(userDetails.getId(), request);
        return ResponseBuilder.success(null, "Password changed successfully");
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private String getUserAgent(HttpServletRequest request) {
        return request.getHeader("User-Agent");
    }
}
