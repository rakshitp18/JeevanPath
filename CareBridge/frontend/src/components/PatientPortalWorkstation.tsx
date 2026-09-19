import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Activity, Calendar, Pill, FileText, FlaskConical, Brain, Video,
  GraduationCap, AlertTriangle, Search, Building2, ShieldCheck, FileCheck,
  Users, Bell, MessageSquare, CreditCard, Settings, Plus, Play, CheckCircle2,
  Clock, Download, Sparkles, PhoneCall, ChevronRight, X, Upload, Shield,
  Heart, Zap, Droplet, Dumbbell, Award, Share2, MapPin, Eye, Filter, RefreshCw,
  LayoutGrid, Stethoscope
} from 'lucide-react';
import { generateClinicalSummaryWithGroq } from '../services/groqService';
import { fetchDoctorConsultancyVideos, type DoctorVideoConsultancy } from '../services/youtubeService';
import PatientDossierModal, { type PatientDossierData } from './PatientDossierModal';
import PDFPreviewModal from './PDFPreviewModal';
import PatientPortalModulesView from './dashboard/PatientPortalModulesView';
import VideoPreviewCard from './dashboard/VideoPreviewCard';
import api from '../api';

export default function PatientPortalWorkstation() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const navigate = useNavigate();

  // Active Patient State
  const [patient, setPatient] = useState({
    id: 'PAT-1001',
    name: 'Nikhil Agarwal',
    age: 32,
    gender: 'Male',
    bloodGroup: 'O+',
    height: '175 cm',
    weight: '70 kg',
    bmi: '22.8',
    allergies: ['Penicillin', 'Salicylates/Aspirin'],
    chronicDiseases: ['Essential Hypertension'],
    vaccinationHistory: ['COVID-19 Booster (2025)', 'Tetanus (2024)', 'Influenza (2025)'],
    emergencyContact: 'Mark Agarwal (Brother) — +1 (555) 987-6543',
    insuranceProvider: 'Star Health Premier Shield',
    policyNumber: 'SH-992019482',
    languages: ['English', 'Hindi'],
    familyMembers: [
      { name: 'Rohan Agarwal', relation: 'Brother', age: 28 }
    ]
  });

  // Appointments State
  const [appointments, setAppointments] = useState([
    { id: 'APT-801', doctor: 'Dr. Milind Verma, MD', specialty: 'Cardiology', date: '2026-08-02', time: '10:00 AM', status: 'UPCOMING', mode: 'VIDEO_CONSULT', queuePos: 'Position #2' },
    { id: 'APT-790', doctor: 'Dr. Marcus Vance, MD', specialty: 'Neurology', date: '2026-07-20', time: '02:30 PM', status: 'COMPLETED', mode: 'IN_PERSON', queuePos: 'Completed' }
  ]);

  // Medicines State
  const [medicines, setMedicines] = useState([
    { id: 'm1', name: 'Metformin', dosage: '500mg', time: '8:00 AM & 8:00 PM', food: 'AFTER_MEAL', status: 'TAKEN', remaining: 24 },
    { id: 'm2', name: 'Lisinopril', dosage: '10mg', time: '9:00 AM', food: 'AFTER_MEAL', status: 'PENDING', remaining: 18 },
    { id: 'm3', name: 'Atorvastatin', dosage: '20mg', time: '10:00 PM', food: 'BEFORE_MEAL', status: 'PENDING', remaining: 30 }
  ]);

  // AI Chat & Extraction State
  const [aiChatQuery, setAiChatQuery] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: 'USER' | 'AI'; text: string }>>([
    { sender: 'AI', text: 'Hello Sarah! I am your JeevanPath Groq AI Health Assistant. How can I assist with your prescription, lab reports, or health guidance today?' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // YouTube Videos State
  const [learningVideos, setLearningVideos] = useState<DoctorVideoConsultancy[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    // Bind Patient Portal to current logged-in patient session for Privacy & Data Isolation
    const stored = localStorage.getItem('medivault_user');
    if (stored) {
      const u = JSON.parse(stored);
      if (u.fullName || u.name) {
        setPatient(prev => ({
          ...prev,
          id: u.id ? `PAT-${u.id}` : 'PAT-1001',
          name: u.fullName || u.name
        }));
        setAiChatMessages([
          { sender: 'AI', text: `Hello ${u.fullName || u.name}! I am your JeevanPath Groq AI Health Assistant. How can I assist with your personal prescriptions, lab reports, or health guidance today?` }
        ]);
      }
    }

    // Fetch patient data from API
    const fetchPatientData = async () => {
      try {
        const profileData: any = await api.get('/api/v1/patients/profile');
        if (profileData) {
          setPatient(prev => ({
            ...prev,
            id: profileData.patientId || prev.id,
            name: profileData.fullName || prev.name,
            age: profileData.age || prev.age,
            gender: profileData.gender || prev.gender,
            bloodGroup: profileData.bloodGroup || prev.bloodGroup,
            height: profileData.height || prev.height,
            weight: profileData.weight || prev.weight,
            allergies: profileData.allergies || prev.allergies,
            chronicDiseases: profileData.chronicConditions || prev.chronicDiseases,
            emergencyContact: profileData.emergencyContactName ? `${profileData.emergencyContactName} — ${profileData.emergencyContactPhone}` : prev.emergencyContact,
            insuranceProvider: profileData.insuranceProvider || prev.insuranceProvider,
            policyNumber: profileData.policyNumber || prev.policyNumber,
          }));
        }
      } catch (err) {
        console.log('Using default patient profile');
      }
    };

    fetchPatientData();

    // Load YouTube consultancy videos
    fetchDoctorConsultancyVideos('cardiology neurology doctor consultation').then(res => {
      setLearningVideos(res);
    });
  }, []);

  const handleQuickAction = (tabName: string) => {
    if (tabName === 'appointments') navigate('/appointments');
    else if (tabName === 'rx-scanner') navigate('/rx-scanner');
    else if (tabName === 'labs') navigate('/documents');
    else if (tabName === 'ai-assistant') setActiveTab('ai-assistant');
    else if (tabName === 'find-doctor') navigate('/appointments');
    else if (tabName === 'emergency') navigate('/emergency-access');
    else setActiveTab(tabName);
  };

  return (
    <div className="patient-portal-workstation" style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 16 }}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, background: '#0F172A', color: '#ffffff',
          padding: '12px 20px', borderRadius: 24, fontSize: 13, fontWeight: 600, zIndex: 9999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Sparkles size={16} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Patient Greeting & AI Assist Hero Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Left Card: Greeting */}
            <div style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)',
              color: '#0F172A',
              padding: '28px 32px',
              borderRadius: '1.5rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 30px -5px rgba(2, 132, 199, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-60px', right: '-60px', width: '240px', height: '240px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
                pointerEvents: 'none'
              }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt={patient.name}
                    style={{
                      width: 60, height: 60, borderRadius: '50%', border: '2px solid #0EA5E9', objectFit: 'cover',
                      boxShadow: '0 4px 14px rgba(14, 165, 233, 0.25)'
                    }}
                  />
                  <div>
                    <span style={{
                      background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0',
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: '9999px',
                      letterSpacing: '0.04em', display: 'inline-block'
                    }}>
                      HEALTH SCORE: 92/100
                    </span>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: '6px 0 0', letterSpacing: '-0.02em' }}>
                      Welcome back, {patient.name}
                    </h2>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: '#475569', fontWeight: 500, lineHeight: 1.6 }}>
                  Patient ID: <strong style={{ color: '#0F172A' }}>{patient.id}</strong> • {patient.age} yrs, {patient.gender} • Blood Group: <strong style={{ color: '#0F172A' }}>{patient.bloodGroup}</strong> • Policy: {patient.insuranceProvider}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/emergency-access')}
                  style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#ffffff',
                    border: 'none', borderRadius: '9999px', padding: '10px 20px', fontWeight: 700,
                    fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <AlertTriangle size={15} />
                  <span>EMERGENCY SOS</span>
                </button>
                <button
                  onClick={() => navigate('/rx-scanner')}
                  style={{
                    background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)', color: '#ffffff',
                    border: 'none', borderRadius: '9999px', padding: '10px 20px', fontWeight: 700,
                    fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  <Brain size={15} />
                  <span>Groq AI Rx Scanner →</span>
                </button>
              </div>
            </div>

            {/* Right Card: AI Assist Banner */}
            <div style={{
              borderRadius: '1.5rem', overflow: 'hidden', background: '#FFFFFF',
              border: '1px solid #E2E8F0', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
              display: 'flex', flexDirection: 'column', position: 'relative', minHeight: '280px'
            }}>
              <div style={{
                height: '150px', width: '100%', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '20px'
              }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.4) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.5)', boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Brain size={38} color="#38BDF8" />
                </div>

                <span style={{
                  position: 'absolute', top: '14px', right: '14px', background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)', color: '#38BDF8', fontSize: '11px', fontWeight: 700,
                  padding: '3px 10px', borderRadius: '9999px', border: '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  MEDIVAULT AI
                </span>
              </div>

              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>
                    Make AI Work for You
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                    Instant AI extraction for prescriptions, clinical insights, and medication adherence.
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => navigate('/rx-scanner')}
                    style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0 }}
                  >
                    <span>Launch Groq AI Scanner</span>
                    <span style={{ fontSize: '16px' }}>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div style={{ background: '#FFFFFF', padding: 20, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 14px -2px rgba(0,0,0,0.03)' }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              QUICK HEALTH ACTIONS
            </h4>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'Book Appointment', icon: Calendar, tab: 'appointments' },
                { label: 'Upload Prescription', icon: Sparkles, tab: 'rx-scanner' },
                { label: 'Upload Lab Report', icon: FlaskConical, tab: 'labs' },
                { label: 'Chat with Groq AI', icon: Brain, tab: 'ai-assistant' },
                { label: 'Find Specialist Doctor', icon: Stethoscope, tab: 'find-doctor' },
                { label: 'Emergency SOS', icon: AlertTriangle, tab: 'emergency' }
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleQuickAction(act.tab)}
                    className="topbar-action-pill topbar-pill-outline"
                    style={{ height: 38, fontSize: 12 }}
                  >
                    <Icon size={14} />
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Dashboard Stat Cards */}
          <div className="dash-stats-grid">
            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <div className="stat-icon-circle blue"><Calendar size={18} /></div>
              </div>
              <div className="stat-card-title">Next Appointment</div>
              <div className="stat-card-sub">Dr. Sarah Jenkins (Cardiology)</div>
              <div className="stat-card-value-row">
                <span className="stat-value" style={{ fontSize: 18 }}>Aug 02, 10:00 AM</span>
                <span className="stat-badge green">Video Consult</span>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <div className="stat-icon-circle green"><Pill size={18} /></div>
              </div>
              <div className="stat-card-title">Today's Medicines</div>
              <div className="stat-card-sub">2 of 3 doses completed</div>
              <div className="stat-card-value-row">
                <span className="stat-value" style={{ fontSize: 18 }}>Lisinopril 10mg</span>
                <span className="stat-badge amber">Due 9:00 AM</span>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <div className="stat-icon-circle dark"><Activity size={18} /></div>
              </div>
              <div className="stat-card-title">Blood Pressure</div>
              <div className="stat-card-sub">Last logged 2 hrs ago</div>
              <div className="stat-card-value-row">
                <span className="stat-value" style={{ fontSize: 18 }}>120/80 mmHg</span>
                <span className="stat-badge green">Normal</span>
              </div>
            </div>

            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <div className="stat-icon-circle pink"><FlaskConical size={18} /></div>
              </div>
              <div className="stat-card-title">Recent Lab Report</div>
              <div className="stat-card-sub">CBC & Lipid Profile</div>
              <div className="stat-card-value-row">
                <span className="stat-value" style={{ fontSize: 18 }}>Completed</span>
                <span className="stat-badge green">Reviewed</span>
              </div>
            </div>
          </div>

          {/* Modernized Video Consult Entry Point Card */}
          <VideoPreviewCard
            previewVideos={learningVideos}
            onExplore={() => navigate('/videos')}
          />

          {/* Categorized 21 Modules Grid View */}
          <PatientPortalModulesView />

          {/* AI Health Tip Banner */}
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', padding: 18, borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#047857', fontWeight: 700, fontSize: 14 }}>
              <Sparkles size={16} />
              <span>GROQ AI PERSONALIZED DAILY HEALTH TIP</span>
            </div>
            <p style={{ fontSize: 13, color: '#0F172A', margin: '6px 0 0', lineHeight: 1.5, fontWeight: 500 }}>
              "Your BP logs demonstrate optimal stability at 120/80 mmHg. Maintain a low-sodium diet (&lt; 2g/day) and schedule 30 minutes of aerobic walking before your upcoming consultation with Dr. Sarah Jenkins."
            </p>
          </div>
    </div>
  );
}
