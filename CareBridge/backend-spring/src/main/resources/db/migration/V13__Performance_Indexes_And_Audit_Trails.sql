-- V13: Performance Optimization Composite Indexes & Foreign Key Constraints

-- Appointments Performance Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date_status ON appointments(doctor_id, appointment_date, current_status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON appointments(patient_id, appointment_date);

-- Medical Documents Query Acceleration
CREATE INDEX IF NOT EXISTS idx_medical_docs_patient_created ON medical_documents(patient_id, created_at DESC);

-- Authentication & Role Search Indexes
CREATE INDEX IF NOT EXISTS idx_users_email_role ON users(email, role);

-- Provider Search Indexes
CREATE INDEX IF NOT EXISTS idx_doctors_hospital_spec ON doctors(hospital_id, specialization);

-- Audit Trail Indexes
CREATE INDEX IF NOT EXISTS idx_login_history_user_time ON login_history(user_id, login_time DESC);
