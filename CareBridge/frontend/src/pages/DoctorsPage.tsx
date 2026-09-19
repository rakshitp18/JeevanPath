import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Search, Star, Clock, MapPin, Building2, Calendar, CheckCircle2,
  Filter, Shield, ArrowRight, User, PhoneCall, Sparkles, X, Activity, Check, ShieldCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { MOCK_50_DOCTORS, DoctorItem } from '../data/mockDoctors';

export default function DoctorsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);
  const [bookingDate, setBookingDate] = useState('Today, 2:30 PM');
  const [consultType, setConsultType] = useState<'video' | 'in-person'>('video');
  const [patientNotes, setPatientNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const specialties = [
    'All Specialties', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
    'Dermatology', 'Oncology', 'Psychiatry', 'Gastroenterology', 'Endocrinology'
  ];

  const filteredDoctors = MOCK_50_DOCTORS.filter(doc => {
    const matchesQuery = !searchQuery.trim() ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All Specialties' ||
      doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

    const matchesTopRated = !topRatedOnly || doc.rating >= 4.9;

    return matchesQuery && matchesSpecialty && matchesTopRated;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedDoctor(null);
      navigate('/appointments');
    }, 1800);
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar activeTab="Doctors & Experts" />

      {/* Hero Header */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 50%, #0F172A 100%)', color: '#FFFFFF', padding: '80px 32px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 800, color: '#34D399', marginBottom: '24px' }}>
            <Stethoscope size={16} />
            <span>24/7 VERIFIED SPECIALIST NETWORK</span>
          </div>

          <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1.5px' }}>
            Consult Top Specialists & AI-Assisted Clinicians
          </h1>
          <p style={{ fontSize: '18px', color: '#CBD5E1', maxWidth: '780px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Connect with 50+ board-certified cardiologists, neurologists, and surgeons. Integrated AI telemetry for instant diagnostic sharing.
          </p>
        </div>
      </section>

      {/* Search & Multi-Filter Controls */}
      <section style={{ maxWidth: '1280px', margin: '-40px auto 60px', padding: '0 32px', position: 'relative', zIndex: 20 }}>
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
          {/* Main Search Bar */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={20} color="#94A3B8" style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by doctor name, medical specialty, or hospital..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 20px 14px 52px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '15px', color: '#0F172A', outline: 'none' }}
            />
          </div>

          {/* Specialty Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  style={{
                    padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, border: 'none', cursor: 'pointer',
                    background: selectedSpecialty === spec ? '#047857' : '#F1F5F9',
                    color: selectedSpecialty === spec ? '#FFFFFF' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Quick Checkbox Toggles */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={topRatedOnly}
                  onChange={e => setTopRatedOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#059669' }}
                />
                <span>⭐ Top Rated (4.9+)</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Cards Directory Grid */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 100px', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Showing {filteredDoctors.length} Verified Specialists
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '28px' }}>
          {filteredDoctors.map(doc => (
            <div
              key={doc.id}
              style={{
                background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '28px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 35px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <div>
                {/* Header Profile Row */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <img
                    src={doc.img || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                    alt={doc.name}
                    style={{ width: '64px', height: '64px', borderRadius: '18px', objectFit: 'cover', border: '2px solid #E2E8F0' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>{doc.name}</h3>
                      <ShieldCheck size={18} color="#059669" />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7', marginTop: '2px' }}>{doc.specialty}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <Building2 size={13} color="#94A3B8" />
                      <span>{doc.hospital}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Exp Pills */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <div style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="#D97706" color="#D97706" />
                    <span>{doc.rating} ({doc.reviewsCount} reviews)</span>
                  </div>
                  <div style={{ background: '#EFF6FF', color: '#1E40AF', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800 }}>
                    {doc.experienceYears} Years Exp
                  </div>
                </div>

                {/* Availability status */}
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '10px 14px', fontSize: '12px', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s infinite' }} />
                  <span>Available Today • Instant Consultation Available</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedDoctor(doc)}
                style={{
                  width: '100%', padding: '12px', borderRadius: '14px', background: '#059669', color: '#FFFFFF', fontSize: '14px', fontWeight: 800, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.28)', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#047857'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#059669'}
              >
                <Calendar size={16} />
                <span>Book Appointment ({doc.rate || '₹1,200'})</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Drawer / Modal */}
      {selectedDoctor && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '28px', maxWidth: '520px', width: '100%', padding: '32px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <button
              onClick={() => setSelectedDoctor(null)}
              style={{ position: 'absolute', right: '20px', top: '20px', background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} color="#0F172A" />
            </button>

            {bookingConfirmed ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>Appointment Requested!</h3>
                <p style={{ fontSize: '14px', color: '#64748B' }}>Redirecting to your appointments dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '24px' }}>
                  <img src={selectedDoctor.img} alt="" style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>{selectedDoctor.name}</h3>
                    <div style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>{selectedDoctor.specialty}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>Consultation Mode</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setConsultType('video')}
                      style={{ padding: '12px', borderRadius: '12px', border: consultType === 'video' ? '2px solid #059669' : '1px solid #CBD5E1', background: consultType === 'video' ? '#ECFDF5' : '#FFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      📹 HD Video Call
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('in-person')}
                      style={{ padding: '12px', borderRadius: '12px', border: consultType === 'in-person' ? '2px solid #059669' : '1px solid #CBD5E1', background: consultType === 'in-person' ? '#ECFDF5' : '#FFF', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      🏥 Hospital Visit
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>Select Slot</label>
                  <select
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', color: '#0F172A', outline: 'none' }}
                  >
                    <option value="Today, 2:30 PM">Today, 2:30 PM</option>
                    <option value="Today, 5:00 PM">Today, 5:00 PM</option>
                    <option value="Tomorrow, 10:00 AM">Tomorrow, 10:00 AM</option>
                    <option value="Tomorrow, 4:00 PM">Tomorrow, 4:00 PM</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>Symptoms / Notes for Doctor</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your symptoms or medical concern..."
                    value={patientNotes}
                    onChange={e => setPatientNotes(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#059669', color: '#FFF', fontSize: '15px', fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(5, 150, 105, 0.28)' }}
                >
                  Confirm & Reserve Slot
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '60px 32px 30px', textAlign: 'center', fontSize: '13px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>© 2026 JeevanPath AI Healthcare Network. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/services')}>Services</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/global-network')}>Global Network</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/doctors')}>Doctors</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/reviews')}>Reviews</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/faq')}>FAQ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
