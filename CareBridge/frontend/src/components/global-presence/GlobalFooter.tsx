import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GlobalFooter() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #01579B 0%, #0288D1 100%)',
        color: '#e0f2fe',
        borderTopLeftRadius: '5rem',
        borderTopRightRadius: '5rem',
        paddingTop: '100px',
        paddingBottom: '48px',
        position: 'relative',
        zIndex: 30
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}>
        
        {/* 12-Column Main Structure */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '48px', marginBottom: '80px' }}>
          
          {/* Left 6 Columns: Large Newsletter Signup with Underline-Only Input */}
          <div style={{ gridColumn: 'span 6' }}>
            <div style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#81D4FA', marginBottom: '16px' }}>
              STAY CONNECTED TO JEEVANPATH
            </div>
            
            <h3 style={{ fontFamily: "'Anton', sans-serif", fontSize: '4.5vw', lineHeight: 0.85, color: '#ffffff', textTransform: 'uppercase', marginBottom: '32px' }}>
              JOIN THE FUTURE OF GLOBAL HEALTHCARE
            </h3>

            {subscribed ? (
              <div style={{ padding: '20px 24px', borderRadius: '1.5rem', background: '#81D4FA', color: '#01579B', fontFamily: 'Inter', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em' }}>
                ✓ THANK YOU FOR SUBSCRIBING TO JEEVANPATH BULLETIN.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ position: 'relative', maxWidth: '540px' }}>
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL ADDRESS..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid #81D4FA',
                    padding: '16px 48px 16px 0',
                    color: '#ffffff',
                    fontFamily: 'Inter',
                    fontSize: '13px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.25em',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#81D4FA',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <ArrowRight size={20} />
                </button>
              </form>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '32px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#81D4FA' }}>
              <ShieldCheck size={16} />
              <span>AES-256 ENCRYPTED • HIPAA & GDPR CERTIFIED</span>
            </div>
          </div>

          {/* Right 6 Columns: Two 3-Column Link Groups */}
          <div style={{ gridColumn: 'span 6', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            
            {/* Col Group 1: Worldwide Branches */}
            <div>
              <h4 style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#ffffff', marginBottom: '24px' }}>
                WORLDWIDE BRANCHES
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#B3E5FC' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/global-presence')}>INDIA (28 STATES)</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/global-presence')}>MIDDLE EAST (DUBAI)</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/global-presence')}>EUROPE (LONDON, BERLIN)</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/global-presence')}>NORTH AMERICA (NY, TORONTO)</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/global-presence')}>ASIA PACIFIC (TOKYO, SGP)</li>
              </ul>
            </div>

            {/* Col Group 2: Legal & Support */}
            <div>
              <h4 style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#ffffff', marginBottom: '24px' }}>
                LEGAL & NAVIGATION
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'Inter', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#B3E5FC' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/login?role=patient')}>PATIENT PORTAL</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/signup?role=doctor')}>DOCTOR REGISTRATION</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>24×7 EMERGENCY HOTLINE</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>PRIVACY POLICY</li>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>TERMS OF SERVICE</li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Copyright and Legal Links */}
        <div style={{ borderTop: '1px solid rgba(129, 212, 250, 0.2)', paddingTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#B3E5FC', opacity: 0.7 }}>
          <div>
            © 2026 JEEVANPATH GLOBAL ENTERPRISE HEALTHCARE. ALL RIGHTS RESERVED.
          </div>
          <div>
            DESIGN SYSTEM: MEDICAL BLUE PALETTE (#0288D1, #29B6F6, #4FC3F7, #81D4FA, #B3E5FC)
          </div>
        </div>

      </div>
    </footer>
  );
}
