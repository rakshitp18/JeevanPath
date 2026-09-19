import React, { useState } from 'react';
import { Building2, PhoneCall, X, ChevronRight, Activity, ShieldCheck, MapPin } from 'lucide-react';

export interface StateBranchData {
  id: string;
  state: string;
  hospitalsCount: number;
  doctorsCount: number;
  patientsServed: string;
  emergencyCentersCount: number;
  hospitalsList: string[];
  keyDepartments: string[];
  emergencyHotline: string;
}

export const INDIA_STATES_DATA: StateBranchData[] = [
  {
    id: 'st-1',
    state: 'Delhi NCR',
    hospitalsCount: 42,
    doctorsCount: 2150,
    patientsServed: '1.8M+',
    emergencyCentersCount: 28,
    hospitalsList: ['JeevanPath Cyber City Hospital Noida', 'JeevanPath Super Specialty Delhi', 'JeevanPath Millennium Hub Gurugram'],
    keyDepartments: ['Cardiology', 'Oncology', 'Organ Transplant', 'Trauma Care'],
    emergencyHotline: '+91 11 4982 0000'
  },
  {
    id: 'st-2',
    state: 'Maharashtra',
    hospitalsCount: 58,
    doctorsCount: 2840,
    patientsServed: '2.4M+',
    emergencyCentersCount: 35,
    hospitalsList: ['JeevanPath Multi-Specialty Mumbai', 'JeevanPath Orthopedic Institute Pune', 'JeevanPath Trauma Center Nagpur'],
    keyDepartments: ['Neurology', 'Pediatric Surgery', 'Robotics', 'Radiology'],
    emergencyHotline: '+91 22 6120 1111'
  },
  {
    id: 'st-3',
    state: 'Karnataka',
    hospitalsCount: 36,
    doctorsCount: 1950,
    patientsServed: '1.5M+',
    emergencyCentersCount: 22,
    hospitalsList: ['JeevanPath MedTech Hub Bengaluru', 'JeevanPath Heritage Medical Mysore'],
    keyDepartments: ['Cardiac Sciences', 'Neurosciences', 'Orthopedics', 'Genomics'],
    emergencyHotline: '+91 80 4099 2222'
  },
  {
    id: 'st-4',
    state: 'Telangana',
    hospitalsCount: 29,
    doctorsCount: 1480,
    patientsServed: '1.2M+',
    emergencyCentersCount: 18,
    hospitalsList: ['JeevanPath Neuro Hospital Hyderabad', 'JeevanPath Cyberabad Health City'],
    keyDepartments: ['Gastroenterology', 'Nephrology', 'Critical Care', 'Endocrinology'],
    emergencyHotline: '+91 40 3355 4444'
  },
  {
    id: 'st-5',
    state: 'Tamil Nadu',
    hospitalsCount: 34,
    doctorsCount: 1820,
    patientsServed: '1.4M+',
    emergencyCentersCount: 24,
    hospitalsList: ['JeevanPath Oncology Center Chennai', 'JeevanPath Medicare Unit Coimbatore'],
    keyDepartments: ['Radiation Oncology', 'Vascular Surgery', 'Urology', 'Pulmonology'],
    emergencyHotline: '+91 44 2829 5555'
  },
  {
    id: 'st-6',
    state: 'West Bengal',
    hospitalsCount: 24,
    doctorsCount: 1210,
    patientsServed: '980K+',
    emergencyCentersCount: 15,
    hospitalsList: ['JeevanPath Eastern Regional Hospital Kolkata'],
    keyDepartments: ['General Medicine', 'Rheumatology', 'Dermatology', 'Psychiatry'],
    emergencyHotline: '+91 33 2289 6666'
  },
  {
    id: 'st-7',
    state: 'Gujarat',
    hospitalsCount: 31,
    doctorsCount: 1560,
    patientsServed: '1.1M+',
    emergencyCentersCount: 20,
    hospitalsList: ['JeevanPath Heart Care Ahmedabad', 'JeevanPath Multi-Specialty Surat', 'JeevanPath Hospital Vadodara'],
    keyDepartments: ['Interventional Cardiology', 'Cosmetic Surgery', 'ENT', 'Gynecology'],
    emergencyHotline: '+91 79 6632 7777'
  },
  {
    id: 'st-8',
    state: 'Rajasthan',
    hospitalsCount: 22,
    doctorsCount: 980,
    patientsServed: '750K+',
    emergencyCentersCount: 14,
    hospitalsList: ['JeevanPath Desert Healthcare Hub Jaipur'],
    keyDepartments: ['Emergency Medicine', 'Pediatrics', 'Ophthalmology', 'Pathology'],
    emergencyHotline: '+91 141 2780 8888'
  },
  {
    id: 'st-9',
    state: 'Kerala',
    hospitalsCount: 26,
    doctorsCount: 1390,
    patientsServed: '1.0M+',
    emergencyCentersCount: 19,
    hospitalsList: ['JeevanPath Coastal Cardiac Hospital Kochi'],
    keyDepartments: ['Ayurvedic Integrative Medicine', 'Cardiology', 'Neonatology'],
    emergencyHotline: '+91 484 2390 9999'
  },
  {
    id: 'st-10',
    state: 'Uttar Pradesh',
    hospitalsCount: 45,
    doctorsCount: 2200,
    patientsServed: '2.1M+',
    emergencyCentersCount: 30,
    hospitalsList: ['JeevanPath ER Center Lucknow', 'JeevanPath Ganga Health Kanpur'],
    keyDepartments: ['Trauma Center', 'Obstetrics & Gynecology', 'General Surgery'],
    emergencyHotline: '+91 522 4100 1234'
  }
];

