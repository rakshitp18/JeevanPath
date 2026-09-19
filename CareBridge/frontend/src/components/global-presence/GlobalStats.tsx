import React from 'react';
import { Globe, Building2, UserCheck, HeartHandshake, Smile } from 'lucide-react';
import SectionBadge from '../SectionBadge';

export default function GlobalStats() {
  const stats = [
    { label: 'Global Network Hubs', value: '50+', icon: Globe, highlight: '15+ Countries Connected' },
    { label: 'Accredited Hospitals', value: '500+', icon: Building2, highlight: 'NABH & JCI Certified' },
    { label: 'Specialist Doctors', value: '20,000+', icon: UserCheck, highlight: 'Board-Certified Experts' },
    { label: 'Patients Served', value: '15M+', icon: HeartHandshake, highlight: 'Lifetime Encrypted Vault' },
    { label: 'Patient Satisfaction', value: '98%', icon: Smile, highlight: 'Verified Clinical Rating' },
  ];

  return (
    <section
      style={{
        background: '#F8FAFC',
        padding: '80px 32px 40px',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1380px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Section Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '9999px',
            background: 'rgba(5, 150, 105, 0.1)',
            border: '1px solid rgba(5, 150, 105, 0.2)',
            fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#047857',
            marginBottom: '14px'
          }}>
            <span>Platform Scale & Network Impact</span>
          </div>

          <h2 style={{ fontSize: '42px', fontWeight: 900, color: '#0F172A', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: '12px' }}>
            Global Healthcare Impact & Reach
          </h2>

          <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Delivering world-class healthcare at scale across emergency dispatch, inpatient, and digital vault networks.
          </p>
        </div>

        {/* 5-Column Stats Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  padding: '28px 20px',
                  borderRadius: '24px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                  textAlign: 'center',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer'
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
                <div style={{
                  width: '52px', height: '52px', borderRadius: '16px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Icon size={26} />
                </div>

                <div style={{ fontSize: '38px', fontWeight: 900, color: '#0F172A', lineHeight: 1, letterSpacing: '-1px', marginBottom: '8px' }}>
                  {item.value}
                </div>

                <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#334155', marginBottom: '4px' }}>
                  {item.label}
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>
                  {item.highlight}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
