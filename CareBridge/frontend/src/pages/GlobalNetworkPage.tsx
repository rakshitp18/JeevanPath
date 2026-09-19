import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe2, MapPin, Building2, Search, Zap, Activity, Server,
  ShieldCheck, ArrowRight, Phone, CheckCircle2, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import GlobalGlobe from '../components/global-presence/GlobalGlobe';
import IndiaBranches from '../components/global-presence/IndiaBranches';
import GlobalStats from '../components/global-presence/GlobalStats';
import ExpansionTimeline from '../components/global-presence/ExpansionTimeline';

export default function GlobalNetworkPage() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'map' | 'india' | 'nodes'>('map');

  const networkNodes = [
    { city: 'New Delhi', region: 'India Metro', center: 'JeevanPath AI Hub - AIIMS Corridor', beds: 48, status: 'ONLINE', ping: '12ms' },
    { city: 'Mumbai', region: 'India Metro', center: 'JeevanPath Multi-Specialty Telemetry Hub', beds: 32, status: 'ONLINE', ping: '18ms' },
    { city: 'Bengaluru', region: 'India Metro', center: 'JeevanPath Tech & Trauma Center', beds: 24, status: 'ONLINE', ping: '15ms' },
    { city: 'Hyderabad', region: 'India Metro', center: 'JeevanPath Clinical AI Node', beds: 19, status: 'ONLINE', ping: '14ms' },
    { city: 'Chennai', region: 'India Metro', center: 'JeevanPath Heart & Cardiac Center', beds: 27, status: 'ONLINE', ping: '16ms' },
    { city: 'London', region: 'Europe', center: 'JeevanPath Royal Health Gateway', beds: 15, status: 'ONLINE', ping: '84ms' },
    { city: 'Singapore', region: 'Asia-Pacific', center: 'JeevanPath APAC Tele-ICU Center', beds: 40, status: 'ONLINE', ping: '38ms' },
    { city: 'New York', region: 'North America', center: 'JeevanPath US Vault Node', beds: 50, status: 'ONLINE', ping: '110ms' },
    { city: 'Dubai', region: 'Middle East', center: 'JeevanPath Gulf Emergency Hub', beds: 30, status: 'ONLINE', ping: '45ms' }
  ];

  const filteredNodes = networkNodes.filter(node => {
    const matchesRegion = selectedRegion === 'All Regions' || node.region === selectedRegion;
    const matchesQuery = !searchQuery.trim() ||
      node.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.center.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesQuery;
  });

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar activeTab="Global Network" />

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #0F172A 0%, #064E3B 50%, #0F172A 100%)', color: '#FFFFFF', padding: '80px 32px 100px', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 800, color: '#34D399', marginBottom: '24px' }}>
            <Globe2 size={16} />
            <span>GLOBAL TELEMETRY & HOSPITAL NETWORK HUB</span>
          </div>

          <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1.5px' }}>
            Connected Hospital Infrastructure Across 14 Countries
          </h1>
          <p style={{ fontSize: '18px', color: '#CBD5E1', maxWidth: '780px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Sub-second medical record synchronization, live ICU bed counters, and verified specialist workstation telemetry.
          </p>

          {/* Nav Tabs between 3D Globe, India Network, and Nodes List */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {[
              { id: 'map', label: '🌐 3D Interactive Globe' },
              { id: 'india', label: '🇮🇳 India Metro Network' },
              { id: 'nodes', label: '⚡ Live Node Telemetry' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '12px 28px', borderRadius: '9999px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', border: 'none',
                  background: activeTab === tab.id ? '#059669' : 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF', backdropFilter: 'blur(10px)', transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area based on Selected View Tab */}
      <section style={{ maxWidth: '1280px', margin: '0 auto 80px', padding: '40px 32px' }}>
        {activeTab === 'map' && (
          <div style={{ background: '#FFFFFF', borderRadius: '32px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A' }}>Global Telemetry Connectivity</h2>
              <p style={{ fontSize: '14px', color: '#64748B' }}>Interactive 3D visualization of connected JeevanPath medical nodes.</p>
            </div>
            <GlobalGlobe />
          </div>
        )}

        {activeTab === 'india' && (
          <div style={{ background: '#FFFFFF', borderRadius: '32px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A' }}>Pan-India Specialist Network</h2>
              <p style={{ fontSize: '14px', color: '#64748B' }}>Connecting tier-1 & tier-2 medical hubs across India.</p>
            </div>
            <IndiaBranches />
          </div>
        )}

        {activeTab === 'nodes' && (
          <div>
            {/* Search & Filter Bar */}
            <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '24px', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
                <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search city or medical center name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px', border: '1.5px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['All Regions', 'India Metro', 'Asia-Pacific', 'Europe', 'North America', 'Middle East'].map(region => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    style={{
                      padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 800, border: 'none', cursor: 'pointer',
                      background: selectedRegion === region ? '#047857' : '#F1F5F9',
                      color: selectedRegion === region ? '#FFFFFF' : '#475569',
                      transition: 'all 0.2s'
                    }}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Nodes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {filteredNodes.map((node, idx) => (
                <div
                  key={idx}
                  style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#059669'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>
                      {node.region}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#16A34A' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
                      <span>{node.status} ({node.ping})</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', marginBottom: '6px' }}>{node.city} Hub</h3>
                  <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px', lineHeight: 1.4 }}>{node.center}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>ICU & Emergency Beds</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>{node.beds} Available</div>
                    </div>
                    <button
                      onClick={() => navigate('/login')}
                      style={{ padding: '8px 16px', borderRadius: '10px', background: '#059669', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                    >
                      Connect Node
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Global Network Stats */}
      <GlobalStats />
      <ExpansionTimeline />

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
