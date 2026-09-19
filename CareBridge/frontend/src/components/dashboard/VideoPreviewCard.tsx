import React from 'react';
import { Video, Play, ShieldCheck, ChevronRight } from 'lucide-react';
import type { DoctorVideoConsultancy } from '../../services/youtubeService';

interface VideoPreviewCardProps {
  onExplore: () => void;
  previewVideos: DoctorVideoConsultancy[];
}

export default function VideoPreviewCard({ onExplore, previewVideos }: VideoPreviewCardProps) {
  const topPreviewList = previewVideos.slice(0, 3);

  return (
    <div
      onClick={onExplore}
      className="stat-card-modern"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '1.25rem',
        padding: '20px 24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = '#CBD5E1';
        e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = '#E2E8F0';
        e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(0, 0, 0, 0.04)';
      }}
    >
      {/* Left Info Column */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 260 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
          flexShrink: 0
        }}>
          <Video size={22} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Doctor Video Consults & YouTube Webinars
            </h3>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              background: '#ECFDF5',
              color: '#059669',
              border: '1px solid #A7F3D0',
              padding: '2px 8px',
              borderRadius: 9999,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3
            }}>
              <ShieldCheck size={11} />
              <span>Verified Clinical</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>
            Live & recorded specialist sessions, medical advice broadcasts & video guides
          </p>
        </div>
      </div>

      {/* Right Thumbnail Collage Peek */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {topPreviewList.map((vid, idx) => (
            <div
              key={vid.id}
              style={{
                width: 60,
                height: 42,
                borderRadius: 8,
                overflow: 'hidden',
                border: '2px solid #FFFFFF',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                marginLeft: idx > 0 ? -16 : 0,
                position: 'relative',
                zIndex: topPreviewList.length - idx
              }}
            >
              <img src={vid.thumbnailUrl} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={12} fill="#FFF" color="#FFF" />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          style={{
            padding: '8px 16px',
            borderRadius: 9999,
            background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 12,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
          }}
        >
          <span>Watch Consults</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
