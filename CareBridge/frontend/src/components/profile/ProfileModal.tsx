import React from 'react';
import { X, ShieldCheck, User } from 'lucide-react';
import PatientProfileForm from './PatientProfileForm';
import DoctorProfileForm from './DoctorProfileForm';
import type { User as UserType } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  if (!isOpen || !user) return null;

  const isDoctor = user.role?.toUpperCase() === 'DOCTOR';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '1.5rem',
          width: '100%',
          maxWidth: 920,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div style={{
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E293B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
            }}>
              <User size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  {isDoctor ? 'Doctor Professional Profile' : 'My Patient Profile & Medical ID'}
                </h2>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: '#ECFDF5',
                  color: '#059669',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3
                }}>
                  <ShieldCheck size={11} />
                  Verified
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: '2px 0 0', fontWeight: 500 }}>
                {isDoctor
                  ? 'Manage physician credentials, practice shifts & consultation slots'
                  : 'Manage personal health details, biometrics, emergency contacts & insurance'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#FFFFFF',
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body Content */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, background: '#F8FAFC' }}>
          {isDoctor ? (
            <DoctorProfileForm user={user} />
          ) : (
            <PatientProfileForm user={user} />
          )}
        </div>
      </div>
    </div>
  );
}
