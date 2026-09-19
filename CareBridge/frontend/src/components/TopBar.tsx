import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Calendar, Activity, Bell, Mail, ChevronDown, LogOut, User, Settings, X, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './profile/ProfileModal';

import { notificationService, type AppNotification, type AppMessage } from '../services/notificationService';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
}

export default function TopBar({ title, subtitle, onMenuToggle }: TopBarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [userState, setUserState] = useState(() => {
    const storedUser = localStorage.getItem('medivault_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem('medivault_user');
      if (storedUser) setUserState(JSON.parse(storedUser));
    };
    window.addEventListener('medivault_user_updated', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('medivault_user_updated', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const user = userState;
  const userRole = (user?.role || 'PATIENT').toUpperCase();
  const userName = user?.fullName || user?.name || (userRole === 'DOCTOR' ? 'Dr. Milind Verma, MD' : 'Nikhil Agarwal');
  const userEmail = user?.email || (userRole === 'DOCTOR' ? 'milind.verma@jeevanpath.io' : 'nikhil.agarwal@example.com');
  const userAvatar = user?.avatar || (userRole === 'DOCTOR'
    ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80');

  // Real-time Notification & Message Subscriptions
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [messages, setMessages] = useState<AppMessage[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notifs, msgs) => {
      setNotifications(notifs);
      setMessages(msgs);
    });
    return unsubscribe;
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (msgRef.current && !msgRef.current.contains(e.target as Node)) setShowMessages(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search bar focus (Cmd+K / Ctrl+K)
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadNotifCount = notifications.filter(n => n.unread).length;
  const unreadMsgCount = messages.filter(m => m.unread).length;

  const handleLogout = () => {
    localStorage.removeItem('medivault_token');
    localStorage.removeItem('medivault_user');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <>
      <header className="topbar-container" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div className="topbar-left">
          <button className="topbar-hamburger" onClick={onMenuToggle} aria-label="Toggle navigation">
            <Menu size={18} />
          </button>
          <div style={{ minWidth: 0 }}>
            <h1 className="topbar-title-text">{title}</h1>
            <p className="topbar-subtitle-text">
              {subtitle || (userRole === 'PATIENT'
                ? `Welcome back, ${userName}! Here's your personal health overview.`
                : "Welcome back! Here's what's happening in your medical practice today.")}
            </p>
          </div>
        </div>

        <div className="topbar-right">
          {/* Enhanced Responsive Search Input (Doctor Only) */}
          {userRole !== 'PATIENT' && (
            <form className="topbar-search-box" onSubmit={handleSearch}>
              <Search size={15} className="topbar-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search patients, doctors, records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="topbar-search-input"
              />
              <span className="topbar-search-shortcut">⌘K</span>
            </form>
          )}

          {/* Quick Action Pill 1: View Schedule (Doctor Only) */}
          {userRole !== 'PATIENT' && (
            <button
              className="topbar-action-pill topbar-pill-outline"
              onClick={() => navigate('/appointments')}
              title="View Appointments & Schedule"
            >
              <Calendar size={14} color="#0284C7" />
              <span>Schedule</span>
            </button>
          )}

          {/* Quick Action Pill 2: Health Analytics (Doctor Only) */}
          {userRole !== 'PATIENT' && (
            <button
              className="topbar-action-pill topbar-pill-purple"
              onClick={() => navigate('/health-analytics')}
              title="View Health Analytics & Vitals"
            >
              <Activity size={14} />
              <span>Analytics</span>
            </button>
          )}

          {/* Messages Icon Button */}
          <div className="topbar-dropdown-wrapper" ref={msgRef}>
            <button
              className={`topbar-icon-btn ${showMessages ? 'topbar-icon-btn-active' : ''}`}
              title="Messages"
              onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); setShowProfileMenu(false); }}
            >
              <Mail size={17} />
              {unreadMsgCount > 0 && <span className="topbar-badge-count">{unreadMsgCount}</span>}
            </button>

            {showMessages && (
              <div className="topbar-dropdown topbar-dropdown-messages">
                <div className="topbar-dropdown-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Clinical Direct Messages</h3>
                    <span className="topbar-notif-count">{unreadMsgCount} new</span>
                  </div>
                  <button className="topbar-dropdown-close" onClick={() => setShowMessages(false)}>
                    <X size={14} />
                  </button>
                </div>
                <div className="topbar-dropdown-list">
                  {messages.map(msg => (
                    <div key={msg.id} className={`topbar-msg-item ${msg.unread ? 'topbar-item-unread' : ''}`}>
                      <img src={msg.avatar} alt={msg.sender} className="topbar-msg-avatar" />
                      <div className="topbar-msg-content">
                        <div className="topbar-msg-sender">{msg.sender}</div>
                        <div className="topbar-msg-text">{msg.text}</div>
                        <div className="topbar-msg-time">{msg.time}</div>
                      </div>
                      {msg.unread && <span className="topbar-unread-dot" />}
                    </div>
                  ))}
                </div>
                <div className="topbar-dropdown-footer">
                  <button onClick={() => { setShowMessages(false); navigate('/dashboard'); }}>
                    View all patient & doctor conversations
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Icon Button */}
          <div className="topbar-dropdown-wrapper" ref={notifRef}>
            <button
              className={`topbar-icon-btn topbar-bell-btn ${showNotifications ? 'topbar-icon-btn-active' : ''}`}
              title="Notifications"
              onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); setShowProfileMenu(false); }}
            >
              <Bell size={17} />
              {unreadNotifCount > 0 && <span className="topbar-bell-dot" />}
            </button>

            {showNotifications && (
              <div className="topbar-dropdown topbar-dropdown-notif">
                <div className="topbar-dropdown-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Clinical Alerts</h3>
                    <span className="topbar-notif-count">{unreadNotifCount} new</span>
                  </div>
                </div>
                <div className="topbar-dropdown-list">
                  {notifications.map(notif => (
                    <div key={notif.id} className={`topbar-notif-item ${notif.unread ? 'topbar-item-unread' : ''}`}>
                      <div className="topbar-notif-icon-wrap">
                        <Bell size={14} />
                      </div>
                      <div className="topbar-notif-content">
                        <div className="topbar-notif-text">{notif.text}</div>
                        <div className="topbar-notif-time">{notif.time}</div>
                      </div>
                      {notif.unread && <span className="topbar-unread-dot" />}
                    </div>
                  ))}
                </div>
                <div className="topbar-dropdown-footer">
                  <button onClick={() => { notificationService.markAllNotificationsAsRead(); setShowNotifications(false); }}>
                    Mark all notifications as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill Trigger */}
          <div className="topbar-dropdown-wrapper" ref={profileRef}>
            <div
              className={`topbar-user-badge ${showProfileMenu ? 'topbar-user-badge-active' : ''}`}
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowMessages(false); }}
            >
              <div style={{ position: 'relative', width: 36, height: 36 }}>
                <img src={userAvatar} alt={userName} className="topbar-avatar-img" />
                <span style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#10B981', border: '2px solid #FFFFFF'
                }} />
              </div>

              <div className="topbar-user-info-text">
                <span className="topbar-user-name-label">{userName}</span>
                <span className="topbar-user-role-label">{userRole === 'DOCTOR' ? 'Doctor' : 'Patient'}</span>
              </div>

              <ChevronDown size={14} className={`topbar-badge-arrow ${showProfileMenu ? 'topbar-arrow-rotated' : ''}`} />
            </div>

            {/* User Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="topbar-dropdown topbar-dropdown-profile">
                <div className="topbar-profile-header">
                  <img src={userAvatar} alt={userName} className="topbar-profile-avatar" />
                  <div>
                    <div className="topbar-profile-name">{userName}</div>
                    <div className="topbar-profile-email">{userEmail}</div>
                    <div className="topbar-profile-role">
                      <Shield size={11} color="#0284C7" />
                      <span>{userRole === 'DOCTOR' ? 'Licensed Physician' : 'Verified Patient Account'}</span>
                    </div>
                  </div>
                </div>

                <div className="topbar-profile-divider" />

                <div className="topbar-profile-menu">
                  <button onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}>
                    <User size={15} />
                    <span>My Profile & Medical ID</span>
                  </button>
                </div>

                <div className="topbar-profile-divider" />

                <div className="topbar-profile-menu">
                  <button className="topbar-logout-btn" onClick={handleLogout}>
                    <LogOut size={15} />
                    <span>Log out of session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* In-Page Profile & Medical ID Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user || { id: 'usr-1', fullName: userName, email: userEmail, role: userRole }}
      />

      <style>{`
        /* ── Dropdown wrappers ── */
        .topbar-dropdown-wrapper {
          position: relative;
        }

        .topbar-user-info-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.15;
          margin-left: 2px;
        }

        .topbar-user-name-label {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
          white-space: nowrap;
          max-width: 110px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .topbar-user-role-label {
          font-size: 11px;
          color: #0284C7;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .topbar-user-info-text {
            display: none;
          }
          .topbar-search-box {
            width: 180px !important;
          }
        }

        @media (max-width: 768px) {
          .topbar-search-shortcut {
            display: none !important;
          }
          .topbar-action-pill span {
            display: none;
          }
          .topbar-action-pill {
            padding: 0 10px !important;
          }
        }

        /* ── Active icon state ── */
        .topbar-icon-btn-active {
          background: #E0F2FE !important;
          color: #0284C7 !important;
          border-color: #38BDF8 !important;
        }

        /* ── Badge count on mail icon ── */
        .topbar-badge-count {
          position: absolute;
          top: -3px; right: -3px;
          min-width: 17px; height: 17px;
          background: #EF4444;
          color: #ffffff;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #ffffff;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
        }

        /* ── Dropdown panel ── */
        .topbar-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          boxShadow: 0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);
          z-index: 1000;
          min-width: 340px;
          animation: dropdownFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .topbar-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px 12px;
          border-bottom: 1px solid #F1F5F9;
        }
        .topbar-dropdown-header h3 {
          font-size: 15px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }
        .topbar-dropdown-close {
          background: none; border: none;
          color: #94A3B8; cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
        }
        .topbar-dropdown-close:hover { background: #F1F5F9; color: #475569; }

        .topbar-notif-count {
          font-size: 11px;
          font-weight: 700;
          color: #0284C7;
          background: #E0F2FE;
          padding: 2px 8px;
          border-radius: 99px;
        }

        .topbar-dropdown-list {
          max-height: 320px;
          overflow-y: auto;
        }

        .topbar-dropdown-footer {
          border-top: 1px solid #F1F5F9;
          padding: 12px 20px;
          text-align: center;
          background: #F8FAFC;
        }
        .topbar-dropdown-footer button {
          background: none; border: none;
          color: #0284C7; font-size: 12px; font-weight: 700;
          cursor: pointer;
        }
        .topbar-dropdown-footer button:hover { text-decoration: underline; }

        /* ── Notification items ── */
        .topbar-notif-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 20px;
          cursor: pointer;
          transition: background 0.12s;
          border-bottom: 1px solid #F8FAFC;
        }
        .topbar-notif-item:hover { background: #F8FAFC; }
        .topbar-item-unread { background: #F0F9FF; }
        .topbar-notif-icon-wrap {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: #E0F2FE;
          color: #0284C7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .topbar-notif-content { flex: 1; min-width: 0; }
        .topbar-notif-text {
          font-size: 13px; color: #0F172A; line-height: 1.4;
          font-weight: 600;
        }
        .topbar-notif-time {
          font-size: 11px; color: #64748B; margin-top: 4px;
        }
        .topbar-unread-dot {
          width: 8px; height: 8px;
          background: #0284C7;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }

        /* ── Message items ── */
        .topbar-msg-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 20px;
          cursor: pointer;
          transition: background 0.12s;
          border-bottom: 1px solid #F8FAFC;
        }
        .topbar-msg-item:hover { background: #F8FAFC; }
        .topbar-msg-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 1px solid #E2E8F0;
        }
        .topbar-msg-content { flex: 1; min-width: 0; }
        .topbar-msg-sender {
          font-size: 13px; font-weight: 700; color: #0F172A;
        }
        .topbar-msg-text {
          font-size: 12px; color: #64748B; line-height: 1.4;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .topbar-msg-time {
          font-size: 11px; color: #94A3B8; margin-top: 3px;
        }

        /* ── Profile dropdown ── */
        .topbar-user-badge-active {
          background: #E2E8F0 !important;
        }
        .topbar-arrow-rotated {
          transform: rotate(180deg);
        }
        .topbar-badge-arrow {
          transition: transform 0.2s ease;
          color: #64748B;
        }

        .topbar-dropdown-profile {
          min-width: 280px;
          padding: 6px 0;
        }
        .topbar-profile-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px 14px;
        }
        .topbar-profile-avatar {
          width: 48px; height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #0284C7;
          boxShadow: 0 4px 12px rgba(2, 132, 199, 0.2);
        }
        .topbar-profile-name {
          font-size: 15px; font-weight: 800; color: #0F172A;
        }
        .topbar-profile-email {
          font-size: 12px; color: #64748B; margin-top: 1px;
        }
        .topbar-profile-role {
          font-size: 11px; color: #0284C7; font-weight: 700; margin-top: 4px;
          display: flex; align-items: center; gap: 4px;
        }
        .topbar-profile-divider {
          height: 1px; background: #F1F5F9; margin: 4px 0;
        }
        .topbar-profile-menu {
          padding: 4px 8px;
        }
        .topbar-profile-menu button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: none;
          background: none;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.12s ease;
        }
        .topbar-profile-menu button:hover {
          background: #F1F5F9;
          color: #0F172A;
        }
        .topbar-profile-menu button svg {
          color: #64748B;
          flex-shrink: 0;
        }
        .topbar-logout-btn {
          color: #DC2626 !important;
        }
        .topbar-logout-btn svg {
          color: #DC2626 !important;
        }
        .topbar-logout-btn:hover {
          background: #FEF2F2 !important;
          color: #DC2626 !important;
        }
      `}</style>
    </>
  );
}
