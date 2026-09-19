import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus, Trash2, CalendarDays, CheckCircle2 } from 'lucide-react';
import AppShell from '../components/AppShell';
import api from '../api';
import type { User } from '../types';

interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  consultationDuration: number;
}

const DAYS_OF_WEEK = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const mockDefaultSlots: AvailabilitySlot[] = [
  { id: 'slot-1', dayOfWeek: 'MONDAY', startTime: '09:00:00', endTime: '17:00:00', consultationDuration: 30 },
  { id: 'slot-2', dayOfWeek: 'WEDNESDAY', startTime: '09:00:00', endTime: '17:00:00', consultationDuration: 30 },
  { id: 'slot-3', dayOfWeek: 'FRIDAY', startTime: '10:00:00', endTime: '16:00:00', consultationDuration: 30 },
];

export default function DoctorAvailability() {
  const [user, setUser] = useState<User | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(mockDefaultSlots);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newDay, setNewDay] = useState('MONDAY');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('17:00');
  const [newDuration, setNewDuration] = useState('30');
  
  const navigate = useNavigate();

  const fetchAvailability = async () => {
    try {
      const res: any = await api.get('/api/v1/doctors/availability');
      if (Array.isArray(res) && res.length > 0) {
        setAvailability(res);
      }
    } catch (err) {
      console.log('Using default availability slot presets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('medivault_user');
    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      setUser(currentUser);
      fetchAvailability();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      dayOfWeek: newDay,
      startTime: `${newStart}:00`,
      endTime: `${newEnd}:00`,
      consultationDuration: parseInt(newDuration, 10)
    };
    
    setAvailability(prev => [...prev, newSlot]);
    setIsAdding(false);

    try {
      await api.post('/api/v1/doctors/availability', {
        dayOfWeek: newDay,
        startTime: `${newStart}:00`,
        endTime: `${newEnd}:00`,
        consultationDuration: parseInt(newDuration, 10),
      });
    } catch (err) {
      console.log('Local availability updated');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    setAvailability(prev => prev.filter(s => s.id !== id));
    try {
      await api.delete(`/api/v1/doctors/availability/${id}`);
    } catch (err) {
      console.log('Slot removed locally');
    }
  };

  if (!user) return <div className="loading-screen">Loading Availability…</div>;

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      pageTitle="Doctor Practice Hours"
      pageSubtitle="Configure your available consultation slots for instant patient booking"
    >
      <div style={{ maxWidth: 900 }}>
        {/* Header Action Bar */}
        <div className="nike-dash-card-header" style={{ marginBottom: 24 }}>
          <div>
            <h2 className="typography-heading-xl" style={{ fontSize: 24 }}>WEEKLY CLINIC SCHEDULE</h2>
            <p className="typography-caption-md">Active consultation hours visible to patients</p>
          </div>
          {!isAdding && (
            <button className="nike-btn-primary" onClick={() => setIsAdding(true)}>
              <Plus size={16} />
              <span>Add Shift Hours</span>
            </button>
          )}
        </div>

        {/* Add Form Block */}
        {isAdding && (
          <div className="nike-dash-card" style={{ marginBottom: 24 }}>
            <h3 className="typography-heading-md" style={{ marginBottom: 16 }}>Configure Working Hours</h3>
            <form onSubmit={handleAddSlot} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 6 }}>Day of Week</label>
                <select
                  value={newDay}
                  onChange={e => setNewDay(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--hairline)', background: 'var(--soft-cloud)', borderRadius: 8 }}
                >
                  {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 6 }}>Slot Duration</label>
                <select
                  value={newDuration}
                  onChange={e => setNewDuration(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--hairline)', background: 'var(--soft-cloud)', borderRadius: 8 }}
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 6 }}>Start Time</label>
                <input
                  type="time"
                  value={newStart}
                  onChange={e => setNewStart(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--hairline)', background: 'var(--soft-cloud)', borderRadius: 8 }}
                />
              </div>

              <div>
                <label className="typography-caption-sm" style={{ display: 'block', marginBottom: 6 }}>End Time</label>
                <input
                  type="time"
                  value={newEnd}
                  onChange={e => setNewEnd(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--hairline)', background: 'var(--soft-cloud)', borderRadius: 8 }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="nike-btn-primary" style={{ height: 42, padding: '0 24px', fontSize: 14 }}>
                  Save Hours
                </button>
                <button type="button" className="nike-btn-secondary" onClick={() => setIsAdding(false)} style={{ height: 42, padding: '0 24px', fontSize: 14 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Schedule List */}
        <div className="nike-dash-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {DAYS_OF_WEEK.map(day => {
              const daySlots = availability.filter(a => a.dayOfWeek === day);
              if (daySlots.length === 0) return null;
              return (
                <div key={day} style={{ borderBottom: '1px solid var(--hairline-soft)', paddingBottom: 16 }}>
                  <span className="typography-body-strong" style={{ display: 'block', marginBottom: 12 }}>{day}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {daySlots.map(slot => (
                      <div
                        key={slot.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 20px',
                          background: 'var(--soft-cloud)',
                          border: '1px solid var(--hairline-soft)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Clock size={18} color="var(--ink)" />
                          <span className="typography-body-strong" style={{ fontSize: 15 }}>
                            {slot.startTime.substring(0, 5)} – {slot.endTime.substring(0, 5)}
                          </span>
                          <span className="nike-badge-promo">{slot.consultationDuration} min slots</span>
                        </div>

                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          style={{ background: 'transparent', color: 'var(--sale)', cursor: 'pointer' }}
                          title="Delete slot"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
