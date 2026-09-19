import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid, Users, Stethoscope, Calendar, Activity, Video,
  FileText, QrCode, Settings, LogOut, X, ShieldAlert, Sparkles,
  Pill, HeartPulse, BrainCircuit, MessageSquare, ChevronRight
} from 'lucide-react';
import type { User } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ user: propUser, onLogout, open = true, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('medivault_user');
    return stored ? JSON.parse(stored) : propUser;
  });

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem('medivault_user');
      if (stored) setCurrentUser(JSON.parse(stored));
    };
    window.addEventListener('medivault_user_updated', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('medivault_user_updated', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const user = currentUser;
  const isDoctor = user?.role?.toUpperCase() === 'DOCTOR';
  const isPatient = !isDoctor;

  const doctorNavItems = [
    { path: '/dashboard', label: 'Clinical Dashboard', icon: <LayoutGrid size={18} /> },
    { path: '/appointments', label: 'Appointments & Queue', icon: <Calendar size={18} /> },
    { path: '/documents', label: 'Patients & Records', icon: <Users size={18} /> },
    { path: '/videos', label: 'Doctor Video Consults & Webinars', icon: <Video size={18} /> },
    { path: '/health-analytics', label: 'Clinical Analytics', icon: <Activity size={18} /> },
    { path: '/rx-scanner', label: 'AI Prescription Scanner', icon: <Sparkles size={18} /> },
    { path: '/availability', label: 'Doctor Schedule', icon: <Stethoscope size={18} /> },
    { path: '/emergency-access', label: 'Emergency Token Vault', icon: <QrCode size={18} />, emergency: true },
  ];

  const patientNavItems = [
    { path: '/dashboard', label: 'Health Dashboard', icon: <LayoutGrid size={18} /> },
    { path: '/appointments', label: 'Appointments & Queue', icon: <Calendar size={18} /> },
    { path: '/documents', label: 'Medical Records', icon: <FileText size={18} /> },
    { path: '/videos', label: 'Doctor Video Consults & Webinars', icon: <Video size={18} /> },
    { path: '/rx-scanner', label: 'AI Prescription Scanner', icon: <Sparkles size={18} /> },
    { path: '/health-analytics', label: 'Health Analytics & Vitals', icon: <Activity size={18} /> },
    { path: '/emergency-access', label: 'Emergency QR Vault', icon: <QrCode size={18} />, emergency: true },
  ];

  const navItems = isPatient ? patientNavItems : doctorNavItems;

  return (
    <>
      <aside
        style={{
          width: '260px',
          minWidth: '260px',
          background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
          color: '#ffffff',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 100,
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
          overflowY: 'auto'
        }}
      >
        <div>
          {/* Top Brand Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', padding: '0 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)'
              }}>
                <Stethoscope size={20} />
              </div>
              <div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', display: 'block', lineHeight: 1.1 }}>
                  JEEVANPATH
                </span>
                <span style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#38BDF8' }}>
                  {isDoctor ? 'DOCTOR WORKSTATION' : 'PATIENT CLINIC'}
                </span>
              </div>
            </div>

            {onClose && (
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            )}
          </div>

          {/* Navigation Category Label */}
          <div style={{ fontFamily: 'Inter', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#64748B', marginBottom: '14px', paddingLeft: '10px' }}>
            NAVIGATION & TOOLS
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease-in-out',
                  background: isActive
                    ? item.emergency ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.12)'
                    : 'transparent',
                  color: isActive
                    ? item.emergency ? '#FCA5A5' : '#38BDF8'
                    : item.emergency ? '#EF4444' : '#94A3B8',
                  borderLeft: isActive
                    ? item.emergency ? '3px solid #EF4444' : '3px solid #38BDF8'
                    : '3px solid transparent'
                })}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.fullName || user.name || 'User Profile'}
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: '10px', color: '#38BDF8', fontWeight: 600, letterSpacing: '0.05em' }}>
                {isDoctor ? 'SUPER SPECIALIST' : 'PATIENT ID #1042'}
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '6px', borderRadius: '6px', marginLeft: '4px' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {onClose && open && (
        <div
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 90 }}
        />
      )}
    </>
  );
}
