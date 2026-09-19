import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Users, Video, FileText, FlaskConical, Pill, Download,
  Activity, Heart, Zap, Award, Brain, Sparkles, AlertTriangle, ShieldCheck,
  Building2, QrCode, Shield, ChevronRight, Stethoscope
} from 'lucide-react';

interface ModuleItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  route: string;
  badge?: string;
  color: string;
}

interface ModuleCategory {
  category: string;
  description: string;
  items: ModuleItem[];
}

export default function PatientPortalModulesView() {
  const navigate = useNavigate();

  const moduleCategories: ModuleCategory[] = [
    {
      category: '1. Clinical Appointments & Scheduling',
      description: 'Consultation bookings, live queue tracking, doctor roster, and video consults',
      items: [
        { id: 'm1', name: 'Book Appointment', desc: 'Schedule doctor consultation', icon: <Calendar size={18} />, route: '/appointments', color: '#0284C7' },
        { id: 'm2', name: 'Queue Token Tracker', desc: 'Live position & estimated wait', icon: <Clock size={18} />, route: '/appointments', color: '#0EA5E9', badge: 'Active' },
        { id: 'm3', name: 'Doctor Roster & Schedule', desc: 'Physician availability shifts', icon: <Stethoscope size={18} />, route: '/availability', color: '#0284C7' },
        { id: 'm4', name: 'HD Video Consultations', desc: 'Join online telemedicine room', icon: <Video size={18} />, route: '/appointments', color: '#EF4444', badge: 'Live' }
      ]
    },
    {
      category: '2. Medical Records & Digital Dossier',
      description: 'Encrypted EHR timeline, lab reports, prescriptions, and PDF exports',
      items: [
        { id: 'm5', name: 'Medical Records Timeline', desc: 'Unified chronological EHR', icon: <FileText size={18} />, route: '/documents', color: '#0284C7' },
        { id: 'm6', name: 'Lab Report Vault', desc: 'CBC, Lipid & Pathology reports', icon: <FlaskConical size={18} />, route: '/documents', color: '#059669' },
        { id: 'm7', name: 'Prescription Manager', desc: 'Daily medication adherence', icon: <Pill size={18} />, route: '/documents', color: '#D97706' },
        { id: 'm8', name: 'Patient Dossier PDF', desc: 'Download consolidated summary', icon: <Download size={18} />, route: '/documents', color: '#6366F1' }
      ]
    },
    {
      category: '3. Biometrics & Vitals Analytics',
      description: 'Real-time blood pressure, fasting glucose, heart rate, and BMI health score',
      items: [
        { id: 'm9', name: 'Blood Pressure Log', desc: '120/80 mmHg optimal tracking', icon: <Heart size={18} />, route: '/health-analytics', color: '#DC2626' },
        { id: 'm10', name: 'Glucose & Glycemic Index', desc: 'Fasting & postprandial levels', icon: <Zap size={18} />, route: '/health-analytics', color: '#10B981' },
        { id: 'm11', name: 'Resting Heart Rate', desc: 'Continuous pulse monitoring', icon: <Activity size={18} />, route: '/health-analytics', color: '#0284C7' },
        { id: 'm12', name: 'Health Score & BMI Meter', desc: 'Calculated 92/100 health index', icon: <Award size={18} />, route: '/health-analytics', color: '#059669', badge: '92/100' }
      ]
    },
    {
      category: '4. AI Clinical Tools & Automation',
      description: 'Powered by Groq LLM Llama 3.3 for prescription OCR, assistant chat & drug safety',
      items: [
        { id: 'm13', name: 'Groq AI Prescription Scanner', desc: 'OCR & automatic drug parsing', icon: <Sparkles size={18} />, route: '/rx-scanner', color: '#0284C7', badge: 'Groq AI' },
        { id: 'm14', name: 'Groq AI Clinical Assistant', desc: 'Interactive 24/7 health chat', icon: <Brain size={18} />, route: '/dashboard', color: '#38BDF8' },
        { id: 'm15', name: 'Drug Interaction Safety', desc: 'Contraindication checker', icon: <ShieldCheck size={18} />, route: '/rx-scanner', color: '#059669' },
        { id: 'm16', name: 'Clinical Report Summarizer', desc: 'Translates lab jargon to clear text', icon: <FileText size={18} />, route: '/documents', color: '#6366F1' },
        { id: 'm17', name: 'Symptom Analyzer Engine', desc: 'Triage guidance & recommendations', icon: <Brain size={18} />, route: '/dashboard', color: '#0284C7' }
      ]
    },
    {
      category: '5. Emergency & Critical Care',
      description: 'One-click SOS ambulance dispatch, QR token vault, and ICU hospital finder',
      items: [
        { id: 'm18', name: 'Emergency SOS Broadcast', desc: 'One-click EMS ambulance alert', icon: <AlertTriangle size={18} />, route: '/emergency-access', color: '#DC2626', badge: 'CRITICAL' },
        { id: 'm19', name: 'Emergency QR Token Vault', desc: 'Offline blood group & allergy pass', icon: <QrCode size={18} />, route: '/emergency-access', color: '#DC2626' },
        { id: 'm20', name: 'Nearest ICU Trauma Centers', desc: 'Live ICU bed availability map', icon: <Building2 size={18} />, route: '/emergency-access', color: '#0F172A' },
        { id: 'm21', name: 'Health Insurance Policy Shield', desc: 'Star Health Premier Shield ID', icon: <Shield size={18} />, route: '/profile', color: '#059669' }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {moduleCategories.map((catGroup, idx) => (
        <div key={idx} style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>{catGroup.category}</h3>
            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>{catGroup.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {catGroup.items.map((mod) => (
              <div
                key={mod.id}
                onClick={() => navigate(mod.route)}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '1rem',
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${mod.color}15`,
                      color: mod.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {mod.icon}
                    </div>

                    {mod.badge && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 9999,
                        background: mod.color === '#DC2626' ? '#FEF2F2' : '#E0F2FE',
                        color: mod.color === '#DC2626' ? '#DC2626' : '#0284C7',
                        border: `1px solid ${mod.color}30`
                      }}>
                        {mod.badge}
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>{mod.name}</h4>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>{mod.desc}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: mod.color }}>
                  <span>Launch Module</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
