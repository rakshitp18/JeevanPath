package com.medivault.medical.service;

import com.medivault.medical.entity.Prescription;

public interface ReminderEngineService {
    void generateReminders(Prescription prescription);
}
