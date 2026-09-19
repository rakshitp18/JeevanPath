import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, MapPin, XCircle, RefreshCw, QrCode, Plus, CalendarPlus, UserCheck, Video, Building, Sparkles, AlertCircle, CreditCard, ShieldCheck, Lock, Send } from 'lucide-react';
import AppointmentCalendar from '../AppointmentCalendar';
import { openRazorpayCheckout, resetGlobalScroll } from '../../services/razorpayService';
import { notificationService } from '../../services/notificationService';
import api from '../../api';
import type { Appointment } from '../../types';

interface PatientAppointmentsViewProps {
  appointments: Appointment[];
  selectedDate: string;
  onSelectDate: (d: string) => void;
  onCancelAppointment: (id: string) => void;
  onAddAppointment?: (apt: Appointment) => void;
}

const doctorPresets = [
  { name: 'Dr. Milind Verma, MD', dept: 'Cardiology & Internal Medicine', fee: '$150' },
  { name: 'Dr. Marcus Vance, MD', dept: 'Neurology', fee: '$180' },
  { name: 'Dr. Elena Rostova, MS', dept: 'Orthopedics', fee: '$160' },
  { name: 'Dr. David Chen, MD', dept: 'Endocrinology', fee: '$140' },
  { name: 'Dr. Emily Chen, MD', dept: 'Pediatrics', fee: '$130' }
];

