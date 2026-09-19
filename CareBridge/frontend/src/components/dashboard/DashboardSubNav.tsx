import React from 'react';
import { Users, Video } from 'lucide-react';

export type DashboardSubView = 'portal' | 'videos';

interface DashboardSubNavProps {
  activeSubView: DashboardSubView;
  onSelectSubView: (view: DashboardSubView) => void;
  videoCount?: number;
}

export default function DashboardSubNav({ activeSubView, onSelectSubView, videoCount = 4 }: DashboardSubNavProps) {
  const navItems = [
    {
      id: 'portal' as const,
      label: 'My Patient Portal & 21 Modules',
      badge: '21 Modules',
      icon: <Users size={16} />,
      accentColor: '#0284C7'
    },
    {
      id: 'videos' as const,
      label: 'Doctor Video Consults & YouTube Webinars',
      badge: `${videoCount} Live Sessions`,
      icon: <Video size={16} />,
      accentColor: '#EF4444'
    }
  ];

  return (
    <nav
      aria-label="Health Dashboard Sub-navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#FFFFFF',
        padding: '6px 10px',
        borderRadius: '1rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.03)',
        marginBottom: 20,
        overflowX: 'auto'
      }}
    >
      {navItems.map((item) => {
        const isActive = activeSubView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectSubView(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 18px',
              borderRadius: '0.75rem',
              fontSize: 13,
              fontWeight: isActive ? 800 : 600,
              color: isActive ? item.accentColor : '#475569',
              background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              border: 'none',
              borderBottom: isActive ? `3px solid ${item.accentColor}` : '3px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease-in-out'
            }}
          >
            <span style={{ color: isActive ? item.accentColor : '#64748B', display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 9999,
              background: isActive ? item.accentColor : '#F1F5F9',
              color: isActive ? '#FFFFFF' : '#64748B',
              transition: 'all 0.15s ease'
            }}>
              {item.badge}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