export default function IndiaBranches() {
  const [selectedState, setSelectedState] = useState<StateBranchData | null>(null);

  return (
    <section
      id="india-branches-section"
      style={{
        background: '#F8FAFC',
        color: '#0F172A',
        padding: '60px 32px 80px',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', gap: '24px' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '9999px',
              background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.2)',
              fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#047857',
              marginBottom: '12px'
            }}>
              <MapPin size={14} color="#047857" />
              <span>Nationwide Infrastructure</span>
            </div>

            <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px' }}>
              State-by-State Hospital Operations
            </h2>
          </div>

          <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '420px', lineHeight: 1.6, margin: 0 }}>
            Empowering 28+ states with high-speed emergency response, tele-consultation hubs, and integrated digital lab records.
          </p>
        </div>

        {/* State Cards Responsive Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {INDIA_STATES_DATA.map(st => (
            <div
              key={st.id}
              onClick={() => setSelectedState(st)}
              style={{
                padding: '28px',
                borderRadius: '28px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#059669';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(5, 150, 105, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.03)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
                    {st.state}
                  </span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={18} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748B' }}>HOSPITALS</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{st.hospitalsCount}</div>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748B' }}>DOCTORS</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#0284C7', marginTop: '2px' }}>{st.doctorsCount}</div>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748B' }}>PATIENTS</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>{st.patientsServed}</div>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748B' }}>EMERGENCY</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#059669', marginTop: '2px' }}>{st.emergencyCentersCount} HUBS</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0284C7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>VIEW STATE HOSPITALS & HUBS</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* State Detail Modal Popup */}
      {selectedState && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(12px)'
          }}
          onClick={() => setSelectedState(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              color: '#0F172A',
              width: '100%',
              maxWidth: '620px',
              margin: 'auto',
              borderRadius: '32px',
              padding: '36px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              border: '1px solid #E2E8F0',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedState(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F1F5F9',
                color: '#0F172A',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#059669', marginBottom: '6px' }}>
              STATE OPERATIONS OVERVIEW
            </div>

            <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', marginBottom: '24px', letterSpacing: '-0.5px' }}>
              {selectedState.state} Network
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Emergency Hotline Bar */}
              <div style={{ padding: '18px 22px', borderRadius: '20px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <PhoneCall size={22} color="#059669" />
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#047857' }}>24×7 EMERGENCY HOTLINE</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#065F46' }}>{selectedState.emergencyHotline}</div>
                  </div>
                </div>
                <button style={{ padding: '10px 18px', borderRadius: '9999px', background: '#059669', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', border: 'none', cursor: 'pointer' }}>
                  Call Now
                </button>
              </div>

              {/* Hospitals */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0284C7', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} />
                  SUPER-SPECIALTY HOSPITALS
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedState.hospitalsList.map((h, i) => (
                    <div key={i} style={{ padding: '12px 16px', borderRadius: '14px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{h}</span>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> ACCREDITED
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Departments */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#0284C7', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={16} />
                  MEDICAL DEPARTMENTS
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedState.keyDepartments.map((dept, i) => (
                    <span key={i} style={{ padding: '6px 14px', borderRadius: '9999px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedState(null)}
                style={{ padding: '12px 28px', borderRadius: '9999px', background: '#0F172A', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                Close Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
