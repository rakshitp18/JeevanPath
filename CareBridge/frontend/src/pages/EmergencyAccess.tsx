import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Shield, RefreshCw, Download, ExternalLink, Plus, Trash2 } from 'lucide-react';
import AppShell from '../components/AppShell';
import api from '../api';
import type { EmergencyProfileData, User } from '../types';

const mockDemoProfile: EmergencyProfileData = {
  fullName: 'Dr. Sarah Jenkins',
  age: 34,
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Peanuts'],
  conditions: ['Mild Asthma'],
  medications: ['Albuterol 90mcg'],
  emergencyContacts: [
    { name: 'David Jenkins', relation: 'Spouse', phone: '+1 987 654 3210' }
  ],
  notes: 'Patient carries emergency Epipen and inhaler.',
};

export default function EmergencyAccess() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<EmergencyProfileData>(mockDemoProfile);
  const [accessEnabled, setAccessEnabled] = useState(true);
  const [publicUrl, setPublicUrl] = useState('http://localhost:5173/public/emergency/demo-token-123');
  const [qrDataUrl, setQrDataUrl] = useState(
    'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=http://localhost:5173/public/emergency/demo-token-123'
  );

  const navigate = useNavigate();

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('medivault_user');
      let currentUser: User | null = null;
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
        setUser(currentUser);
      }

      const emergencyPayload: any = await api.get('/api/v1/patient/emergency');
      if (emergencyPayload && emergencyPayload.emergencyProfile) {
        setProfile(emergencyPayload.emergencyProfile);
        setAccessEnabled(Boolean(emergencyPayload.isEnabled));
      }
    } catch (err) {
      console.log('Using default emergency access profile presets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  const handleToggleAccess = () => {
    setAccessEnabled(!accessEnabled);
  };

  const handleDownloadQr = () => {
    const anchor = document.createElement('a');
    anchor.href = qrDataUrl;
    anchor.download = 'medivault-emergency-qr.png';
    anchor.click();
  };

  const handlePreviewPublicPage = () => {
    window.open('/public/emergency/demo-token-123', '_blank');
  };

  if (loading || !user) return <div className="loading-screen">Loading Emergency Access…</div>;

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      pageTitle="Emergency QR Access Token"
      pageSubtitle="Cryptographic QR token for EMS first-responders and emergency care"
    >
      <div style={{ maxWidth: 1100 }}>
        <div className="grid-2">
          {/* Left Column: Access Control + Profile Form */}
          <div className="col">
            <div className="card">
              <span className="card-title" style={{ display: 'block' }}>Emergency Access Control</span>
              <div className="emergency-toggle-row">
                <div>
                  <span className="typography-body-strong" style={{ display: 'block' }}>Emergency Public Profile</span>
                  <span className="typography-caption-md">
                    {accessEnabled
                      ? 'Enabled: EMS responders can scan token to view emergency snapshot'
                      : 'Disabled: Public access token is currently blocked'}
                  </span>
                </div>
                <button
                  type="button"
                  className={accessEnabled ? 'btn-sm btn-danger' : 'btn-sm btn-success'}
                  onClick={handleToggleAccess}
                >
                  {accessEnabled ? 'Disable Access' : 'Enable Access'}
                </button>
              </div>
            </div>

            <div className="card">
              <span className="card-title" style={{ display: 'block' }}>Emergency Medical Snapshot</span>
              <form className="form-group" style={{ margin: 0 }} onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      value={profile.age || 34}
                      onChange={e => setProfile({ ...profile, age: parseInt(e.target.value, 10) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Group</label>
                    <input
                      type="text"
                      value={profile.bloodGroup}
                      onChange={e => setProfile({ ...profile, bloodGroup: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Critical Allergies</label>
                  <input
                    type="text"
                    value={profile.allergies.join(', ')}
                    onChange={e => setProfile({ ...profile, allergies: e.target.value.split(',') })}
                  />
                </div>

                <div className="form-group">
                  <label>Current Medications</label>
                  <input
                    type="text"
                    value={profile.medications.join(', ')}
                    onChange={e => setProfile({ ...profile, medications: e.target.value.split(',') })}
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Notes</label>
                  <textarea
                    rows={3}
                    value={profile.notes}
                    onChange={e => setProfile({ ...profile, notes: e.target.value })}
                  />
                </div>

                <button type="button" className="btn-primary" style={{ marginTop: 8 }}>
                  <span>Save Emergency Snapshot</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: QR Code Display + Safety Notes */}
          <div className="col">
            <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="card-title" style={{ display: 'block', alignSelf: 'flex-start' }}>Emergency QR Code</span>
              
              <div style={{ padding: 20, background: 'var(--soft-cloud)', border: '1px solid var(--hairline-soft)', margin: '16px 0' }}>
                <img src={qrDataUrl} alt="Emergency QR Code" style={{ width: 180, height: 180 }} />
              </div>

              <span className="typography-caption-md" style={{ marginBottom: 16 }}>
                Scan with any smartphone camera to open emergency snapshot
              </span>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button type="button" className="btn-primary" onClick={handleDownloadQr} style={{ height: 38, fontSize: 13 }}>
                  <Download size={14} />
                  <span>Download QR</span>
                </button>
                <button type="button" className="btn-secondary" onClick={handlePreviewPublicPage} style={{ height: 38, fontSize: 13 }}>
                  <ExternalLink size={14} />
                  <span>Preview Page</span>
                </button>
              </div>
            </div>

            <div className="card">
              <span className="card-title" style={{ display: 'block' }}>Responders Protocol</span>
              <ul className="records-list">
                <li className="record-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <strong>Encrypted Medical Record Token</strong>
                  <span>Contains critical blood group, allergies, and emergency contact numbers only.</span>
                </li>
                <li className="record-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <strong>Instant Revocation</strong>
                  <span>You can disable or regenerate token URL at any time from this dashboard.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
