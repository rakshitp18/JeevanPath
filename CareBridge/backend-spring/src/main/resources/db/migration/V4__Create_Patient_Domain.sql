-- V4__Create_Patient_Domain.sql

-- Add new fields to patients table
ALTER TABLE patients ADD COLUMN height DOUBLE PRECISION;
ALTER TABLE patients ADD COLUMN weight DOUBLE PRECISION;
ALTER TABLE patients ADD COLUMN alternate_phone VARCHAR(20);
ALTER TABLE patients ADD COLUMN city VARCHAR(100);
ALTER TABLE patients ADD COLUMN state VARCHAR(100);
ALTER TABLE patients ADD COLUMN country VARCHAR(100);
ALTER TABLE patients ADD COLUMN postal_code VARCHAR(20);

-- Patient Medical Information
CREATE TABLE patient_medical_info (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
    allergies TEXT, -- Will store comma-separated or jsonb, for simplicity we can use TEXT
    chronic_diseases TEXT,
    current_conditions TEXT,
    current_medications TEXT,
    past_surgeries TEXT,
    disabilities TEXT,
    organ_donor_status BOOLEAN DEFAULT FALSE,
    smoking_status VARCHAR(50),
    alcohol_consumption VARCHAR(50),
    vaccination_status VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Emergency Contacts
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    alternate_number VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Insurance Information
CREATE TABLE insurance_info (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
    provider VARCHAR(255) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    policy_holder VARCHAR(255) NOT NULL,
    coverage_type VARCHAR(100),
    coverage_amount DECIMAL(12,2),
    issue_date DATE,
    expiry_date DATE,
    policy_status VARCHAR(50),
    emergency_coverage BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Family Members
CREATE TABLE family_members (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    age INTEGER,
    blood_group VARCHAR(10),
    phone_number VARCHAR(20),
    medical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);
