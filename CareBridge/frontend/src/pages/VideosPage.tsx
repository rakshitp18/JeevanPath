import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import DoctorConsultancyVideos from '../components/DoctorConsultancyVideos';
import type { User } from '../types';

export default function VideosPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('medivault_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({
        id: 'usr-patient-1',
        fullName: 'Nikhil Agarwal',
        email: 'nikhil.agarwal@example.com',
        role: 'PATIENT'
      } as User);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  if (!user) return <div className="loading-screen">Loading Videos…</div>;

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      pageTitle="Doctor Video Consults & Health Webinars"
      pageSubtitle="Watch verified specialist consultations, medical advice broadcasts, and preventive care video guides"
    >
      <DoctorConsultancyVideos />
    </AppShell>
  );
}
