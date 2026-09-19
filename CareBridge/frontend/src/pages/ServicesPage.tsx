import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, HeartPulse, FileText, QrCode, Stethoscope,
  Building2, CheckCircle2, ArrowRight, Activity, Zap, Play, Search,
  Sliders, Shield, Lock, FileSpreadsheet, Cpu, ChevronRight, Check
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Services');
  const [selectedReport, setSelectedReport] = useState<'ecg' | 'cbc' | 'mri'>('ecg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Auth modal state for header sign in
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRole, setAuthRole] = useState<'patient' | 'doctor'>('patient');

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisDone(false);
    setAnalysisProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setAnalysisProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsAnalyzing(false);
        setAnalysisDone(true);
      }
    }, 180);
  };

  const servicesData = [
    {
      id: 'ai-analyzer',
      category: 'AI Diagnostics',
      title: 'Groq Llama 3.3 Sub-Second AI Report Analyzer',
      tag: 'FASTEST CLINICAL AI',
      desc: 'Instant diagnostic breakdown of complex blood work, lab panels, ECG telemetry, and radiology notes in under 0.4 seconds with 99.4% accuracy.',
      icon: Cpu,
      color: '#0284C7',
      features: ['Sub-second processing time', '99.4% diagnostic accuracy', 'Plain-English medical summary', 'Critical risk score highlighting']
    },
    {
      id: 'cloud-vault',
      category: 'Cloud Vault',
      title: 'AES-256 Cryptographic Health Record Vault',
      tag: 'HIPAA & GDPR COMPLIANT',
      desc: 'Zero-knowledge encrypted cloud storage for lifetime health records, prescription histories, diagnostic images, and doctor notes.',
      icon: Lock,
      color: '#059669',
      features: ['Zero-knowledge encryption', 'Instant QR emergency access', 'Audit log of doctor views', 'Unlimited file uploads']
    },
    {
      id: 'emergency-qr',
      category: 'Emergency Access',
      title: 'Universal Emergency QR & Trauma Telemetry Card',
      tag: 'LIFE-SAVING FEATURE',
      desc: 'Generates a secure offline emergency QR code that first responders and ER doctors can scan to instantly view blood group, allergies, and emergency contacts.',
      icon: QrCode,
      color: '#DC2626',
      features: ['Offline scan support', 'Paramedic emergency protocol', 'Instant SMS to kin upon scan', 'PIN-protected medical details']
    },
    {
      id: 'teleconsult',
      category: 'Telemedicine',
      title: '24/7 HD Specialist Video Teleconsultation',
      tag: 'INSTANT CONNECT',
      desc: 'Connect with board-certified cardiologists, neurologists, and pediatricians within 5 minutes over end-to-end encrypted video calls.',
      icon: HeartPulse,
      color: '#7C3AED',
      features: ['Instant 5-minute wait time', 'E-Prescription delivery', 'Integrated vital tracking', 'Multi-language support']
    },
    {
      id: 'hospital-dir',
      category: 'Doctor Directory',
      title: 'Integrated Hospital & Specialist Workstation',
      tag: '500+ CENTERS',
      desc: 'Direct appointment scheduling with top multi-specialty hospitals, verified doctor availability calendars, and transparent fee schedules.',
      icon: Building2,
      color: '#D97706',
      features: ['Real-time slot availability', 'Verified practitioner credentials', 'Hospital ICU bed counter', 'Insurance pre-approval check']
    },
    {
      id: 'rx-scanner',
      category: 'AI Diagnostics',
      title: 'Automated Rx Prescription & Pill Scanner',
      tag: 'COMPUTER VISION',
      desc: 'AI computer vision engine that reads handwritten doctor prescriptions, extracts medicine dosages, and sets up automated daily reminder schedules.',
      icon: FileSpreadsheet,
      color: '#2563EB',
      features: ['Handwriting OCR recognition', 'Drug interaction warnings', 'Automated refill reminders', 'Generic alternative finder']
    }
  ];

  const filteredServices = servicesData.filter(s =>
    activeCategory === 'All Services' || s.category === activeCategory
  );

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar
        activeTab="Services"
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* ── HERO BANNER ── */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 50%, #0F172A 100%)', color: '#FFFFFF', padding: '80px 32px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(#34D399 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 800, color: '#34D399', marginBottom: '24px', backdropFilter: 'blur(10px)' }}>
            <Sparkles size={16} />
            <span>ENTERPRISE CLINICAL & DIGITAL HEALTH SERVICES</span>
          </div>

          <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1.5px' }}>
            Next-Generation AI Healthcare Infrastructure
          </h1>
          <p style={{ fontSize: '18px', color: '#CBD5E1', maxWidth: '780px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Empowering patients and specialist doctors with real-time AI lab diagnostics, encrypted health vaults, emergency QR telemetry, and 24/7 video consultations.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              style={{ padding: '16px 36px', borderRadius: '9999px', background: '#059669', color: '#FFFFFF', fontSize: '16px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 12px 28px rgba(5, 150, 105, 0.35)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('interactive-demo');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ padding: '16px 36px', borderRadius: '9999px', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '16px', fontWeight: 800, border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <Play size={16} fill="#FFFFFF" />
              <span>Try Live AI Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE LIVE DEMO SECTION ── */}
      <section id="interactive-demo" style={{ maxWidth: '1280px', margin: '-60px auto 80px', padding: '0 32px', position: 'relative', zIndex: 20 }}>
        <div style={{ background: '#FFFFFF', borderRadius: '32px', border: '1px solid #E2E8F0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)', padding: '40px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                ⚡ INTERACTIVE LAB REPORT SIMULATOR
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A' }}>
                Experience Groq Llama 3.3 AI Analysis
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['ecg', 'cbc', 'mri'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => { setSelectedReport(type); setAnalysisDone(false); }}
                  style={{
                    padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, border: 'none', cursor: 'pointer',
                    background: selectedReport === type ? '#0F172A' : '#F1F5F9',
                    color: selectedReport === type ? '#FFFFFF' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  {type === 'ecg' ? '🫀 ECG Telemetry' : type === 'cbc' ? '🩸 Complete Blood Count' : '🧠 Brain MRI Scan'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', alignItems: 'center' }}>
            {/* Input Card */}
            <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '24px', padding: '28px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#059669" />
                <span>Sample Data Payload ({selectedReport.toUpperCase()})</span>
              </div>
              
              <div style={{ background: '#0F172A', color: '#38BDF8', padding: '20px', borderRadius: '16px', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                {selectedReport === 'ecg' && `[PATIENT TELEMETRY DATA]
HR: 74 BPM | QRS Interval: 92ms
QTc: 410ms | ST Segment: Normal
Rhythm: Sinus Rhythm Normal
Premature Beats: 0`}
                {selectedReport === 'cbc' && `[LAB PANEL SUMMARY]
Hemoglobin: 14.2 g/dL (Normal)
WBC Count: 6,400 /uL (Normal)
RBC Count: 4.8M /uL (Normal)
Platelets: 250,000 /uL (Normal)`}
                {selectedReport === 'mri' && `[RADIOLOGY NEURAL LOG]
Ventricular Volume: Normal
Cortical Thickness: Intact
Ischemic Lesions: None detected
Perfusion Index: 98.4% Optimal`}
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                style={{
                  width: '100%', padding: '14px', borderRadius: '14px',
                  background: isAnalyzing ? '#94A3B8' : '#059669',
                  color: '#FFFFFF', fontSize: '15px', fontWeight: 800, border: 'none', cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: '0 8px 20px rgba(5, 150, 105, 0.28)', transition: 'all 0.2s'
                }}
              >
                <Zap size={18} />
                <span>{isAnalyzing ? `Analyzing... (${analysisProgress}%)` : 'Run AI Analysis Now'}</span>
              </button>
            </div>

            {/* Analysis Result Output */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {!isAnalyzing && !analysisDone && (
                <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                  <Cpu size={48} color="#059669" style={{ marginBottom: '16px', animation: 'float 3s infinite ease-in-out' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>Ready for Diagnostic Scanning</h3>
                  <p style={{ fontSize: '13px', maxWidth: '320px', margin: '0 auto' }}>Click "Run AI Analysis Now" to test our sub-second Groq clinical diagnostic engine.</p>
                </div>
              )}

              {isAnalyzing && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>Groq Neural Scan In Progress...</span>
                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#BEF264' }}>{analysisProgress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${analysisProgress}%`, height: '100%', background: 'linear-gradient(90deg, #059669, #BEF264)', transition: 'width 0.15s ease' }} />
                  </div>
                </div>
              )}

              {analysisDone && (
                <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(190, 242, 100, 0.15)', color: '#BEF264', border: '1px solid rgba(190, 242, 100, 0.4)', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, marginBottom: '16px' }}>
                    <CheckCircle2 size={14} />
                    <span>SCAN COMPLETE • 0.38 SECONDS</span>
                  </div>

                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', marginBottom: '10px' }}>
                    {selectedReport === 'ecg' && 'Normal Sinus Rhythm Confirmed'}
                    {selectedReport === 'cbc' && 'All Blood Biomarkers Within Normal Range'}
                    {selectedReport === 'mri' && 'No Abnormal Lesions Detected'}
                  </h3>

                  <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '20px' }}>
                    Patient telemetry indicates optimal physiological parameters. Zero critical abnormalities flagged by Groq Llama 3.3.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>Risk Score</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#34D399' }}>Low (0.02)</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>Confidence Rating</div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#38BDF8' }}>99.8%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES FILTERABLE GRID ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 100px', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', marginBottom: '12px' }}>
            Comprehensive Service Ecosystem
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
            Explore our suite of AI medical software and digital hospital integration modules.
          </p>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {['All Services', 'AI Diagnostics', 'Cloud Vault', 'Emergency Access', 'Telemedicine', 'Doctor Directory'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '10px 22px', borderRadius: '9999px', fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                background: activeCategory === cat ? '#047857' : '#FFFFFF',
                color: activeCategory === cat ? '#FFFFFF' : '#475569',
                boxShadow: activeCategory === cat ? '0 4px 14px rgba(4, 120, 87, 0.28)' : '0 2px 6px rgba(0,0,0,0.04)',
                border: activeCategory === cat ? 'none' : '1px solid #E2E8F0',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '28px' }}>
          {filteredServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                style={{
                  background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 35px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = srv.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: `${srv.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={26} color={srv.color} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 900, color: srv.color, background: `${srv.color}15`, padding: '4px 10px', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {srv.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '10px', lineHeight: 1.3 }}>
                    {srv.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                    {srv.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {srv.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                        <Check size={16} color={srv.color} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '14px', background: '#F8FAFC', color: srv.color, border: `1px solid ${srv.color}40`, fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = srv.color; e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = srv.color; }}
                >
                  <span>Launch Service</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '60px 32px 30px', textAlign: 'center', fontSize: '13px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
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
    </div>
  );
}
