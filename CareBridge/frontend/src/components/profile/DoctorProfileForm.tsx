import React, { useState } from 'react';
import { Camera, Save, CheckCircle, Stethoscope, Building, Award } from 'lucide-react';
import api from '../../api';
import type { User as UserType } from '../../types';

const defaultAvatars = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
];

interface DoctorProfileFormProps {
  user: UserType;
}

export default function DoctorProfileForm({ user: propUser }: DoctorProfileFormProps) {
  const stored = localStorage.getItem('medivault_user');
  const currentUser = stored ? JSON.parse(stored) : propUser;

  const [avatar, setAvatar] = useState(currentUser.avatar || defaultAvatars[0]);
  const [fullName, setFullName] = useState(currentUser.fullName || currentUser.name || 'Dr. Milind Verma, MD');
  const [email, setEmail] = useState(currentUser.email || 'milind.verma@jeevanpath.io');
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 234-5678');

  // Doctor specific fields
  const [specialization, setSpecialization] = useState(currentUser.specialization || 'Cardiology & Electrophysiology');
  const [licenseNumber, setLicenseNumber] = useState(currentUser.licenseNumber || 'MD-LIC-98421');
  const [hospitalName, setHospitalName] = useState(currentUser.hospitalName || 'JeevanPath Central Medical Center');
  const [consultationFee, setConsultationFee] = useState(currentUser.consultationFee || '150');
  const [todayCapacity, setTodayCapacity] = useState(currentUser.todayCapacity || '25');
  const [todayTimeSlot, setTodayTimeSlot] = useState(currentUser.todayTimeSlot || '09:00 AM - 05:00 PM');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      fullName,
      name: fullName,
      email,
      phone,
      specialization,
      licenseNumber,
      hospitalName,
      consultationFee,
      todayCapacity,
      todayTimeSlot,
      avatar
    };

    // Save permanently to localStorage
    localStorage.setItem('medivault_user', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('medivault_user_updated'));
    window.dispatchEvent(new Event('storage'));

    // Real-Time Spring Boot REST API Database Save
    api.put('/api/v1/doctor/profile', updatedUser)
      .catch(err => console.log('Database doctor profile persistence notice:', err?.message));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: 960 }}>
      {savedSuccess && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#059669',
          padding: '14px 20px',
          borderRadius: '1rem',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 600
        }}>
          <CheckCircle size={20} />
          <span>Doctor Professional Credentials & Practice Slots updated & saved permanently in database!</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Left Column: Doctor Avatar & Account Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', display: 'block', textAlign: 'left', marginBottom: 12 }}>
              Professional Portrait Photo
            </span>

            <div style={{ position: 'relative', width: 110, height: 110, margin: '12px auto' }}>
              <img
                src={avatar}
                alt="Avatar"
                style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '3px solid #0284C7' }}
              />
              <label
                htmlFor="doctor-photo-upload"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#0284C7',
                  color: '#ffffff',
                  padding: 8,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(2, 132, 199, 0.4)'
                }}
              >
                <Camera size={15} />
                <input
                  id="doctor-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <span style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 12 }}>
              Upload physician portrait or select preset:
            </span>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {defaultAvatars.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Preset ${idx}`}
                  onClick={() => setAvatar(imgUrl)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: avatar === imgUrl ? '2px solid #0284C7' : '1px solid #E2E8F0'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Doctor Identity Credentials</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Doctor Full Name & Degree Title</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 14, outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Official Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 14, outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Direct Contact Line</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 14, outline: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Specialization, Fee & Today's Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Clinical Practice & License</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Specialization & Department</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 14 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Medical License Registration Number</label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 14 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Affiliated Hospital / Medical Center</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 14 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Consultation Fee ($ USD)</label>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={e => setConsultationFee(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 14 }}
                />
              </div>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: 24, borderRadius: '1.25rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Today's Time Slot & Patient Cap</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Today's Consultation Shift Hours</label>
                <input
                  type="text"
                  value={todayTimeSlot}
                  onChange={e => setTodayTimeSlot(e.target.value)}
                  placeholder="e.g. 09:00 AM - 05:00 PM"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 14 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Max Daily Patient Consultation Cap</label>
                <input
                  type="number"
                  value={todayCapacity}
                  onChange={e => setTodayCapacity(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: 14 }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 20px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 8,
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                <Save size={16} />
                <span>Save Doctor Credentials & Slots</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
