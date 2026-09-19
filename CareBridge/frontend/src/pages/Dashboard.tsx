import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Stethoscope, Calendar, FlaskConical, ArrowUpRight,
  UserPlus, CalendarPlus, FileText, ChevronDown, Eye,
  LayoutGrid, Activity, Video
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';

import AppShell from '../components/AppShell';
import PatientInsightsMap from '../components/PatientInsightsMap';
import PatientDossierModal, { type PatientDossierData } from '../components/PatientDossierModal';
import DoctorClinicalWorkstation from '../components/DoctorClinicalWorkstation';
import DoctorConsultancyVideos from '../components/DoctorConsultancyVideos';
import PatientPortalWorkstation from '../components/PatientPortalWorkstation';
import api from '../api';
import type { User } from '../types';

const mockPatientDossiers: Record<string, PatientDossierData> = {
  'Nikhil Agarwal': {
    id: 'PAT-1001',
    name: 'Nikhil Agarwal',
    age: 32,
    gender: 'Male',
    bloodGroup: 'O+',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    email: 'nikhil.agarwal@example.com',
    phone: '+1 (555) 234-5678',
    vitals: { bp: '120/80', heartRate: 72, glucose: 95, spo2: 98, temp: '98.6°F' },
    reports: [
      { id: 'r1', title: 'Complete Blood Count (CBC) Lab Report', type: 'Lab Result', date: '2026-07-28', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      { id: 'r2', title: 'Cardiology ECG Diagnostic Summary', type: 'Diagnostic', date: '2026-07-25', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    prescriptions: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
    ],
    allergies: ['Penicillin'],
    notes: 'Patient shows stable physiological recovery following cardiology intervention.'
  },
  'Michael Chen': {
    id: 'PAT-1002',
    name: 'Michael Chen',
    age: 45,
    gender: 'Male',
    bloodGroup: 'A+',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    email: 'm.chen@example.com',
    phone: '+1 (555) 987-6543',
    vitals: { bp: '124/82', heartRate: 76, glucose: 102, spo2: 99, temp: '98.4°F' },
    reports: [
      { id: 'r3', title: 'Brain MRI Scan & Neurological Review', type: 'Imaging', date: '2026-07-27', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    prescriptions: [
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed for migraine' }
    ],
    allergies: ['Sulfa drugs'],
    notes: 'Migraine frequency reduced by 40% with prophylactic therapy.'
  },
  'Emma Davis': {
    id: 'PAT-1003',
    name: 'Emma Davis',
    age: 29,
    gender: 'Female',
    bloodGroup: 'B+',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    email: 'emma.davis@example.com',
    phone: '+1 (555) 345-6789',
    vitals: { bp: '118/78', heartRate: 68, glucose: 88, spo2: 98, temp: '98.6°F' },
    reports: [
      { id: 'r4', title: 'Thyroid Function Panel (TSH, T3, T4)', type: 'Lab Result', date: '2026-07-29', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    prescriptions: [
      { name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily morning' }
    ],
    allergies: ['None reported'],
    notes: 'Thyroid hormone levels normalized.'
  },
  'James Wilson': {
    id: 'PAT-1004',
    name: 'James Wilson',
    age: 52,
    gender: 'Male',
    bloodGroup: 'O-',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    email: 'j.wilson@example.com',
    phone: '+1 (555) 876-5432',
    vitals: { bp: '130/85', heartRate: 74, glucose: 110, spo2: 97, temp: '98.7°F' },
    reports: [
      { id: 'r5', title: 'Lipid Panel & Cholesterol Assessment', type: 'Lab Result', date: '2026-07-26', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ],
    prescriptions: [
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily bedtime' }
    ],
    allergies: ['Aspirin'],
    notes: 'Lipid panel monitoring scheduled in 90 days.'
  }
};

const analyticsTrendData = [
  { day: 'Mon', patients: 35, appointments: 28 },
  { day: 'Tue', patients: 48, appointments: 42 },
  { day: 'Wed', patients: 52, appointments: 45 },
  { day: 'Thu', patients: 61, appointments: 55 },
  { day: 'Fri', patients: 78, appointments: 68 },
  { day: 'Sat', patients: 45, appointments: 38 },
  { day: 'Sun', patients: 30, appointments: 22 },
];

const mockRecentAppointments = [
  { id: 1, name: 'Sarah Johnson', doctor: 'Dr. Brown', time: '10:30 PM', type: 'Consultation', status: 'Completed' },
  { id: 2, name: 'Michael Chen', doctor: 'Dr. Willams', time: '05:30 PM', type: 'Follow-up', status: 'Active' },
  { id: 3, name: 'Emma Davis', doctor: 'Dr. Gracia', time: '02:30 PM', type: 'Lab review', status: 'Pending' },
  { id: 4, name: 'James Wilson', doctor: 'Dr. Brown', time: '10:30 PM', type: 'Check-up', status: 'Completed' },
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'workstation' | 'patient-portal' | 'overview' | 'insights' | 'videos'>('patient-portal');
  const [analyticsFilter, setAnalyticsFilter] = useState<'7' | '30' | '90'>('90');

  // Dossier Modal State
  const [selectedPatient, setSelectedPatient] = useState<PatientDossierData | null>(null);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('medivault_user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      if (u.role?.toUpperCase() === 'PATIENT') {
        setActiveTab('patient-portal');
      } else {
        setActiveTab('workstation');
      }
    } else {
      setUser({
        id: 'PAT-1001',
        fullName: 'Nikhil Agarwal',
        email: 'nikhil.agarwal@example.com',
        role: 'PATIENT',
      } as User);
      setActiveTab('patient-portal');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  const handleOpenDossier = (patientName: string) => {
    const dossier = mockPatientDossiers[patientName] || mockPatientDossiers['Nikhil Agarwal'];
    setSelectedPatient(dossier);
    setDossierModalOpen(true);
  };

  if (!user) return <div className="loading-screen">Loading JeevanPath…</div>;

  const isPatient = user.role?.toUpperCase() === 'PATIENT';

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      pageTitle={isPatient ? 'My Health Dashboard' : 'Doctor Clinical Dashboard'}
      pageSubtitle={isPatient
        ? 'Your personal health records, appointments, prescriptions & reports — all in one secure place.'
        : 'Enterprise Clinical Workstation — Connected EHR, Patient Queue, Prescriptions & AI Insights'}
    >
      {/* Top View Mode Tabs for Doctors */}
      {!isPatient && (
        <div className="dashboard-view-selector" style={{ marginBottom: 20 }}>
          <button
            className={`dash-tab-btn ${activeTab === 'workstation' ? 'active' : ''}`}
            onClick={() => setActiveTab('workstation')}
          >
            <Stethoscope size={15} />
            🏥 Doctor Clinical Workstation
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'patient-portal' ? 'active' : ''}`}
            onClick={() => setActiveTab('patient-portal')}
          >
            <Users size={15} />
            👤 Patient Portal & 21 Modules
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <Video size={15} color="#EF4444" />
            🎥 Doctor Video Consults & Webinars
          </button>
        </div>
      )}

      {activeTab === 'patient-portal' ? (
        <PatientPortalWorkstation />
      ) : activeTab === 'workstation' ? (
        <DoctorClinicalWorkstation />
      ) : activeTab === 'videos' ? (
        <DoctorConsultancyVideos />
      ) : (
        <div className="dashboard-content-area">
          {/* Top 4 Stat Cards Row */}
          <div className="dash-stats-grid">
            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <div className="stat-icon-circle blue"><Users size={18} /></div>
              </div>
              <div className="stat-card-title">Total Patients</div>
              <div className="stat-card-sub">Active registered users</div>
              <div className="stat-card-value-row">
                <span className="stat-value">12.6k</span>
                <span className="stat-badge green"><ArrowUpRight size={12} /> +23%</span>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <div className="stat-icon-circle green"><Stethoscope size={18} /></div>
              </div>
              <div className="stat-card-title">Active Doctors</div>
              <div className="stat-card-sub">Available medical staff</div>
              <div className="stat-card-value-row">
                <span className="stat-value">324</span>
                <span className="stat-badge green"><ArrowUpRight size={12} /> +10%</span>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <div className="stat-icon-circle pink"><Calendar size={18} /></div>
              </div>
              <div className="stat-card-title">Today Appointments</div>
              <div className="stat-card-sub">Scheduled consultations</div>
              <div className="stat-card-value-row">
                <span className="stat-value">219</span>
                <span className="stat-badge green"><ArrowUpRight size={12} /> +13%</span>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <div className="stat-icon-circle dark"><FlaskConical size={18} /></div>
              </div>
              <div className="stat-card-title">Pending lab results</div>
              <div className="stat-card-sub">Awaiting review</div>
              <div className="stat-card-value-row">
                <span className="stat-value">45</span>
                <span className="stat-badge amber"><ArrowUpRight size={12} /> +64%</span>
              </div>
            </div>
          </div>

          {/* 2-Column Main Section */}
          <div className="dash-main-two-col">
            {/* Left Column: Recent Appointments with Interactive Patient Cards */}
            <div className="dash-card recent-appointments-card">
              <div className="dash-card-header">
                <div>
                  <h3 className="dash-card-title">Recent Appointments & Patient Records</h3>
                  <p className="typography-caption-md">Click any patient row to open full medical report & vitals dossier</p>
                </div>
                <div className="filter-dropdown-pill">
                  <span>Today</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              <div className="appointments-list-container">
                {mockRecentAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="apt-list-row"
                    onClick={() => handleOpenDossier(apt.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="apt-patient-info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={mockPatientDossiers[apt.name]?.avatar || mockPatientDossiers['Sarah Johnson'].avatar}
                        alt={apt.name}
                        style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="apt-patient-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>{apt.name}</span>
                          <Eye size={14} color="var(--mute)" />
                        </div>
                        <div className="apt-patient-doctor">
                          {apt.doctor} · {apt.time}
                        </div>
                      </div>
                    </div>

                    <div className="apt-type-col">{apt.type}</div>

                    <div className="apt-status-col" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {apt.status === 'Completed' && (
                        <span className="status-badge-pill green-solid">Completed</span>
                      )}
                      {apt.status === 'Active' && (
                        <span className="status-badge-pill green-outline">Active</span>
                      )}
                      {apt.status === 'Pending' && (
                        <span className="status-badge-pill amber-fill">Pending</span>
                      )}
                      <button
                        className="qa-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDossier(apt.name);
                        }}
                        style={{ height: 28, padding: '0 10px', fontSize: 11 }}
                      >
                        View Records
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Quick Actions & Patient Analytics */}
            <div className="dash-right-col-stack">
              {/* Quick Actions Card */}
              <div className="dash-card quick-actions-card">
                <h3 className="dash-card-title margin-bottom">Quick Actions</h3>

                <div className="quick-actions-list">
                  <div className="quick-action-row">
                    <div className="qa-left">
                      <div className="qa-icon-box blue"><UserPlus size={16} /></div>
                      <span className="qa-label">Add New Patient</span>
                    </div>
                    <button className="qa-btn" onClick={() => navigate('/documents/upload')}>Add</button>
                  </div>

                  <div className="quick-action-row">
                    <div className="qa-left">
                      <div className="qa-icon-box pink"><CalendarPlus size={16} /></div>
                      <span className="qa-label">Schedule Appointment</span>
                    </div>
                    <button className="qa-btn" onClick={() => navigate('/appointments')}>Add</button>
                  </div>

                  <div className="quick-action-row">
                    <div className="qa-left">
                      <div className="qa-icon-box green"><FlaskConical size={16} /></div>
                      <span className="qa-label">View Lab Results</span>
                    </div>
                    <button className="qa-btn" onClick={() => navigate('/documents')}>View</button>
                  </div>
                </div>
              </div>

              {/* Patient Analytics Card */}
              <div className="dash-card patient-analytics-card">
                <div className="dash-card-header">
                  <h3 className="dash-card-title">Patient Analytics</h3>
                  <div className="filter-time-pills">
                    <button
                      className={`time-pill ${analyticsFilter === '7' ? 'active' : ''}`}
                      onClick={() => setAnalyticsFilter('7')}
                    >
                      7 Days
                    </button>
                    <button
                      className={`time-pill ${analyticsFilter === '30' ? 'active' : ''}`}
                      onClick={() => setAnalyticsFilter('30')}
                    >
                      30 Days
                    </button>
                    <button
                      className={`time-pill ${analyticsFilter === '90' ? 'active' : ''}`}
                      onClick={() => setAnalyticsFilter('90')}
                    >
                      90 Days
                    </button>
                  </div>
                </div>

                <div className="analytics-chart-container">
                  <ResponsiveContainer width="100%" height={165}>
                    <AreaChart data={analyticsTrendData}>
                      <defs>
                        <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="patients"
                        stroke="#2563EB"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#patientGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* YouTube Doctor Consultancy & Health Webinars Section */}
          <DoctorConsultancyVideos />
        </div>
      )}

      {/* Patient Medical Dossier Modal Overlay */}
      <PatientDossierModal
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
        patient={selectedPatient}
      />
    </AppShell>
  );
}
