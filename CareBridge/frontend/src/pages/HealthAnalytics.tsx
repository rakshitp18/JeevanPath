import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Heart, Scale, Droplet, Zap, PlusCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import AppShell from '../components/AppShell';
import type { User } from '../types';

const mockVitalsHistory = [
  { date: 'Mon', bpSys: 120, bpDia: 80, sugar: 95, heartRate: 72 },
  { date: 'Tue', bpSys: 122, bpDia: 82, sugar: 98, heartRate: 75 },
  { date: 'Wed', bpSys: 118, bpDia: 79, sugar: 92, heartRate: 70 },
  { date: 'Thu', bpSys: 121, bpDia: 81, sugar: 96, heartRate: 74 },
  { date: 'Fri', bpSys: 119, bpDia: 80, sugar: 94, heartRate: 71 },
  { date: 'Sat', bpSys: 120, bpDia: 80, sugar: 95, heartRate: 73 },
  { date: 'Sun', bpSys: 117, bpDia: 78, sugar: 91, heartRate: 69 },
];

export default function HealthAnalytics() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('medivault_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({
        id: '1',
        fullName: 'Dr. Alex Morgan',
        email: 'alex.morgan@medivault.io',
        role: 'DOCTOR',
      } as User);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  if (!user) return <div className="loading-screen">Loading Analytics…</div>;

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      pageTitle={user.role === 'PATIENT' ? 'My Health Analytics & Vitals' : 'Health Analytics & Vitals'}
      pageSubtitle={user.role === 'PATIENT'
        ? 'Your personal biometric health metrics, risk indicators, and trend monitoring'
        : 'Biometric health metrics, risk indicators, and historical trend monitoring'}
    >
      <div style={{ maxWidth: 1100 }}>
        {/* Top 4 Vitals Overview Cards */}
        <div className="dash-stats-grid">
          <div className="stat-card-modern">
            <div className="stat-card-top-row">
              <div className="stat-icon-circle blue">
                <Heart size={20} />
              </div>
            </div>
            <span className="stat-card-title">Blood Pressure</span>
            <div className="stat-card-value-row" style={{ marginTop: 8 }}>
              <span className="stat-value">120/80</span>
              <span className="stat-badge green">Optimal</span>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-card-top-row">
              <div className="stat-icon-circle green">
                <Droplet size={20} />
              </div>
            </div>
            <span className="stat-card-title">Fasting Blood Sugar</span>
            <div className="stat-card-value-row" style={{ marginTop: 8 }}>
              <span className="stat-value">95 <span style={{ fontSize: 14, color: 'var(--mute)' }}>mg/dL</span></span>
              <span className="stat-badge green">Normal</span>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-card-top-row">
              <div className="stat-icon-circle pink">
                <Zap size={20} />
              </div>
            </div>
            <span className="stat-card-title">Resting Heart Rate</span>
            <div className="stat-card-value-row" style={{ marginTop: 8 }}>
              <span className="stat-value">72 <span style={{ fontSize: 14, color: 'var(--mute)' }}>bpm</span></span>
              <span className="stat-badge green">Normal</span>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="stat-card-top-row">
              <div className="stat-icon-circle dark">
                <Activity size={20} />
              </div>
            </div>
            <span className="stat-card-title">Overall Health Score</span>
            <div className="stat-card-value-row" style={{ marginTop: 8 }}>
              <span className="stat-value">94/100</span>
              <span className="stat-badge green">Excellent</span>
            </div>
          </div>
        </div>

        {/* 2 Column Layout: Recharts Trend + Log Vitals Form */}
        <div className="dash-main-two-col">
          {/* Chart Card */}
          <div className="nike-dash-card">
            <div className="nike-dash-card-header">
              <div>
                <h3 className="typography-heading-md">WEEKLY BIOMETRIC TREND</h3>
                <p className="typography-caption-md">Blood pressure (Systolic) vs Resting Heart Rate</p>
              </div>
            </div>
            <div style={{ height: 260, width: '100%', marginTop: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockVitalsHistory}>
                  <defs>
                    <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111111" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#111111" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#9e9ea0" fontSize={12} />
                  <YAxis stroke="#9e9ea0" fontSize={12} domain={[60, 140]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="bpSys" stroke="#111111" strokeWidth={2} fillOpacity={1} fill="url(#colorBp)" />
                  <Area type="monotone" dataKey="heartRate" stroke="#007d48" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Log Vitals Form Card */}
          <div className="nike-dash-card">
            <h3 className="typography-heading-md" style={{ marginBottom: 16 }}>LOG DAILY VITALS</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 4 }}>Systolic BP (mmHg)</label>
                <input type="number" placeholder="120" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--hairline)', background: 'var(--soft-cloud)', borderRadius: 8 }} />
              </div>
              <div>
                <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 4 }}>Diastolic BP (mmHg)</label>
                <input type="number" placeholder="80" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--hairline)', background: 'var(--soft-cloud)', borderRadius: 8 }} />
              </div>
              <div>
                <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 4 }}>Fasting Glucose (mg/dL)</label>
                <input type="number" placeholder="95" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--hairline)', background: 'var(--soft-cloud)', borderRadius: 8 }} />
              </div>
              <div>
                <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 4 }}>Heart Rate (bpm)</label>
                <input type="number" placeholder="72" style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--hairline)', background: 'var(--soft-cloud)', borderRadius: 8 }} />
              </div>
              <button type="button" className="nike-btn-primary" style={{ marginTop: 8 }}>
                <PlusCircle size={16} />
                <span>Save Vitals Snapshot</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
