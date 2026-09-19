CREATE TABLE vitals (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DOUBLE PRECISION,
    height DOUBLE PRECISION,
    bmi DOUBLE PRECISION,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    blood_sugar_fasting DOUBLE PRECISION,
    blood_sugar_random DOUBLE PRECISION,
    heart_rate INTEGER,
    oxygen_level DOUBLE PRECISION,
    temperature DOUBLE PRECISION,
    sleep_hours DOUBLE PRECISION,
    steps INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vitals_patient_date ON vitals(patient_id, date DESC);
