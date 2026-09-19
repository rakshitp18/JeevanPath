import { useState } from 'react';
import {
  Heart, Activity, Droplet, Zap, Search, Bell, UserPlus,
  Calendar, CheckCircle2, ChevronRight, AlertCircle, ArrowUpRight, Sparkles, ShieldCheck
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

const bloodStatusData = [
  { val: 60 }, { val: 80 }, { val: 45 }, { val: 90 }, { val: 110 }, { val: 75 }, { val: 95 }, { val: 116 }
];

const heartRateData = [
  { val: 120 }, { val: 140 }, { val: 110 }, { val: 165 }, { val: 150 }, { val: 175 }, { val: 160 }
];

const bloodCountData = [
  { val: 40 }, { val: 65 }, { val: 50 }, { val: 85 }, { val: 70 }, { val: 90 }
];

const glucoseData = [
  { val: 90 }, { val: 95 }, { val: 92 }, { val: 98 }, { val: 94 }, { val: 95 }
];

export default function PatientInsightsMap() {
  const [selectedBodyPart, setSelectedBodyPart] = useState('Chest & Cardiac Structure');

  // Load current user context
  const stored = localStorage.getItem('medivault_user');
  const user = stored ? JSON.parse(stored) : null;
  const patientName = user?.fullName || user?.name || 'Sarah Johnson';
  const doctorName = user?.role === 'DOCTOR' ? (user?.fullName || user?.name) : 'Dr. Sarah Jenkins, MD';

  return (
    <div style={{ maxWidth: 1100, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header Bar & Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#FFFFFF',
        padding: '16px 24px',
        borderRadius: '1.25rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: '#64748B' }}>
          <span>Patients</span>
          <ChevronRight size={16} color="#94A3B8" />
          <span style={{ color: '#0F172A', fontWeight: 800 }}>{patientName}</span>
          <span style={{ fontSize: 11, background: '#E0F2FE', color: '#0284C7', padding: '2px 8px', borderRadius: 9999, marginLeft: 6 }}>
            ID #PAT-1001
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 600, color: '#475569' }}>
            <Calendar size={14} color="#0284C7" />
            <span>August 05, 2026</span>
          </div>
          <button style={{
            background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
          }}>
            Generate Clinical Report
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Left Column: Body Map & AI Insights Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* AI Health Banner */}
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '1.25rem',
            padding: '20px',
            boxShadow: '0 4px 14px -2px rgba(16, 185, 129, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#047857', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>
              <Sparkles size={18} />
              <span>GROQ AI BIOMETRIC INSIGHT ENGINE</span>
            </div>
            <p style={{ fontSize: 13, color: '#0F172A', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              Physiological cardiac parameters indicate stable recovery. ECG sinus rhythm verified at 72 bpm.
            </p>
          </div>

          {/* Body Map Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '1.25rem',
            padding: '24px',
            boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>Anatomical Body Map & Regional Insights</h3>
              <span style={{ fontSize: 11, fontWeight: 700, background: '#F1F5F9', color: '#0284C7', padding: '3px 10px', borderRadius: 9999 }}>
                Interactive Vector
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0' }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: '#0284C7', color: '#FFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                C
              </span>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', display: 'block' }}>{selectedBodyPart}</span>
                <span style={{ fontSize: 11, color: '#64748B' }}>Aortic Diameter: <strong>2.4 cm</strong> (Normal Range)</span>
              </div>
            </div>

            {/* Anatomical Human Body Vector Map */}
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', padding: 10 }}>
              <svg viewBox="0 0 280 400" style={{ height: '100%', width: 'auto' }}>
                {/* Silhouette head & neck */}
                <ellipse cx="140" cy="45" rx="22" ry="28" fill="#CBD5E1" />
                <rect x="133" y="70" width="14" height="20" rx="4" fill="#CBD5E1" />

                {/* Torso background */}
                <path d="M 95 90 C 110 85, 170 85, 185 90 L 195 190 C 180 200, 100 200, 85 190 Z" fill="#94A3B8" opacity="0.3" />

                {/* Active Chest Region */}
                <path d="M 110 95 L 170 95 L 180 145 C 160 175, 120 175, 100 145 Z" fill="#0EA5E9" opacity="0.85" />
                <path d="M 125 95 L 155 95 L 140 135 Z" fill="#10B981" />

                {/* Arms */}
                <path d="M 90 90 L 70 170 L 60 230 L 70 230 L 82 175 L 98 105 Z" fill="#CBD5E1" />
                <path d="M 190 90 L 210 170 L 220 230 L 210 230 L 198 175 L 182 105 Z" fill="#CBD5E1" />

                {/* Pelvis & Legs */}
                <path d="M 100 190 L 115 310 L 110 380 L 125 380 L 133 300 L 140 195 Z" fill="#CBD5E1" />
                <path d="M 180 190 L 165 310 L 170 380 L 155 380 L 147 300 L 140 195 Z" fill="#CBD5E1" />

                {/* Anatomical Nodes */}
                <circle cx="140" cy="115" r="5" fill="#FFFFFF" />
                <circle cx="120" cy="130" r="5" fill="#FFFFFF" />
                <circle cx="160" cy="130" r="5" fill="#FFFFFF" />
                <circle cx="140" cy="155" r="5" fill="#FFFFFF" />
                <circle cx="110" cy="220" r="4" fill="#FFFFFF" opacity="0.8" />
                <circle cx="170" cy="220" r="4" fill="#FFFFFF" opacity="0.8" />
              </svg>
            </div>

            {/* Health Meter Progress */}
            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>JeevanPath Central Clinic</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>● Normal Vitals</span>
              </div>
              <div style={{ width: '100%', height: 8, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #0284C7 0%, #10B981 100%)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Vitals Cards & Prescribed Regimen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Patient Overview Header Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '1.25rem',
            padding: 20,
            boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
              alt={patientName}
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284C7' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>{patientName}</h3>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Attending: <strong>{doctorName}</strong></span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: '#ECFDF5', color: '#059669', padding: '3px 10px', borderRadius: 9999 }}>
                  Blood Group: O+
                </span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: '#475569' }}>
                <span>Age: <strong>32 yrs</strong></span>
                <span>Sex: <strong>Female</strong></span>
                <span>Policy: <strong>Star Health</strong></span>
              </div>
            </div>
          </div>

          {/* 4 Vitals Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {/* 1. Blood Pressure */}
            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <span className="stat-card-title">Blood Pressure</span>
              </div>
              <div className="stat-card-value-row">
                <span className="stat-value">120/80</span>
                <span className="stat-badge green">Normal</span>
              </div>
            </div>

            {/* 2. Heart Rate */}
            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <span className="stat-card-title">Heart Rate</span>
              </div>
              <div className="stat-card-value-row">
                <span className="stat-value">72 bpm</span>
                <span className="stat-badge green">Normal</span>
              </div>
            </div>

            {/* 3. Blood Count */}
            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <span className="stat-card-title">Blood Count (Hb)</span>
              </div>
              <div className="stat-card-value-row">
                <span className="stat-value">14.2 g/dL</span>
                <span className="stat-badge green">Optimal</span>
              </div>
            </div>

            {/* 4. Glucose Level */}
            <div className="stat-card-modern">
              <div className="stat-card-top-row">
                <span className="stat-card-title">Glucose (Fasting)</span>
              </div>
              <div className="stat-card-value-row">
                <span className="stat-value">95 mg/dL</span>
                <span className="stat-badge green">Normal</span>
              </div>
            </div>
          </div>

          {/* Active Medication Regimen Card */}
          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 14px' }}>Prescribed Active Regimen</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily morning', status: 'Active' },
                { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily after meal', status: 'Active' },
                { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily bedtime', status: 'Active' }
              ].map((med, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                  <div>
                    <h5 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>{med.name} ({med.dosage})</h5>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{med.frequency}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: 9999 }}>
                    {med.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
