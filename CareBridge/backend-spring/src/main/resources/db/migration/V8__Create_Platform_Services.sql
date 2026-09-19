-- V8__Create_Platform_Services.sql

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- EMAIL, PUSH, SMS
    category VARCHAR(50) NOT NULL, -- APPOINTMENT, SYSTEM, MEDICAL
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING, SENT, FAILED
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE emergency_profiles (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL UNIQUE REFERENCES patients(id),
    access_token VARCHAR(255) UNIQUE,
    token_expiry TIMESTAMP WITH TIME ZONE,
    is_enabled BOOLEAN DEFAULT false,
    blood_group VARCHAR(10),
    critical_allergies TEXT,
    critical_diseases TEXT,
    current_medications TEXT,
    organ_donor BOOLEAN DEFAULT false,
    emergency_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE emergency_access_audits (
    id UUID PRIMARY KEY,
    emergency_profile_id UUID NOT NULL REFERENCES emergency_profiles(id) ON DELETE CASCADE,
    accessed_by_ip VARCHAR(50),
    user_agent TEXT,
    accessed_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE government_schemes (
    id UUID PRIMARY KEY,
    scheme_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    eligibility_criteria TEXT,
    min_age INTEGER,
    max_age INTEGER,
    gender VARCHAR(50),
    max_income DOUBLE PRECISION,
    state VARCHAR(100),
    website_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);
