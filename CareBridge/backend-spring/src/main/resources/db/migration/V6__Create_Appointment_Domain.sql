-- V6__Create_Appointment_Domain.sql

CREATE TABLE appointments (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    consultation_mode VARCHAR(50) NOT NULL,
    reason TEXT,
    symptoms TEXT,
    notes TEXT,
    current_status VARCHAR(50) NOT NULL,
    cancellation_reason TEXT,
    reschedule_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE appointment_qr_codes (
    id UUID PRIMARY KEY,
    appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
    validation_token VARCHAR(255) NOT NULL UNIQUE,
    expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE appointment_status_history (
    id UUID PRIMARY KEY,
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID NOT NULL REFERENCES users(id),
    remarks TEXT,
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);
