import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import AiPrescriptionScanner from '../components/scanner/AiPrescriptionScanner';
import type { User } from '../types';

export default function AiScannerPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('medivault_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({
        id: 'usr-patient-1',
        fullName: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'PATIENT'
      } as User);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  if (!user) return <div className="loading-screen">Loading Scanner…</div>;

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      pageTitle="AI Prescription Scanner & Extractor"
      pageSubtitle="Instant OCR & AI parsing of prescription documents, drug dosages, and physician credentials"
    >
      <AiPrescriptionScanner />
    </AppShell>
  );
}
