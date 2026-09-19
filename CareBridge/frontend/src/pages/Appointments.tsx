import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PatientAppointmentsView from '../components/appointments/PatientAppointmentsView';
import DoctorQueueManagementView from '../components/appointments/DoctorQueueManagementView';
import api from '../api';
import type { User, Appointment } from '../types';

const mockDemoAppointments: Appointment[] = [
  {
    id: 'apt-101',
    patientName: 'Nikhil Agarwal',
    doctorName: 'Dr. Milind Verma, MD',
    departmentName: 'Cardiology',
    appointmentDate: '2026-07-30',
    appointmentTime: '10:30 AM',
    reason: 'Routine ECG & Blood Pressure Follow-up',
    status: 'ACCEPTED',
    paymentStatus: 'PAID',
    razorpayPaymentId: 'RZP-TXN-84920193',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-102',
    patientName: 'Michael Chen',
    doctorName: 'Dr. Marcus Vance, MD',
    departmentName: 'Neurology',
    appointmentDate: '2026-07-30',
    appointmentTime: '02:00 PM',
    reason: 'Migraine consultation and MRI review',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-103',
    patientName: 'Nikhil Agarwal',
    doctorName: 'Dr. Elena Rostova, MS',
    departmentName: 'Orthopedics',
    appointmentDate: '2026-07-31',
    appointmentTime: '11:15 AM',
    reason: 'Post-operative knee rehabilitation check',
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
  }
];

const getInitialAppointments = (): Appointment[] => {
  const saved = localStorage.getItem('medivault_appointments_db');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  return mockDemoAppointments;
};

export default function Appointments() {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(getInitialAppointments);
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-30');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const updateAppointmentsState = useCallback((updater: (prev: Appointment[]) => Appointment[]) => {
    setAppointments(prev => {
      const next = updater(prev);
      localStorage.setItem('medivault_appointments_db', JSON.stringify(next));
      return next;
    });
  }, []);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('medivault_user');
      let currentUser: User | null = null;
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        setUser(currentUser);
      } else {
        const demoUser: User = {
          id: 'usr-demo-1',
          name: 'Nikhil Agarwal',
          email: 'nikhil.agarwal@example.com',
          role: 'PATIENT'
        };
        setUser(demoUser);
        currentUser = demoUser;
      }

      const endpoint = currentUser?.role?.toUpperCase() === 'PATIENT'
        ? '/api/v1/patient/appointments'
        : '/api/v1/appointments';

      const res: any = await api.get(endpoint);
      if (Array.isArray(res) && res.length > 0) {
        updateAppointmentsState(() => res);
      }
    } catch (err) {
      console.log('Using saved local appointment database');
    } finally {
      setLoading(false);
    }
  }, [updateAppointmentsState]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  const handleApproveAndGenerateQR = (id: string) => {
    updateAppointmentsState(prev =>
      prev.map(apt => (apt.id === id || !id ? { ...apt, status: 'APPROVED_PENDING_PAYMENT', paymentStatus: 'UNPAID' } : apt))
    );
  };

  const handleRejectAppointment = (id: string) => {
    updateAppointmentsState(prev =>
      prev.filter(apt => apt.id !== id)
    );
  };

  const handleCancelAppointment = (id: string) => {
    updateAppointmentsState(prev =>
      prev.filter(apt => apt.id !== id)
    );
  };

  if (loading || !user) return <div className="loading-screen">Loading Appointments…</div>;

  const isPatient = user.role?.toUpperCase() === 'PATIENT';

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      pageTitle={isPatient ? 'My Appointments & Schedule' : 'Clinical Appointments & Queue Tokens'}
      pageSubtitle={isPatient
        ? 'View and manage your upcoming and past appointments, confirmed slots, and QR passes'
        : 'Manage incoming patient consultation queue, approve requests, and issue QR Queue Entry passes'}
    >
      {isPatient ? (
        <PatientAppointmentsView
          appointments={appointments}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onCancelAppointment={handleCancelAppointment}
        />
      ) : (
        <DoctorQueueManagementView
          appointments={appointments}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onApproveAndGenerateQR={handleApproveAndGenerateQR}
          onRejectAppointment={handleRejectAppointment}
        />
      )}
    </AppShell>
  );
}
