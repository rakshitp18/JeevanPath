import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Stethoscope, ChevronDown, Heart, MapPin, Mail, Sparkles, Shield
} from 'lucide-react';

export const JeevanPathLogo = ({ variant = 'light', size = 'normal' }: { variant?: 'light' | 'dark'; size?: 'normal' | 'small' | 'large' }) => {
  const isDark = variant === 'dark';
  const iconSize = size === 'small' ? 38 : size === 'large' ? 52 : 46;
  const fontSize = size === 'small' ? '20px' : size === 'large' ? '28px' : '25px';
  const subtitleSize = size === 'small' ? '8px' : '9px';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <path
          d="M 50,88 C 24,68 10,48 10,32 C 10,18 20,8 35,8 C 43,8 47,12 50,16 C 53,12 57,8 65,8 C 80,8 90,18 90,32 C 90,48 76,68 50,88 Z"
          fill="none"
          stroke="url(#navLogoGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 18,48 L 32,48 L 40,28 L 48,64 L 56,38 L 64,52 L 72,48 L 82,48"
          fill="none"
          stroke="#00D2FF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="40" cy="28" r="3.5" fill="#BEF264" />
        <circle cx="48" cy="64" r="3.5" fill="#38BDF8" />
        <circle cx="56" cy="38" r="3.5" fill="#34D399" />
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize, fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A', letterSpacing: '-0.8px', lineHeight: 1 }}>
            Jeevan<span style={{ color: '#059669' }}>Path</span>
          </span>
          <span style={{ fontSize: '10px', background: 'linear-gradient(135deg, #059669, #0284C7)', color: '#FFFFFF', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', marginLeft: '2px' }}>
            AI
          </span>
        </div>
        <span style={{ fontSize: subtitleSize, fontWeight: 800, color: isDark ? '#94A3B8' : '#059669', letterSpacing: '1.2px', textTransform: 'uppercase', marginTop: '2px' }}>
          Digital Health Network
        </span>
      </div>
    </div>
  );
};

interface NavbarProps {
  activeTab: 'Home' | 'Services' | 'Global Network' | 'Doctors & Experts' | 'Reviews' | 'FAQ';
  onOpenAuthModal?: (role?: 'patient' | 'doctor', mode?: 'signup' | 'login', email?: string) => void;
}

export default function Navbar({ activeTab, onOpenAuthModal }: NavbarProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setShowLoginMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Global Network', path: '/global-network' },
    { name: 'Doctors & Experts', path: '/doctors' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'FAQ', path: '/faq' },
  ] as const;

  return (
    <>
      {/* Top Announcement Bar */}
      <div style={{ background: '#047857', color: '#E6F4EA', fontSize: '12px', fontWeight: 600, padding: '10px 32px' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#BEF264" />
              <span>JeevanPath Healthcare Network • AI Digital Records Hub</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#BEF264" />
              <span>contact@jeevanpath.ai</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#BEF264', animation: 'pulse 1.5s infinite' }} />
              24/7 AI Health Telemetry Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(255, 255, 255, 0.96)' : '#FFFFFF',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px 32px',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 10px 25px -5px rgba(0, 0, 0, 0.05)' : 'none'
        }}
      >
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            <JeevanPathLogo />
          </div>

          {/* Navigation Items (Exact pill styling as requested) */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    background: isActive ? '#047857' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#334155',
                    boxShadow: isActive ? '0 4px 14px rgba(4, 120, 87, 0.28)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#F1F5F9';
                      e.currentTarget.style.color = '#0F172A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#334155';
                    }
                  }}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Sign In Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div ref={loginRef} style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  if (onOpenAuthModal) {
                    onOpenAuthModal('patient', 'login');
                  } else {
                    navigate('/login');
                  }
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  background: '#047857',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 18px rgba(4, 120, 87, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <User size={16} />
                <span>Sign In</span>
                <ChevronDown size={14} onClick={(e) => { e.stopPropagation(); setShowLoginMenu(!showLoginMenu); }} />
              </button>

              {showLoginMenu && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '230px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 20px 30px rgba(0,0,0,0.12)', padding: '8px', zIndex: 120 }}>
                  <button
                    onClick={() => {
                      setShowLoginMenu(false);
                      if (onOpenAuthModal) {
                        onOpenAuthModal('patient', 'login', 'patient@medivault.io');
                      } else {
                        navigate('/login?role=patient');
                      }
                    }}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}
                  >
                    <Heart size={16} color="#0284C7" />
                    <span>Patient Portal</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowLoginMenu(false);
                      if (onOpenAuthModal) {
                        onOpenAuthModal('doctor', 'login', 'doctor@medivault.io');
                      } else {
                        navigate('/login?role=doctor');
                      }
                    }}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, color: '#0F172A' }}
                  >
                    <Stethoscope size={16} color="#059669" />
                    <span>Doctor Workstation</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>
    </>
  );
}
