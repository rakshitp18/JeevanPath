-- V7__Create_Medical_Domain.sql

CREATE TABLE medical_records (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    appointment_id UUID REFERENCES appointments(id),
    record_type VARCHAR(100) NOT NULL,
    visit_date DATE NOT NULL,
    diagnosis TEXT,
    chief_complaint TEXT,
    clinical_notes TEXT,
    treatment_plan TEXT,
    follow_up_date DATE,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY,
    medical_record_id UUID NOT NULL UNIQUE REFERENCES medical_records(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    prescription_number VARCHAR(100) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    notes TEXT,
    pdf_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE prescription_medicines (
    id UUID PRIMARY KEY,
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration_days INTEGER NOT NULL,
    route VARCHAR(100),
    instructions TEXT,
    before_food BOOLEAN DEFAULT false,
    morning BOOLEAN DEFAULT false,
    afternoon BOOLEAN DEFAULT false,
    evening BOOLEAN DEFAULT false,
    night BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE medical_documents (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID REFERENCES doctors(id),
    appointment_id UUID REFERENCES appointments(id),
    medical_record_id UUID REFERENCES medical_records(id),
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    cloudinary_url VARCHAR(255) NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    ocr_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE ocr_extractions (
    id UUID PRIMARY KEY,
    medical_document_id UUID NOT NULL UNIQUE REFERENCES medical_documents(id) ON DELETE CASCADE,
    raw_text TEXT,
    structured_data JSONB,
    ai_summary TEXT,
    confidence_score DOUBLE PRECISION,
    manually_corrected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE medicine_reminders (
    id UUID PRIMARY KEY,
    prescription_medicine_id UUID NOT NULL REFERENCES prescription_medicines(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id),
    reminder_time TIME NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);
