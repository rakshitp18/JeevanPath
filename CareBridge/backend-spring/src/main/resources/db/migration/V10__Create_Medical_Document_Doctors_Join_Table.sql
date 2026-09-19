CREATE TABLE medical_document_doctors (
    document_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    PRIMARY KEY (document_id, doctor_id),
    CONSTRAINT fk_document FOREIGN KEY (document_id) REFERENCES medical_documents(id) ON DELETE CASCADE,
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Migrate existing relationships (if any exist)
INSERT INTO medical_document_doctors (document_id, doctor_id)
SELECT id, doctor_id FROM medical_documents WHERE doctor_id IS NOT NULL;

-- Remove the old single-doctor column
ALTER TABLE medical_documents DROP COLUMN doctor_id;
