import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Lock, Cpu, QrCode,
  HeartPulse, Shield, FileText, Activity, Zap, Check, X, User, Stethoscope
} from 'lucide-react';
import api from '../api';
import Navbar from '../components/Navbar';

const SectionBadge = ({ text }: { text: string }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    padding: '6px 18px', borderRadius: '9999px',
    background: '#ECFDF5', border: '1px solid #A7F3D0',
    fontSize: '11px', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#047857',
    marginBottom: '16px'
  }}>
    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s infinite' }} />
    <span>{text}</span>
  </div>
);

interface LandingProps {
  initialAuthModal?: boolean;
  initialAuthMode?: 'login' | 'signup';
  initialRole?: 'patient' | 'doctor';
}

export default function Landing({ initialAuthModal = false, initialAuthMode = 'login', initialRole = 'patient' }: LandingProps) {
  const navigate = useNavigate();

  // Quick Consultation Booking Form State
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '' });
  const [bookingSuccessModal, setBookingSuccessModal] = useState<boolean>(false);

  // Sign In / Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState<boolean>(initialAuthModal);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>(initialAuthMode);
  const [modalRole, setModalRole] = useState<'patient' | 'doctor'>(initialRole);
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [authEmail, setAuthEmail] = useState('patient@medivault.io');
  const [authPassword, setAuthPassword] = useState('PatientPass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [medRegNo, setMedRegNo] = useState('REG-12345');
  const [qualification, setQualification] = useState('MBBS, MD');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (initialAuthModal) {
      setShowAuthModal(true);
      setAuthMode(initialAuthMode);
      setModalRole(initialRole);
    }
  }, [initialAuthModal, initialAuthMode, initialRole]);

  const handleModalAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);
    try {
      if (authMode === 'signup') {
        const endpoint = modalRole === 'doctor' ? '/api/v1/auth/register/doctor' : '/api/v1/auth/register/patient';
        const payload: any = { fullName, email: authEmail, password: authPassword };
        if (modalRole === 'doctor') {
          payload.medicalRegistrationNumber = medRegNo;
          payload.qualification = qualification;
          payload.specialization = specialization;
        }
        await api.post(endpoint, payload);
        const data: any = await api.post('/api/v1/auth/login', { email: authEmail, password: authPassword });
        const token = data?.accessToken || data?.token;
        if (token) localStorage.setItem('medivault_token', token);
        if (data?.user) localStorage.setItem('medivault_user', JSON.stringify(data.user));
        setShowAuthModal(false);
        navigate('/dashboard');
      } else {
        const data: any = await api.post('/api/v1/auth/login', { email: authEmail, password: authPassword });
        const token = data?.accessToken || data?.token;
        if (token) localStorage.setItem('medivault_token', token);
        if (data?.user) localStorage.setItem('medivault_user', JSON.stringify(data.user));
        setShowAuthModal(false);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setModalError(err instanceof Error ? err.message : (typeof err === 'string' ? err : 'Authentication failed'));
    } finally {
      setModalLoading(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone) return;
    setBookingSuccessModal(true);
  };

  return (
    <div style={{ background: '#FFFFFF', color: '#0F172A', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      
      {/* ── UNIFIED STICKY NAVIGATION BAR ── */}
      <Navbar
        activeTab="Home"
        onOpenAuthModal={(role, mode, email) => {
          setModalRole(role || 'patient');
          setAuthMode(mode || 'login');
          if (email) setAuthEmail(email);
          setModalError('');
          setShowAuthModal(true);
        }}
      />

      {/* ── HERO SECTION WITH FLOATING OVERLAY BOOKING BAR ── */}
      <section id="hero" style={{ padding: '60px 32px 100px', maxWidth: '1380px', margin: '0 auto', textAlign: 'center' }}>
        <SectionBadge text="Next-Generation Healthcare Ecosystem" />

        <h1 style={{ fontSize: '64px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1, letterSpacing: '-1.5px', maxWidth: '980px', margin: '0 auto 24px' }}>
          Your Health Records, <br />
          <span style={{ background: 'linear-gradient(135deg, #059669 0%, #0284C7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Specialist Doctors</span>, Instant Care.
        </h1>

        <p style={{ fontSize: '18px', color: '#475569', lineHeight: 1.7, maxWidth: '760px', margin: '0 auto 48px' }}>
          Store lifetime medical reports in an AES-256 encrypted vault, consult with board-certified specialist doctors, and generate cryptographic emergency QR cards for instant first-responder access.
        </p>

        {/* Hero Photo Banner & Floating Consultation Overlay */}
        <div style={{ position: 'relative', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)', background: '#E2E8F0', marginBottom: '20px' }}>
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80"
            alt="JeevanPath Healthcare Platform"
            style={{ width: '100%', height: '520px', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.45) 0%, transparent 60%)' }} />

          {/* Floating Booking Overlay Bar */}
          <div style={{
            position: 'absolute', bottom: '32px', left: '32px', right: '32px',
            background: 'rgba(255, 255, 255, 0.94)', backdropFilter: 'blur(20px)',
            borderRadius: '28px', padding: '24px 32px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
                ⚡ 24/7 SPECIALIST TELE-CONSULTATION
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>
                Connect with 50+ Verified Doctors Online
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                style={{ padding: '12px 18px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '14px', color: '#0F172A', outline: 'none', width: '180px' }}
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={bookingForm.email}
                onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                style={{ padding: '12px 18px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '14px', color: '#0F172A', outline: 'none', width: '220px' }}
              />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={bookingForm.phone}
                onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                style={{ padding: '12px 18px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '14px', color: '#0F172A', outline: 'none', width: '160px' }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 28px', borderRadius: '14px', background: '#059669', color: '#FFFFFF',
                  fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 18px rgba(5, 150, 105, 0.3)'
                }}
              >
                <span>Book Slot</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── HOW JEEVANPATH WORKS (3-STEP CARE WORKFLOW) ── */}
      <section style={{ padding: '80px 32px 100px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <SectionBadge text="Unified Healthcare Workflow" />
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            How JeevanPath Powers Digital Care
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '640px', margin: '0 auto 56px', lineHeight: 1.6 }}>
            A seamless three-step platform connecting patients, AI diagnostics engines, and emergency medical teams.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              {
                step: '01',
                title: 'Upload & Encrypt Records',
                desc: 'Store lab reports, blood panels, and prescriptions in a zero-knowledge AES-256 cryptographic vault.',
                icon: Lock,
                color: '#0284C7'
              },
              {
                step: '02',
                title: 'AI Diagnostic Bio-Scan',
                desc: 'Our Groq Llama 3.3 engine parses diagnostic data in under 0.4 seconds to highlight out-of-range biomarkers.',
                icon: Cpu,
                color: '#059669'
              },
              {
                step: '03',
                title: 'Emergency QR & Consult',
                desc: 'Generate offline emergency QR cards for paramedics or book 1-click video consultations with specialists.',
                icon: QrCode,
                color: '#7C3AED'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF', borderRadius: '28px', border: '1px solid #E2E8F0', padding: '36px 28px',
                    textAlign: 'left', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = item.color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                >
                  <div style={{ fontSize: '48px', fontWeight: 900, color: `${item.color}20`, lineHeight: 1, marginBottom: '16px' }}>
                    {item.step}
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <Icon size={24} color={item.color} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECURITY & REGULATORY COMPLIANCE ── */}
      <section style={{ padding: '90px 32px', background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 100%)', color: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '8px 20px', borderRadius: '9999px', fontSize: '12px', fontWeight: 800, color: '#34D399', marginBottom: '24px' }}>
            <ShieldCheck size={16} />
            <span>ENTERPRISE-GRADE MEDICAL DATA PRIVACY</span>
          </div>

          <h2 style={{ fontSize: '44px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-1px' }}>
            Built on Uncompromising Security Standards
          </h2>
          <p style={{ fontSize: '17px', color: '#CBD5E1', maxWidth: '700px', margin: '0 auto 56px', lineHeight: 1.6 }}>
            Your health records are protected with bank-grade encryption algorithms and full international compliance.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {[
              { title: 'AES-256 Encryption', desc: 'Zero-knowledge data encryption at rest and in transit.' },
              { title: 'HIPAA & GDPR Certified', desc: 'Strict global compliance for electronic health record privacy.' },
              { title: 'Role-Based Access', desc: 'Granular permissions for authorized specialist doctors.' },
              { title: 'Immutable Audit Trail', desc: 'Real-time logs of every medical record access event.' }
            ].map((box, idx) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', padding: '28px', textAlign: 'left' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <CheckCircle2 size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px' }}>{box.title}</h3>
                <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE FOOTER ── */}
      <footer style={{ background: '#0F172A', color: '#94A3B8', paddingTop: '80px', paddingBottom: '40px', paddingLeft: '32px', paddingRight: '32px' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>© 2026 JeevanPath AI Healthcare Network. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/services')}>Services</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/global-network')}>Global Network</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/doctors')}>Doctors</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/reviews')}>Reviews</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/faq')}>FAQ</span>
          </div>
        </div>
      </footer>

      {/* ── SPLIT AUTH MODAL WITH ANIMATED ECG TELEMETRY ── */}
      {showAuthModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuthModal(false);
          }}
        >
          <div style={{
            maxWidth: '960px', width: '100%',
            background: '#FFFFFF', borderRadius: '32px',
            overflow: 'hidden', display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.38)',
            position: 'relative', border: '1px solid rgba(255,255,255,0.2)'
          }}>
            
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute', top: '18px', right: '18px', zIndex: 20,
                background: '#F1F5F9', border: 'none',
                borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#E2E8F0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#F1F5F9'}
            >
              <X size={18} color="#0F172A" />
            </button>

            <div 
              style={{
                padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0284C7', marginBottom: '1px' }}>
                JeevanPath
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', lineHeight: 1.15, marginBottom: '2px', letterSpacing: '-0.5px' }}>
                {authMode === 'signup' ? `Create ${modalRole === 'patient' ? 'Patient' : 'Doctor'} Account` : `Sign In as ${modalRole === 'patient' ? 'Patient' : 'Doctor'}`}
              </h2>
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.3, marginBottom: '12px' }}>
                {authMode === 'signup' ? 'Get started with JeevanPath in seconds.' : 'Access your health records securely from anywhere.'}
              </p>

              {/* Unified Role Selection Cards (Patient vs Doctor) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div
                  onClick={() => {
                    setModalRole('patient');
                    setAuthEmail('patient@medivault.io');
                    setAuthPassword('PatientPass123!');
                    setModalError('');
                  }}
                  style={{
                    padding: '10px 14px', borderRadius: '16px', cursor: 'pointer',
                    border: modalRole === 'patient' ? '2px solid #059669' : '1px solid #E2E8F0',
                    background: modalRole === 'patient' ? '#ECFDF5' : '#FFFFFF',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: modalRole === 'patient' ? '0 4px 14px rgba(5, 150, 105, 0.15)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: modalRole === 'patient' ? '#059669' : '#F1F5F9',
                    color: modalRole === 'patient' ? '#FFFFFF' : '#64748B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <User size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: modalRole === 'patient' ? '#047857' : '#0F172A' }}>Patient</div>
                    <div style={{ fontSize: '10px', color: modalRole === 'patient' ? '#059669' : '#64748B', fontWeight: 600, lineHeight: 1.1 }}>Manage health records</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setModalRole('doctor');
                    setAuthEmail('doctor@medivault.io');
                    setAuthPassword('DoctorPass123!');
                    setModalError('');
                  }}
                  style={{
                    padding: '10px 14px', borderRadius: '16px', cursor: 'pointer',
                    border: modalRole === 'doctor' ? '2px solid #0284C7' : '1px solid #E2E8F0',
                    background: modalRole === 'doctor' ? '#F0F9FF' : '#FFFFFF',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: modalRole === 'doctor' ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: modalRole === 'doctor' ? '#0284C7' : '#F1F5F9',
                    color: modalRole === 'doctor' ? '#FFFFFF' : '#64748B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Stethoscope size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: modalRole === 'doctor' ? '#0369A1' : '#0F172A' }}>Doctor</div>
                    <div style={{ fontSize: '10px', color: modalRole === 'doctor' ? '#0284C7' : '#64748B', fontWeight: 600, lineHeight: 1.1 }}>Access patient records</div>
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {modalError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚠️</span> {modalError}
                </div>
              )}

              {/* Registration / Login Form */}
              <form onSubmit={handleModalAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {authMode === 'signup' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '2px' }}>
                      Full name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '2px' }}>
                    Email <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@email.com"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '2px' }}>
                    Password <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ width: '100%', padding: '8px 34px 8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                    >
                      <Activity size={14} />
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && modalRole === 'doctor' && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '2px' }}>
                        Medical Reg Number <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={medRegNo}
                        onChange={(e) => setMedRegNo(e.target.value)}
                        placeholder="REG-12345"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '2px' }}>
                          Qualification <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          placeholder="MBBS, MD"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '2px' }}>
                          Specialization <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          placeholder="Cardiology"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #CBD5E1', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={modalLoading}
                  style={{
                    padding: '11px', borderRadius: '12px',
                    background: '#2563EB',
                    color: '#FFFFFF', fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
                    marginTop: '4px', opacity: modalLoading ? 0.7 : 1, transition: 'all 0.15s'
                  }}
                >
                  <span>{modalLoading ? 'Processing...' : (authMode === 'signup' ? 'Create Account' : 'Sign In')}</span>
                  {!modalLoading && <ArrowRight size={15} />}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#64748B' }}>
                {authMode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                <span
                  onClick={() => {
                    setAuthMode(authMode === 'signup' ? 'login' : 'signup');
                    setModalError('');
                  }}
                  style={{ color: '#2563EB', fontWeight: 800, cursor: 'pointer' }}
                >
                  {authMode === 'signup' ? 'Sign in' : 'Create Account'}
                </span>
              </div>
            </div>

            {/* Right Panel: Sleek Glassmorphism & Pure Animated ECG Showcase */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(6, 78, 59, 0.92) 100%)',
              backdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '36px 30px', color: '#FFFFFF',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              position: 'relative', overflow: 'hidden'
            }}>
              <div>
                {/* Subtle Refined Pill Badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(52, 211, 153, 0.1)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  padding: '5px 14px', borderRadius: '9999px',
                  fontSize: '11px', fontWeight: 800, letterSpacing: '0.8px', color: '#34D399',
                  marginBottom: '20px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399', animation: 'pulse 1.5s infinite' }} />
                  REAL-TIME BIO-TELEMETRY
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1.25, color: '#FFFFFF', marginBottom: '10px', letterSpacing: '-0.3px' }}>
                  Encrypted Health Records & Vault
                </h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.55, marginBottom: '28px' }}>
                  AES-256 zero-knowledge vault protecting diagnostic reports, blood panels, and emergency QR cards.
                </p>

                {/* Pure Glassmorphic ECG Telemetry Waveform Box (No Text) */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px 20px',
                  marginBottom: '28px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="100%" height="40" viewBox="0 0 240 40" fill="none">
                    <path
                      d="M0,20 L40,20 L48,6 L56,34 L64,10 L72,28 L80,20 L130,20 L138,6 L146,34 L154,10 L162,28 L170,20 L240,20"
                      stroke="#34D399"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 500,
                        strokeDashoffset: 500,
                        animation: 'ecgPulse 2.8s linear infinite',
                        filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.5))'
                      }}
                    />
                  </svg>
                </div>
              </div>

              {/* Refined Feature Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', fontWeight: 700, color: '#CBD5E1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={16} color="#34D399" />
                  <span>AES-256 Zero-Knowledge Encrypted Vault</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Zap size={16} color="#34D399" />
                  <span>Groq Llama 3.3 Sub-Second AI Analysis</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HeartPulse size={16} color="#34D399" />
                  <span>24/7 Board-Certified Specialist Network</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Booking Confirmation Success Modal */}
      {bookingSuccessModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '28px', maxWidth: '440px', width: '100%', padding: '32px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>Slot Requested!</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
              Thank you, {bookingForm.name}. A confirmation link has been sent to {bookingForm.email}.
            </p>
            <button
              onClick={() => setBookingSuccessModal(false)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#059669', color: '#FFFFFF', fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
