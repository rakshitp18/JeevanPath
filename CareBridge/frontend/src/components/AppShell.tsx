import { useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, MessageSquare, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AiAssistantWidget from './AiAssistantWidget';
import { notificationService, type AppNotification } from '../services/notificationService';
import type { User } from '../types';

interface AppShellProps {
  user: User;
  onLogout: () => void;
  pageTitle: string;
  pageSubtitle?: string;
  children: ReactNode;
}

export default function AppShell({ user, onLogout, pageTitle, pageSubtitle, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
  }, [location.pathname]);

  // Subscribe to Toast Notifications
  useEffect(() => {
    notificationService.setToastCallback((notif) => {
      setActiveToast(notif);
      setTimeout(() => {
        setActiveToast(prev => (prev?.id === notif.id ? null : prev));
      }, 5000);
    });
  }, []);

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <div className="app-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* 260px Expanded Sidebar on Left */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Workspace Body on Right */}
      <div className="app-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0, marginLeft: '260px' }}>
        <TopBar
          title={pageTitle}
          subtitle={pageSubtitle}
          onMenuToggle={() => setSidebarOpen(s => !s)}
        />
        <main className="app-page" style={{ flex: 1, padding: '28px 32px', background: '#F8FAFC' }}>
          {children}
        </main>
      </div>

      {/* Real-time Floating Toast Alert Banner */}
      {activeToast && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 24,
          zIndex: 10000,
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '16px 20px',
          borderRadius: 16,
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          maxWidth: 380,
          animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: activeToast.type === 'MESSAGE' ? '#0284C7' : activeToast.type === 'PAYMENT' ? '#059669' : '#D97706',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {activeToast.type === 'MESSAGE' ? <MessageSquare size={20} /> : activeToast.type === 'PAYMENT' ? <ShieldCheck size={20} /> : <Bell size={20} />}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#38BDF8', margin: 0 }}>
              {activeToast.title}
            </div>
            <div style={{ fontSize: 12, color: '#E2E8F0', marginTop: 2, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeToast.text}
            </div>
          </div>

          <button
            onClick={() => setActiveToast(null)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Floating Groq AI Assistant Chat Symbol - Visible ONLY on Dashboard */}
      {isDashboard && <AiAssistantWidget />}
    </div>
  );
}
