import React, { useState } from 'react';
import {
  Calendar, CheckCircle2, ChevronRight, ChevronLeft, MapPin, Building2,
  ShieldCheck, Globe2, Sparkles, ArrowRight, Play, Pause, Info, X
} from 'lucide-react';

export const TIMELINE_STEPS = [
  {
    year: '2024',
    title: 'STARTED IN DELHI NCR',
    desc: 'Launched initial 5 core partner hospitals and deployed the AES-256 encrypted digital health vault architecture.',
    status: 'ACTIVE HUB',
    badgeColor: '#059669',
    metrics: ['5 Super-Specialty Hospitals', 'AES-256 Encrypted Vault', '100K+ Early Patient Records'],
    details: 'Initiated the pilot program across Delhi, Gurgaon, and Noida hospitals. Established zero-knowledge encryption protocols for lifetime diagnostic storage.'
  },
  {
    year: '2025',
    title: 'INDIA NATIONWIDE EXPANSION',
    desc: 'Scaled across 28 Indian states onboarding 500+ super-specialty hospitals into the unified record ecosystem.',
    status: 'ACTIVE HUB',
    badgeColor: '#059669',
    metrics: ['500+ Accredited Hospitals', 'Groq Llama 3.3 Integration', '5M+ Patient Vaults'],
    details: 'Expanded emergency telemetry infrastructure nationwide, onboarding top hospital chains including Apollo, Max, Fortis, and AIIMS emergency centers.'
  },
  {
    year: '2026',
    title: 'SOUTH ASIA CROSS-BORDER HUB',
    desc: 'Connected cross-border emergency corridors and digital health vaults in Nepal, Sri Lanka, Bhutan, and Bangladesh.',
    status: 'CURRENT PHASE',
    badgeColor: '#0284C7',
    metrics: ['4 Nations Connected', 'Offline Emergency QR Access', '15M+ Secured Records'],
    details: 'Launched cross-border patient health passporting and universal emergency QR cards for international travelers across South Asian healthcare corridors.'
  },
  {
    year: '2027',
    title: 'MIDDLE EAST NETWORK',
    desc: 'Establishing healthcare telemetry hubs in Dubai, Abu Dhabi, Riyadh, Doha, and Muscat.',
    status: 'EXPANSION PHASE',
    badgeColor: '#D97706',
    metrics: ['Dubai & Riyadh Hubs', 'GCC Insurance Integration', 'HD Specialist Video Link'],
    details: 'Linking GCC healthcare providers with direct auto-claims processing and multilingual specialist tele-consultation channels.'
  },
  {
    year: '2028',
    title: 'EUROPEAN EXPANSION',
    desc: 'Opening GDPR-compliant clinical nodes in London, Berlin, Paris, Amsterdam, and Zurich.',
    status: 'PLANNED NODE',
    badgeColor: '#7C3AED',
    metrics: ['GDPR Compliant Architecture', 'EU Medical Interoperability', 'Top 50 European Specialists'],
    details: 'Expanding European clinical partnerships for rare disease consultations and AI-driven cross-border diagnostic reviews.'
  },
  {
    year: '2029',
    title: 'NORTH AMERICA HUB',
    desc: 'Integrating clinical partnerships with US & Canadian hospital networks and FDA-certified AI diagnostic pipelines.',
    status: 'PLANNED NODE',
    badgeColor: '#7C3AED',
    metrics: ['US & Canada Hospital Link', 'HIPAA Certified Vaults', '24/7 Global Dispatch'],
    details: 'Seamless record portability for North American medical travelers and cross-continent emergency dispatch coordination.'
  },
  {
    year: '2030',
    title: 'WORLDWIDE NETWORK',
    desc: 'Achieving full global coverage connecting 100+ nations in a unified, instant emergency care vault.',
    status: 'FUTURE VISION',
    badgeColor: '#475569',
    metrics: ['100+ Nations Connected', '100M+ Global Vaults', 'Sub-0.1s Global Bio-Scan'],
    details: 'The ultimate vision: A global, zero-latency emergency healthcare network where any patient record can save a life anywhere on Earth.'
  }
];

