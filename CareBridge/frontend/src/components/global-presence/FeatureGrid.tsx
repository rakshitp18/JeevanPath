import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Cpu, FileText, Video, Award, Building, Bell, BookOpen } from 'lucide-react';

export const EDITORIAL_SERVICES = [
  {
    title: '24×7 EMERGENCY DISPATCH',
    category: 'CRITICAL CARE',
    desc: 'Instant GPS dispatch and priority emergency routing with live vital streams.',
    img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'AI CLINICAL DIAGNOSTICS',
    category: 'GROQ AI ENGINE',
    desc: 'Sub-second lab report parsing and preliminary symptom triage powered by Llama 3.3.',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'ENCRYPTED PATIENT VAULT',
    category: 'AES-256 SECURITY',
    desc: 'Lifetime medical record storage accessible instantly via cryptographic QR code.',
    img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'GLOBAL TELEMEDICINE HD',
    category: 'CROSS-BORDER',
    desc: 'HD video consultations with senior board-certified specialists in 15+ nations.',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'CERTIFIED DOCTOR DIRECTORY',
    category: 'VERIFIED CARE',
    desc: '500+ super-specialty doctors with 3-tier licensing verification.',
    img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'GOVERNMENT SCHEME & CLAIMS',
    category: 'INSURANCE LINK',
    desc: 'Direct auto-claims processing with Ayushman Bharat, CGHS, and major global insurers.',
    img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'
  }
];

export default function FeatureGrid() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        background: '#e9edc9',
        color: '#01472e',
        borderTopLeftRadius: '5rem',
        borderTopRightRadius: '5rem',
        marginTop: '-4rem',
        paddingTop: '100px',
        paddingBottom: '100px',
        position: 'relative',
        zIndex: 20
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        
        {/* Top Section Header: 15vw Anton Text paired with Circular CTA Button */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '60px', gap: '32px' }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#01472e', marginBottom: '12px' }}>
              OUR CLINICAL ECOSYSTEM
            </div>
            <h2
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: '15vw',
                lineHeight: 0.75,
                letterSpacing: '-0.05em',
                color: '#01472e',
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              SERVICES
            </h2>
          </div>

          {/* Large Circular CTA Button */}
          <button
            onClick={() => navigate('/login?role=patient')}
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: '#01472e',
              color: '#fefae0',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 20px 40px rgba(1, 71, 46, 0.25)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
              e.currentTarget.style.background = '#01472e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            <ArrowUpRight size={28} color="#fefae0" />
            <span style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
              BOOK NOW
            </span>
          </button>
        </div>

        {/* 3-Column Card Grid with Aspect Ratio 4/5 and Blur-Reveal Button */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
          {EDITORIAL_SERVICES.map((item, idx) => (
            <div
              key={idx}
              className="blur-reveal-card"
              style={{
                aspectRatio: '4/5',
                position: 'relative',
                borderRadius: '2.5rem',
                overflow: 'hidden',
                boxShadow: '0 20px 30px -10px rgba(1, 71, 46, 0.18)',
                background: '#01472e',
                cursor: 'pointer'
              }}
            >
              {/* Card Image with Hover Scale 1.1x */}
              <img
                src={item.img}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />

              {/* Top Category Badge */}
              <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10 }}>
                <span style={{ padding: '8px 16px', borderRadius: '9999px', background: 'rgba(254, 250, 224, 0.9)', backdropFilter: 'blur(8px)', color: '#01472e', fontFamily: 'Inter', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                  {item.category}
                </span>
              </div>

              {/* Bottom Content Header */}
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 10, color: '#fefae0', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
                <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: '28px', lineHeight: 1, letterSpacing: '-0.02em', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 500, opacity: 0.9, lineHeight: 1.4, margin: 0 }}>
                  {item.desc}
                </p>
              </div>

              {/* Blur-Reveal Overlay & White Button */}
              <div className="blur-reveal-overlay">
                <button
                  className="blur-reveal-btn"
                  onClick={() => navigate('/login?role=patient')}
                >
                  QUICK CONSULTATION
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
