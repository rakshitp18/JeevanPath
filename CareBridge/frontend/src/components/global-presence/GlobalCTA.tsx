import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Hospital, UserPlus } from 'lucide-react';

export default function GlobalCTA() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        background: '#fefae0',
        color: '#01472e',
        borderTopLeftRadius: '5rem',
        borderTopRightRadius: '5rem',
        marginTop: '-4rem',
        paddingTop: '100px',
        paddingBottom: '100px',
        position: 'relative',
        zIndex: 45
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
        
        <div style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#01472e', marginBottom: '16px' }}>
          EXPAND CARE ACCESSIBILITY WITH JEEVANPATH
        </div>

        <h2
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '13vw',
            lineHeight: 0.75,
            letterSpacing: '-0.05em',
            color: '#01472e',
            textTransform: 'uppercase',
            maxWidth: '1200px',
            margin: '0 auto 40px'
          }}
        >
          JOIN THE FUTURE OF HEALTHCARE
        </h2>

        <p style={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 500, color: '#01472e', maxWidth: '640px', margin: '0 auto 48px', lineHeight: 1.6 }}>
          Connect your medical facility, clinic, or hospital network to JeevanPath AI for instant cross-border lab record sync and emergency dispatch.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', itemsAlign: 'center', justifyContent: 'center', gap: '20px' }}>
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
              padding: '22px 42px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 20px 40px rgba(1, 71, 46, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Hospital size={18} />
            <span>FIND NEAREST HOSPITAL</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate('/signup?role=doctor')}
            style={{
              background: '#e9edc9',
              color: '#01472e',
              fontFamily: 'Inter',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              padding: '22px 42px',
              borderRadius: '9999px',
              border: '2px solid #01472e',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#ccd5ae'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#e9edc9'}
          >
            <UserPlus size={18} />
            <span>BECOME OUR PARTNER</span>
          </button>
        </div>

      </div>
    </section>
  );
}
