import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface AppointmentCalendarProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  bookedDates?: string[];
}

export default function AppointmentCalendar({ selectedDate, onSelectDate, bookedDates = [] }: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1)); // July 2026

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPadding = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const monthYearLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="nike-dash-card" style={{ padding: '20px 24px', marginBottom: 24 }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="stat-icon-circle blue" style={{ width: 36, height: 36 }}>
            <CalendarIcon size={18} />
          </div>
          <h3 className="typography-body-strong" style={{ fontSize: 17 }}>{monthYearLabel}</h3>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={handlePrevMonth}
            className="nike-btn-secondary"
            style={{ width: 34, height: 34, padding: 0 }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNextMonth}
            className="nike-btn-secondary"
            style={{ width: 34, height: 34, padding: 0 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center', marginBottom: 8 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <span key={day} className="typography-caption-sm" style={{ color: 'var(--mute)' }}>{day}</span>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {emptyPadding.map(i => (
          <div key={`empty-${i}`} style={{ height: 40 }} />
        ))}

        {daysArray.map(dayNum => {
          const monthStr = String(currentMonth.getMonth() + 1).padStart(2, '0');
          const dayStr = String(dayNum).padStart(2, '0');
          const dateFormatted = `${currentMonth.getFullYear()}-${monthStr}-${dayStr}`;

          const isSelected = selectedDate === dateFormatted;
          const isBooked = bookedDates.includes(dateFormatted);

          return (
            <button
              key={dayNum}
              onClick={() => onSelectDate(dateFormatted)}
              style={{
                height: 40,
                borderRadius: '8px',
                border: isSelected ? '2px solid var(--ink)' : '1px solid var(--hairline-soft)',
                background: isSelected ? 'var(--ink)' : isBooked ? '#F1F5F9' : 'var(--canvas)',
                color: isSelected ? '#ffffff' : 'var(--ink)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: 14,
                position: 'relative',
                transition: 'all 0.12s'
              }}
            >
              {dayNum}
              {isBooked && !isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--ink)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
