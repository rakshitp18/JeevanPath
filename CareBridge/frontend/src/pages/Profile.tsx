import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PatientProfileForm from '../components/profile/PatientProfileForm';
import DoctorProfileForm from '../components/profile/DoctorProfileForm';
import type { User as UserType } from '../types';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('medivault_user');
    if (stored) {
      const u = JSON.parse(stored);
      setCurrentUser(u);
    } else {
      setCurrentUser({
        id: 'usr-patient-1',
        fullName: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'PATIENT'
      } as UserType);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  if (!currentUser) return <div className="loading-screen">Loading Profile…</div>;

  const isDoctor = currentUser.role?.toUpperCase() === 'DOCTOR';

  return (
    <AppShell
      user={currentUser}
      onLogout={handleLogout}
      pageTitle={isDoctor ? "Doctor Professional Profile" : "My Patient Profile & Medical ID"}
      pageSubtitle={isDoctor
        ? "Manage physician credentials, practice details, today's time slots & patient capacity"
        : "Manage personal health details, biometric credentials, emergency contacts, and insurance"}
    >
      {isDoctor ? (
        <DoctorProfileForm user={currentUser} />
      ) : (
        <PatientProfileForm user={currentUser} />
      )}
    </AppShell>
  );
}
