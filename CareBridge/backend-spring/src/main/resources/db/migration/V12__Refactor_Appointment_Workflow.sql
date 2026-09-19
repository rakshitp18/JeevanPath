-- Add new fields for Doctor Approval workflow and rescheduling
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS proposed_date DATE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS proposed_time TIME WITHOUT TIME ZONE;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Migrate existing statuses to the new core statuses
UPDATE appointments SET current_status = 'PENDING' WHERE current_status = 'REQUESTED';
UPDATE appointments SET current_status = 'APPROVED' WHERE current_status IN ('CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION');
UPDATE appointments SET current_status = 'COMPLETED' WHERE current_status = 'NO_SHOW';

-- Also update status history
UPDATE appointment_status_history SET old_status = 'PENDING' WHERE old_status = 'REQUESTED';
UPDATE appointment_status_history SET new_status = 'PENDING' WHERE new_status = 'REQUESTED';
UPDATE appointment_status_history SET old_status = 'APPROVED' WHERE old_status IN ('CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION');
UPDATE appointment_status_history SET new_status = 'APPROVED' WHERE new_status IN ('CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION');
UPDATE appointment_status_history SET old_status = 'COMPLETED' WHERE old_status = 'NO_SHOW';
UPDATE appointment_status_history SET new_status = 'COMPLETED' WHERE new_status = 'NO_SHOW';
