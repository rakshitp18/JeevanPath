import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Globe2, ArrowRight } from 'lucide-react';
import GlobalHero from '../components/global-presence/GlobalHero';
import GlobalGlobe from '../components/global-presence/GlobalGlobe';
import IndiaBranches from '../components/global-presence/IndiaBranches';
import FeatureGrid from '../components/global-presence/FeatureGrid';
import GlobalStats from '../components/global-presence/GlobalStats';
import ExpansionTimeline from '../components/global-presence/ExpansionTimeline';
import GlobalCTA from '../components/global-presence/GlobalCTA';
import GlobalFooter from '../components/global-presence/GlobalFooter';

export default function GlobalPresence() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#ccd5ae', minHeight: '100vh', color: '#01472e', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Fixed Top Navigation Bar with Pill Blur Container */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none'
        }}
      >
        {/* Left: Logo in Bold Uppercase with Hyphen Prefix (- JEEVANPATH) */}
        <div
          onClick={() => navigate('/')}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            padding: '10px 20px',
            borderRadius: '9999px',
            boxShadow: '0 10px 25px rgba(1, 71, 46, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.6)'
          }}
        >
          <span style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#01472e' }}>
            - JEEVANPATH
          </span>
        </div>

        {/* Center: Pill-shaped Nav Bar with Blur (rgba(255, 255, 255, 0.15)) */}
        <nav
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            padding: '10px 28px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 10px 25px rgba(1, 71, 46, 0.08)'
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{ background: 'transparent', border: 'none', color: '#01472e', fontFamily: 'Inter', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', cursor: 'pointer' }}
          >
            HOME
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'transparent', border: 'none', color: '#01472e', fontFamily: 'Inter', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', cursor: 'pointer' }}
          >
            50 DOCTORS
          </button>
          <button
            onClick={() => navigate('/global-presence')}
            style={{ background: '#01472e', color: '#fefae0', border: 'none', fontFamily: 'Inter', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', cursor: 'pointer', padding: '6px 14px', borderRadius: '9999px' }}
          >
            GLOBAL NETWORK
          </button>
          <button
            onClick={() => navigate('/login?role=patient')}
            style={{ background: 'transparent', border: 'none', color: '#01472e', fontFamily: 'Inter', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', cursor: 'pointer' }}
          >
            PATIENT PORTAL
          </button>
        </nav>

        {/* Right: Cart / Access Button in White Pill with Numeric Counter Badge */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <button
            onClick={() => navigate('/login?role=patient')}
            style={{
              background: '#FFFFFF',
              color: '#01472e',
              fontFamily: 'Inter',
              fontSize: '10px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              padding: '12px 24px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 25px rgba(1, 71, 46, 0.15)'
            }}
          >
            <span>PATIENT PORTAL</span>
            <span
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#01472e',
                color: '#fefae0',
                fontSize: '10px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              50
            </span>
          </button>
        </div>
      </header>

      {/* Main Sections */}
      <main>
        <GlobalHero />
        <FeatureGrid />
        <GlobalGlobe />
        <IndiaBranches />
        <GlobalStats />
        <ExpansionTimeline />
        <GlobalCTA />
      </main>

      {/* Footer */}
      <GlobalFooter />

    </div>
  );
}