export default function PatientAppointmentsView({
  appointments: initialAppointments,
  selectedDate,
  onSelectDate,
  onCancelAppointment
}: PatientAppointmentsViewProps) {
  // Preset demo initial appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    return initialAppointments.map((a, idx) => {
      if (idx === 0) {
        return {
          ...a,
          patientName: 'Nikhil Agarwal',
          doctorName: 'Dr. Milind Verma, MD',
          departmentName: 'Cardiology',
          status: 'ACCEPTED',
          paymentStatus: 'PAID',
          razorpayPaymentId: 'RZP-TXN-84920193'
        };
      }
      if (idx === 1) {
        return {
          ...a,
          patientName: 'Nikhil Agarwal',
          doctorName: 'Dr. Marcus Vance, MD',
          status: 'APPROVED_PENDING_PAYMENT',
          paymentStatus: 'UNPAID'
        };
      }
      return { ...a, patientName: 'Nikhil Agarwal' };
    });
  });

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED'>('ALL');
  const [showBookingForm, setShowBookingForm] = useState(true);

  // New Booking Form State
  const [selectedDoctor, setSelectedDoctor] = useState(doctorPresets[0].name);
  const [selectedDept, setSelectedDept] = useState(doctorPresets[0].dept);
  const [appointmentDate, setAppointmentDate] = useState('2026-08-05');
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [consultMode, setConsultMode] = useState<'IN_PERSON' | 'VIDEO_CONSULT'>('IN_PERSON');
  const [reason, setReason] = useState('Routine blood pressure & cardiology review');

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);

  // QR Modal View
  const [activeQrModalApt, setActiveQrModalApt] = useState<Appointment | null>(null);

  const selectedDocInfo = doctorPresets.find(d => d.name === selectedDoctor) || doctorPresets[0];

  const handleDoctorChange = (docName: string) => {
    setSelectedDoctor(docName);
    const found = doctorPresets.find(d => d.name === docName);
    if (found) setSelectedDept(found.dept);
  };

  // STEP 1: Schedule Appointment Request (Sent to Doctor for Approval)
  const handleScheduleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: 'Nikhil Agarwal',
      doctorName: selectedDoctor,
      departmentName: selectedDept,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      reason: reason || 'General Health Consultation',
      status: 'PENDING', // Sent to Doctor for approval
      paymentStatus: 'UNPAID',
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => {
      const next = [newApt, ...prev];
      localStorage.setItem('medivault_appointments_db', JSON.stringify(next));
      return next;
    });
    setBookingSuccess(true);

    // Real-Time Database Persistence (Spring Boot Backend API)
    api.post('/api/v1/patient/appointments', {
      doctorName: selectedDoctor,
      departmentName: selectedDept,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      reason: reason || 'General Health Consultation',
      consultationMode: consultMode
    }).catch(err => console.log('Database sync notice (optimistic state fallback):', err?.message));

    // Push live notification
    notificationService.pushNotification(
      'Appointment Request Sent',
      `Your consultation request with ${selectedDoctor} has been submitted for approval.`,
      'APPOINTMENT'
    );

    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const [paymentErrorAptId, setPaymentErrorAptId] = useState<string | null>(null);
  const [paymentErrorMsg, setPaymentErrorMsg] = useState<string | null>(null);

  // STEP 2: Doctor Approved -> Patient Pays via Razorpay
  const handlePayForApprovedAppointment = (apt: Appointment) => {
    setIsProcessingPayment(true);
    setPaymentErrorAptId(null);
    setPaymentErrorMsg(null);

    const docFeeRaw = doctorPresets.find(d => d.name === apt.doctorName)?.fee || '$150';
    const numFee = parseInt(docFeeRaw.replace(/[^0-9]/g, '')) || 150;
    const uniqueTxnId = `RZP-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    openRazorpayCheckout({
      amount: numFee * 100,
      currency: 'USD',
      doctorName: apt.doctorName || 'Attending Physician',
      departmentName: apt.departmentName || 'General Medicine',
      patientName: 'Nikhil Agarwal',
      patientEmail: 'nikhil.agarwal@example.com',
      onSuccess: (res) => {
        resetGlobalScroll();
        setIsProcessingPayment(false);
        setPaymentErrorAptId(null);
        setPaymentErrorMsg(null);
        const finalTxnId = res.razorpay_payment_id || uniqueTxnId;

        setAppointments(prev => {
          const next = prev.map(item =>
            item.id === apt.id
              ? { ...item, paymentStatus: 'PAID', razorpayPaymentId: finalTxnId, status: 'ACCEPTED' }
              : item
          );
          localStorage.setItem('medivault_appointments_db', JSON.stringify(next));
          return next;
        });
        setLastPaymentId(finalTxnId);

        // Real-Time Database Persistence (Spring Boot Backend API)
        api.post(`/api/v1/patient/appointments/${apt.id}/pay`, {
          razorpayPaymentId: finalTxnId,
          amount: 150
        }).catch(err => console.log('Database payment persistence notice:', err?.message));

        // Push live notification
        notificationService.pushNotification(
          'Razorpay Payment Confirmed',
          `Payment of $150 confirmed! Txn ID: ${finalTxnId}. Verified QR Token Pass unlocked.`,
          'PAYMENT'
        );
      },
      onFailure: (err) => {
        resetGlobalScroll();
        setIsProcessingPayment(false);
        setPaymentErrorAptId(apt.id);
        setPaymentErrorMsg(err?.message || 'Payment attempt was cancelled or unsuccessful.');
      }
    });
  };

  const handleCancel = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    onCancelAppointment(id);
  };

  const filtered = appointments.filter(a => filter === 'ALL' || a.status === filter);
  
  // ONLY generate QR Token Banner if status is ACCEPTED/COMPLETED AND payment is PAID!
  const approvedAppointment = appointments.find(
    a => (a.status === 'ACCEPTED' || a.status === 'COMPLETED') && (a.paymentStatus === 'PAID' || a.razorpayPaymentId)
  );

  return (
    <div style={{ maxWidth: 1050, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Booking Alert Banner */}
      {bookingSuccess && (
        <div style={{
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          color: '#B45309',
          padding: '16px 20px',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 700,
          boxShadow: '0 4px 14px rgba(217, 119, 6, 0.15)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <Send size={24} color="#D97706" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#92400E' }}>
              Appointment Request Sent to {selectedDoctor}!
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#B45309', marginTop: 2 }}>
              Your request is pending physician clinical review. Once approved, you will be able to complete payment via Razorpay & unlock your QR Token pass.
            </div>
          </div>
        </div>
      )}

      {/* Payment Error / Retry Alert Banner */}
      {paymentErrorMsg && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          padding: '16px 20px',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 700,
          boxShadow: '0 4px 14px rgba(220, 38, 38, 0.15)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <AlertCircle size={24} color="#DC2626" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#991B1B' }}>
              Payment Cancelled or Incomplete
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#B91C1C', marginTop: 2 }}>
              {paymentErrorMsg} Your consultation request remains approved — click <strong>"Retry $150 Payment via Razorpay"</strong> below to try paying again.
            </div>
          </div>
        </div>
      )}

      {/* Book New Appointment Form Section */}
      <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}>
              <CalendarPlus size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Schedule Clinical Appointment
                </h3>
                <span style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: '#FEF3C7',
                  color: '#D97706',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Send size={11} />
                  Doctor Approval Workflow
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
                Schedule your consultation request for doctor approval, then pay via Razorpay to generate your QR pass
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBookingForm(prev => !prev)}
            style={{
              padding: '8px 16px',
              borderRadius: 9999,
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#0F172A',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {showBookingForm ? 'Collapse Booking Form' : '+ Schedule Appointment'}
          </button>
        </div>

        {showBookingForm && (
          <form onSubmit={handleScheduleRequest} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Form Fields Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {/* Physician & Specialty */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Attending Physician & Specialty
                </label>
                <select
                  value={selectedDoctor}
                  onChange={e => handleDoctorChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                >
                  {doctorPresets.map((doc, idx) => (
                    <option key={idx} value={doc.name}>
                      {doc.name} — {doc.dept} (Consultation Fee: {doc.fee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultation Mode */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Consultation Mode
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setConsultMode('IN_PERSON')}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      border: consultMode === 'IN_PERSON' ? '1px solid #0284C7' : '1px solid #E2E8F0',
                      background: consultMode === 'IN_PERSON' ? '#E0F2FE' : '#F8FAFC',
                      color: consultMode === 'IN_PERSON' ? '#0284C7' : '#64748B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <Building size={14} />
                    <span>In-Person Clinic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultMode('VIDEO_CONSULT')}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      border: consultMode === 'VIDEO_CONSULT' ? '1px solid #0284C7' : '1px solid #E2E8F0',
                      background: consultMode === 'VIDEO_CONSULT' ? '#E0F2FE' : '#F8FAFC',
                      color: consultMode === 'VIDEO_CONSULT' ? '#0284C7' : '#64748B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <Video size={14} />
                    <span>HD Telemedicine</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Time Slot Chips */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                  Preferred Time Slot
                </label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'].map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setAppointmentTime(slot)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        border: appointmentTime === slot ? '1px solid #0284C7' : '1px solid #E2E8F0',
                        background: appointmentTime === slot ? '#0284C7' : '#F8FAFC',
                        color: appointmentTime === slot ? '#FFFFFF' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chief Medical Complaint / Reason */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
                Reason for Consultation / Symptoms
              </label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Follow-up ECG check, blood pressure review, or migraine evaluation"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: 13,
                  color: '#0F172A',
                  outline: 'none'
                }}
                required
              />
            </div>

            {/* Submit Action Button (Schedule First, Pay After Approval) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Fee:</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#0F172A' }}>{selectedDocInfo.fee}</span>
                <span style={{ fontSize: 11, color: '#D97706', fontWeight: 700, background: '#FEF3C7', padding: '2px 8px', borderRadius: 9999 }}>
                  Payable Upon Doctor Approval
                </span>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 28px',
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)'
                }}
              >
                <Send size={18} />
                <span>Submit Appointment Request to Doctor</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filter Tabs & Patient Appointments List */}
      <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>My Scheduled Consultations</h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Track doctor approval status, complete Razorpay payments & view QR passes</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 700,
                  border: filter === t ? '1px solid #0284C7' : '1px solid #E2E8F0',
                  background: filter === t ? '#0284C7' : '#F8FAFC',
                  color: filter === t ? '#FFFFFF' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(apt => {
            const isPaid = apt.paymentStatus === 'PAID' || Boolean(apt.razorpayPaymentId);
            const isApprovedByDoctor = apt.status === 'APPROVED_PENDING_PAYMENT';
            const isConfirmed = apt.status === 'ACCEPTED' || apt.status === 'COMPLETED';

            return (
              <div
                key={apt.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 22px',
                  background: isPaid ? '#F8FAFC' : isApprovedByDoctor ? '#F0F9FF' : '#FFFDF5',
                  border: isPaid ? '1px solid #E2E8F0' : isApprovedByDoctor ? '1px solid #7DD3FC' : '1px solid #FDE68A',
                  borderRadius: 14,
                  flexWrap: 'wrap',
                  gap: 14
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 9999,
                      background: isConfirmed ? '#ECFDF5' : isApprovedByDoctor ? '#E0F2FE' : '#FEF3C7',
                      color: isConfirmed ? '#059669' : isApprovedByDoctor ? '#0284C7' : '#D97706',
                      border: '1px solid currentColor'
                    }}>
                      {isConfirmed ? 'CONFIRMED' : isApprovedByDoctor ? 'APPROVED — AWAITING PAYMENT' : 'PENDING DOCTOR APPROVAL'}
                    </span>

                    {/* PROMINENT UNIQUE PAYMENT TRANSACTION ID DISPLAY */}
                    {isPaid ? (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 9999,
                        background: '#ECFDF5',
                        color: '#047857',
                        border: '1px solid #A7F3D0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <ShieldCheck size={12} color="#059669" />
                        Razorpay Paid • Txn ID: <code style={{ fontFamily: 'monospace', fontWeight: 900 }}>{apt.razorpayPaymentId}</code>
                      </span>
                    ) : (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 9999,
                        background: isApprovedByDoctor ? '#E0F2FE' : '#FEF3C7',
                        color: isApprovedByDoctor ? '#0284C7' : '#D97706',
                        border: isApprovedByDoctor ? '1px solid #BAE6FD' : '1px solid #FDE68A',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <Lock size={11} />
                        {isApprovedByDoctor ? 'Approved — Ready for Payment ($150)' : 'Unpaid (Pending Approval)'}
                      </span>
                    )}

                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>{apt.doctorName}</h4>
                  </div>

                  <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0', fontWeight: 500 }}>
                    {apt.departmentName || 'Specialty'} • {apt.appointmentDate} at {apt.appointmentTime} • Reason: {apt.reason}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Action 1: If Approved by Doctor & Unpaid -> Show Razorpay Pay Now / Retry Button */}
                  {isApprovedByDoctor && !isPaid && (
                    <button
                      onClick={() => handlePayForApprovedAppointment(apt)}
                      disabled={isProcessingPayment}
                      style={{
                        padding: '9px 18px',
                        borderRadius: 10,
                        border: 'none',
                        background: paymentErrorAptId === apt.id
                          ? 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)'
                          : 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: isProcessingPayment ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: paymentErrorAptId === apt.id
                          ? '0 4px 12px rgba(220, 38, 38, 0.35)'
                          : '0 4px 12px rgba(2, 132, 199, 0.3)'
                      }}
                    >
                      {paymentErrorAptId === apt.id ? <RefreshCw size={14} /> : <CreditCard size={14} />}
                      <span>
                        {isProcessingPayment
                          ? 'Connecting Razorpay…'
                          : paymentErrorAptId === apt.id
                            ? 'Retry $150 Payment via Razorpay'
                            : 'Pay $150 via Razorpay & Unlock QR Token'}
                      </span>
                    </button>
                  )}

                  {/* Action 2: If Paid & Confirmed -> Show QR Token Pass */}
                  {isPaid && isConfirmed && (
                    <button
                      onClick={() => setActiveQrModalApt(apt)}
                      style={{
                        padding: '9px 18px',
                        borderRadius: 10,
                        border: 'none',
                        background: '#0F172A',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)'
                      }}
                    >
                      <QrCode size={14} color="#38BDF8" />
                      <span>Show Verified Token Pass</span>
                    </button>
                  )}

                  {/* Cancel Request Button */}
                  {apt.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(apt.id!)}
                      style={{
                        padding: '9px 14px',
                        borderRadius: 10,
                        border: '1px solid #FCA5A5',
                        background: '#FEF2F2',
                        color: '#DC2626',
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <XCircle size={14} />
                      <span>Cancel Request</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Token Pass Modal Overlay */}
      {activeQrModalApt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '1.5rem',
            padding: 28,
            maxWidth: 420,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#059669', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
              <ShieldCheck size={16} />
              <span>RAZORPAY PAYMENT VERIFIED</span>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', margin: 0 }}>
              TOKEN #Q-104
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
              {activeQrModalApt.doctorName} • {activeQrModalApt.departmentName || 'Cardiology'}
            </p>

            <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 16, border: '1px solid #E2E8F0', margin: '16px 0' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=http://localhost:5173/queue/Q-104?payId=${activeQrModalApt.razorpayPaymentId}`}
                alt="Queue QR Token"
                style={{ width: 180, height: 180, borderRadius: 8 }}
              />
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, marginTop: 8 }}>
                Unique Txn ID: <code style={{ color: '#0284C7', fontFamily: 'monospace' }}>{activeQrModalApt.razorpayPaymentId}</code>
              </div>
            </div>

            <button
              onClick={() => setActiveQrModalApt(null)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                border: 'none',
                background: '#0F172A',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
