import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownRight, Globe2, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function GlobalHero() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroText = "HEALTHCARE";

  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#ccd5ae',
        color: '#01472e',
        position: 'relative',
        paddingTop: '120px',
        paddingBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}
    >
      {/* Top Origin Tag & Sub-label */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#01472e', display: 'inline-block' }} />
          <span style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#01472e' }}>
            GLOBAL ENTERPRISE PLATFORM • EST 2026
          </span>
        </div>

        <div style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#01472e', opacity: 0.8 }}>
          IND • 28 STATES • 50 GLOBAL HUBS
        </div>
      </div>

      {/* Centerpiece: Massive 'Anton' Text with Floating Organic Image Parallax Overlay */}
      <div style={{ position: 'relative', width: '100%', textAlign: 'center', margin: '40px 0' }}>
        
        {/* Massive Anton Headline with Staggered Letter Animation */}
        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '22vw',
            lineHeight: 0.75,
            letterSpacing: '-0.05em',
            color: '#01472e',
            textTransform: 'uppercase',
            margin: 0,
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {heroText.split('').map((char, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                animation: `heroLetterReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s forwards`,
                transform: 'translateY(100%)',
                opacity: 0
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Floating Organic Card 1 (Left Parallax) */}
        <div
          className="animate-float"
          style={{
            position: 'absolute',
            top: '5%',
            left: '6%',
            width: '260px',
            height: '320px',
            borderRadius: '3rem',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(1, 71, 46, 0.25)',
            transform: `translateY(${scrollY * 0.08}px) rotate(-6deg)`,
            border: '4px solid #fefae0',
            zIndex: 10
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
            alt="Doctor Specialist"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', padding: '16px', background: 'linear-gradient(to top, rgba(1,71,46,0.9), transparent)', color: '#fefae0' }}>
            <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
              Dr. Sarah Jenkins
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.9 }}>Cardiology Lead</div>
          </div>
        </div>

        {/* Floating Organic Card 2 (Right Parallax) */}
        <div
          className="animate-float-delayed"
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '6%',
            width: '280px',
            height: '340px',
            borderRadius: '3rem',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(1, 71, 46, 0.25)',
            transform: `translateY(${-scrollY * 0.06}px) rotate(5deg)`,
            border: '4px solid #fefae0',
            zIndex: 10
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
            alt="Medical Research"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0 0', padding: '16px', background: 'linear-gradient(to top, rgba(1,71,46,0.9), transparent)', color: '#fefae0' }}>
            <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
              AI Clinical Vault
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.9 }}>AES-256 Encrypted</div>
          </div>
        </div>

      </div>

      {/* Bottom Dual-Column Descriptive Text & CTAs */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '3.5vw', leading: 1, textTransform: 'uppercase', color: '#01472e', marginBottom: '16px' }}>
            WITHOUT BORDERS
          </div>
          <p style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: 500, color: '#01472e', lineHeight: 1.6, maxWidth: '520px' }}>
            Connecting patients, doctors, hospitals, laboratories, and emergency services across India and around the world with real-time health data sync.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => {
                const el = document.getElementById('global-globe-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: '#01472e',
                color: '#fefae0',
                fontFamily: 'Inter',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                padding: '20px 36px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 15px 30px rgba(1, 71, 46, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span>EXPLORE NETWORK</span>
              <ArrowDownRight size={16} />
            </button>

            <button
              onClick={() => navigate('/login?role=patient')}
              style={{
                background: '#fefae0',
                color: '#01472e',
                fontFamily: 'Inter',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                padding: '20px 36px',
                borderRadius: '9999px',
                border: '2px solid #01472e',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e9edc9'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fefae0'}
            >
              BOOK APPOINTMENT
            </button>
          </div>

          <div style={{ display: 'flex', gap: '24px', fontFamily: 'Inter', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#01472e', opacity: 0.75 }}>
            <span>500+ HOSPITALS</span>
            <span>•</span>
            <span>20,000+ DOCTORS</span>
            <span>•</span>
            <span>15M+ PATIENTS</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroLetterReveal {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
