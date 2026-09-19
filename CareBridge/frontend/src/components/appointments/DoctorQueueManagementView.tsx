import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, QrCode, Users, Plus, ShieldCheck, Clock, MapPin, Send, CreditCard, Sparkles, UserCheck, AlertCircle } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import type { Appointment } from '../../types';

interface DoctorQueueManagementViewProps {
  appointments: Appointment[];
  selectedDate: string;
  onSelectDate: (d: string) => void;
  onApproveAndGenerateQR: (id: string) => void;
  onRejectAppointment: (id: string) => void;
}

export default function DoctorQueueManagementView({
  appointments: propAppointments,
  selectedDate,
  onSelectDate,
  onApproveAndGenerateQR,
  onRejectAppointment
}: DoctorQueueManagementViewProps) {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED'>('ALL');
  const [capacity, setCapacity] = useState('25');

  const [appointments, setAppointments] = useState<Appointment[]>(propAppointments);

  useEffect(() => {
    setAppointments(propAppointments);
  }, [propAppointments]);

  const handleApprove = (targetId: string, patientName?: string) => {
    setAppointments(prev => {
      const next = prev.map(apt => (apt.id === targetId || apt.patientName === patientName ? { ...apt, status: 'APPROVED_PENDING_PAYMENT', paymentStatus: 'UNPAID' } : apt));
      localStorage.setItem('medivault_appointments_db', JSON.stringify(next));
      return next;
    });

    if (onApproveAndGenerateQR) {
      onApproveAndGenerateQR(targetId);
    }

    notificationService.pushNotification(
      'Appointment Approved by Doctor',
      `Dr. Milind Verma approved appointment request for ${patientName || 'Nikhil Agarwal'}. Payment link issued.`,
      'APPOINTMENT',
      'Dr. Milind Verma, MD'
    );
  };

  const handleReject = (targetId: string) => {
    setAppointments(prev => {
      const next = prev.filter(apt => apt.id !== targetId);
      localStorage.setItem('medivault_appointments_db', JSON.stringify(next));
      return next;
    });
    if (onRejectAppointment) {
      onRejectAppointment(targetId);
    }
  };

  const filtered = appointments.filter(a => filter === 'ALL' || a.status === filter);
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const approvedCount = appointments.filter(a => a.status === 'ACCEPTED' || a.status === 'APPROVED_PENDING_PAYMENT' || a.status === 'COMPLETED').length;

  return (
    <div style={{ maxWidth: 1100, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Clean Doctor Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: 20,
        padding: '24px 32px',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'rgba(2, 132, 199, 0.2)',
            border: '1px solid rgba(2, 132, 199, 0.4)',
            color: '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserCheck size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Doctor Clinical Queue & Token Roster
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>
              Dr. Milind Verma, MD — Attending Physician Workstation
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 9999,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34D399',
            fontSize: 12,
            fontWeight: 700
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            Clinic Online & Syncing
          </span>
        </div>
      </div>

      {/* Clinical Queue Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div style={{
          background: '#FFFFFF',
          padding: '20px 24px',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px -2px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>PENDING REQUESTS</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>{pendingCount}</span>
            <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700, background: '#FEF3C7', color: '#D97706' }}>Needs Review</span>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          padding: '20px 24px',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px -2px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>APPROVED & QUEUED</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>{approvedCount}</span>
            <span style={{ padding: '4px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 700, background: '#ECFDF5', color: '#059669' }}>Active Tokens</span>
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          padding: '20px 24px',
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px -2px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>DAILY CAPACITY CAP</span>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="number"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              style={{ width: 70, padding: '6px 10px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: 16, fontWeight: 800, color: '#0284C7', textAlign: 'center' }}
            />
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Patients/Day</span>
          </div>
        </div>
      </div>

      {/* Clean Queue Management Table Card */}
      <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
              Patient Appointments & Approval Controls
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: '3px 0 0', fontWeight: 500 }}>
              Review patient consultation requests and issue Razorpay payment links
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 6, background: '#F8FAFC', padding: 4, borderRadius: 9999, border: '1px solid #E2E8F0' }}>
            {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 700,
                  border: 'none',
                  background: filter === t ? '#0F172A' : 'transparent',
                  color: filter === t ? '#FFFFFF' : '#64748B',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {t === 'ALL' ? 'All Requests' : t === 'PENDING' ? 'Pending' : t === 'ACCEPTED' ? 'Paid & Confirmed' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Table View */}
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #F1F5F9' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Department</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Slot & Time</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reason / Complaint</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Queue Status</th>
                <th style={{ padding: '14px 16px', fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(apt => (
                <tr key={apt.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#0284C7',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 14,
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                      }}>
                        {apt.patientName ? apt.patientName.charAt(0) : 'N'}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{apt.patientName}</div>
                        <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{apt.doctorName}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0284C7', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '4px 12px', borderRadius: 9999 }}>
                      {apt.departmentName}
                    </span>
                  </td>

                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{apt.appointmentDate}</div>
                    <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{apt.appointmentTime}</div>
                  </td>

                  <td style={{ padding: '16px', fontSize: 13, color: '#334155', fontWeight: 500, maxWidth: 220 }}>
                    {apt.reason}
                  </td>

                  <td style={{ padding: '16px' }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '5px 12px',
                      borderRadius: 9999,
                      background: apt.status === 'ACCEPTED' || apt.status === 'COMPLETED' ? '#ECFDF5' : apt.status === 'APPROVED_PENDING_PAYMENT' ? '#E0F2FE' : '#FEF3C7',
                      color: apt.status === 'ACCEPTED' || apt.status === 'COMPLETED' ? '#059669' : apt.status === 'APPROVED_PENDING_PAYMENT' ? '#0284C7' : '#D97706',
                      border: '1px solid currentColor',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <span style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'currentColor'
                      }} />
                      {apt.status === 'ACCEPTED' ? 'PAID & CONFIRMED (#Q-104)' : apt.status === 'APPROVED_PENDING_PAYMENT' ? 'APPROVED (AWAITING PAYMENT)' : 'PENDING APPROVAL'}
                    </span>
                  </td>

                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {apt.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleApprove(apt.id!, apt.patientName)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 10,
                            border: 'none',
                            background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Send size={14} />
                          <span>Approve Request</span>
                        </button>

                        <button
                          onClick={() => handleReject(apt.id!)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 10,
                            border: '1px solid #E2E8F0',
                            background: '#F8FAFC',
                            color: '#64748B',
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : apt.status === 'APPROVED_PENDING_PAYMENT' ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0284C7', display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F0F9FF', padding: '6px 14px', borderRadius: 8, border: '1px solid #BAE6FD' }}>
                        <CreditCard size={14} /> Payment Link Sent
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ECFDF5', padding: '6px 14px', borderRadius: 8, border: '1px solid #A7F3D0' }}>
                        <CheckCircle2 size={14} /> Verified QR Pass & Paid
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