export default function ExpansionTimeline() {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(2); // Default to 2026 (Current Phase)
  const [selectedMilestone, setSelectedMilestone] = useState<typeof TIMELINE_STEPS[0] | null>(null);

  const activeItem = TIMELINE_STEPS[activeStepIndex];

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #F8FAFC 0%, #ECFDF5 50%, #F8FAFC 100%)',
        color: '#0F172A',
        padding: '100px 32px',
        position: 'relative',
        zIndex: 10,
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
        
        {/* Clean Header (Zero Text Overlap) */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', borderRadius: '9999px',
            background: '#047857', color: '#BEF264',
            fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase',
            marginBottom: '16px', boxShadow: '0 4px 14px rgba(4, 120, 87, 0.2)'
          }}>
            <Sparkles size={14} color="#BEF264" />
            <span>STRATEGIC GROWTH ROADMAP</span>
          </div>

          <h2 style={{
            fontSize: '48px', fontWeight: 900, color: '#0F172A',
            letterSpacing: '-1.5px', lineHeight: 1.15, marginBottom: '16px'
          }}>
            Global Expansion Timeline
          </h2>

          <p style={{
            fontSize: '17px', color: '#475569', maxWidth: '680px',
            margin: '0 auto', lineHeight: 1.6, fontWeight: 500
          }}>
            From a local clinical pilot in 2024 to a global digital healthcare ecosystem connecting 100+ nations by 2030.
          </p>
        </div>

        {/* Interactive Year Stepper Bar */}
        <div style={{
          background: '#FFFFFF', borderRadius: '24px', padding: '20px 24px',
          border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          marginBottom: '48px'
        }}>
          {/* Stepper Buttons Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            {TIMELINE_STEPS.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <button
                  key={step.year}
                  onClick={() => setActiveStepIndex(idx)}
                  style={{
                    flex: 1, minWidth: '100px', padding: '14px 16px', borderRadius: '16px',
                    border: isActive ? '2px solid #059669' : '1px solid #E2E8F0',
                    background: isActive ? '#047857' : '#F8FAFC',
                    color: isActive ? '#FFFFFF' : '#334155',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s ease',
                    boxShadow: isActive ? '0 8px 20px rgba(4, 120, 87, 0.3)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '18px', fontWeight: 900, lineHeight: 1 }}>{step.year}</div>
                  <div style={{ fontSize: '10px', fontWeight: 800, marginTop: '4px', opacity: isActive ? 0.9 : 0.6, letterSpacing: '0.5px' }}>
                    {step.status}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Progress Indicator Bar */}
          <div style={{ marginTop: '20px', background: '#E2E8F0', height: '6px', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              width: `${((activeStepIndex + 1) / TIMELINE_STEPS.length) * 100}%`,
              height: '100%', background: 'linear-gradient(90deg, #059669 0%, #34D399 100%)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Featured Active Milestone Highlight Box */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 100%)',
          borderRadius: '32px', padding: '40px', color: '#FFFFFF',
          boxShadow: '0 25px 50px rgba(0,0,0,0.18)', marginBottom: '56px',
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px', alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ padding: '6px 14px', borderRadius: '9999px', background: activeItem.badgeColor, color: '#FFFFFF', fontSize: '12px', fontWeight: 900, letterSpacing: '0.8px' }}>
                {activeItem.status}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#BEF264', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} />
                MILESTONE {activeStepIndex + 1} OF 7 ({activeItem.year})
              </span>
            </div>

            <h3 style={{ fontSize: '32px', fontWeight: 900, color: '#FFFFFF', marginBottom: '14px', lineHeight: 1.2 }}>
              {activeItem.title}
            </h3>

            <p style={{ fontSize: '16px', color: '#CBD5E1', lineHeight: 1.65, marginBottom: '24px' }}>
              {activeItem.desc}
            </p>

            <button
              onClick={() => setSelectedMilestone(activeItem)}
              style={{
                padding: '12px 26px', borderRadius: '14px', background: '#BEF264', color: '#047857',
                fontSize: '14px', fontWeight: 900, border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 8px 18px rgba(190, 242, 100, 0.35)', transition: 'all 0.2s'
              }}
            >
              <span>View Milestone Details</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Column: Key Metrics Stack */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '24px', padding: '28px', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
              ★ Key Metrics & Deliverables
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeItem.metrics.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                  <CheckCircle2 size={18} color="#34D399" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4-Column Timeline Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {TIMELINE_STEPS.map((item, idx) => {
            const isCurrent = idx === activeStepIndex;
            return (
              <div
                key={item.year}
                onClick={() => { setActiveStepIndex(idx); setSelectedMilestone(item); }}
                style={{
                  padding: '28px', borderRadius: '28px',
                  background: isCurrent ? '#ECFDF5' : '#FFFFFF',
                  border: isCurrent ? '2px solid #059669' : '1px solid #E2E8F0',
                  boxShadow: isCurrent ? '0 12px 28px rgba(5, 150, 105, 0.15)' : '0 4px 16px rgba(0,0,0,0.03)',
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.borderColor = '#059669'; }}
                onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.borderColor = '#E2E8F0'; }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ padding: '6px 14px', borderRadius: '9999px', background: item.badgeColor, color: '#FFFFFF', fontSize: '12px', fontWeight: 900 }}>
                      {item.year}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>
                      STEP 0{idx + 1} OF 07
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', marginBottom: '10px', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#059669' }}>
                  <span>Inspect Phase</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Detailed Milestone Modal */}
      {selectedMilestone && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '28px', maxWidth: '560px', width: '100%', padding: '36px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <button
              onClick={() => setSelectedMilestone(null)}
              style={{ position: 'absolute', right: '20px', top: '20px', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} color="#0F172A" />
            </button>

            <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '9999px', background: selectedMilestone.badgeColor, color: '#FFF', fontSize: '12px', fontWeight: 900, marginBottom: '16px' }}>
              {selectedMilestone.year} • {selectedMilestone.status}
            </div>

            <h3 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', marginBottom: '12px' }}>
              {selectedMilestone.title}
            </h3>

            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.65, marginBottom: '24px' }}>
              {selectedMilestone.details}
            </p>

            <div style={{ background: '#F8FAFC', borderRadius: '20px', padding: '20px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '10px' }}>
                Key Technical Deliverables
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedMilestone.metrics.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedMilestone(null)}
              style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#059669', color: '#FFFFFF', fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
            >
              Close Milestone Brief
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
