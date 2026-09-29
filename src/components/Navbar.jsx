import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Upload, User, LogOut, Clock, Zap } from 'lucide-react';

export const Navbar = ({ onOpenTimeModal }) => {
  const { user, logout, currentPage, navigateTo, settings } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (!user || currentPage === 'auth') return null;

  // Safe time calculation (prevents NaNm NaNS issue)
  const durationSecs = Number(settings?.sessionDuration) || 300;

  const formatTime = (secs) => {
    const validSecs = isNaN(secs) || secs <= 0 ? 300 : secs;
    const mins = Math.floor(validSecs / 60);
    const remSecs = validSecs % 60;
    if (remSecs === 0) return `${mins} min${mins !== 1 ? 's' : ''}`;
    return `${mins}m ${remSecs}s`;
  };

  return (
    <header className="navbar-container">
      <div className="container nav-content">
        <div className="logo-section" onClick={() => navigateTo('home')}>
          <div className="logo-icon">
            <Zap size={20} color="#ffffff" fill="#ffffff" />
          </div>
          <span className="app-title">Fast Learner</span>
        </div>

        {currentPage !== 'session' && (
          <div className="nav-actions">
            {/* Time Button */}
            <button 
              className="btn btn-secondary time-btn"
              onClick={onOpenTimeModal}
              title="Select session duration"
            >
              <Clock size={16} />
              <span>{formatTime(durationSecs)}</span>
            </button>

            {/* Upload Button */}
            <button 
              className="btn btn-secondary upload-btn" 
              onClick={() => navigateTo('upload')}
              title="Upload dataset or create table"
            >
              <Upload size={16} />
              <span>Upload</span>
            </button>

            {/* Profile Avatar / Menu */}
            <div className="profile-wrapper">
              <button 
                className="profile-avatar-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                title={`User: ${user.username}`}
              >
                <User size={18} />
                <span className="username-label">{user.username}</span>
              </button>

              {showProfileMenu && (
                <div className="profile-menu animate-fade-in">
                  <div className="profile-menu-header">
                    <p className="user-title">Signed in as</p>
                    <p className="user-name">@{user.username}</p>
                  </div>
                  <div className="menu-divider"></div>
                  <button className="menu-item logout-item" onClick={logout}>
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .navbar-container {
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav-content {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          user-select: none;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background-color: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .app-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .time-btn, .upload-btn {
          font-size: 0.875rem;
          padding: 0.45rem 0.85rem;
        }

        .profile-wrapper {
          position: relative;
        }

        .profile-avatar-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: #ffffff;
          color: var(--text-main);
        }

        .profile-avatar-btn:hover {
          background-color: #f8fafc;
        }

        .username-label {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .profile-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 180px;
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          padding: 0.5rem 0;
          z-index: 60;
        }

        .profile-menu-header {
          padding: 0.5rem 1rem;
        }

        .user-title {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .menu-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 0.4rem 0;
        }

        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: var(--text-main);
          text-align: left;
        }

        .menu-item:hover {
          background-color: #f1f5f9;
        }

        .logout-item {
          color: var(--danger);
        }

        .logout-item:hover {
          background-color: var(--danger-bg);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .nav-content {
            height: 56px;
          }

          .nav-actions {
            gap: 0.5rem;
          }

          .time-btn, .upload-btn {
            padding: 0.4rem 0.65rem;
            font-size: 0.8rem;
          }

          .app-title {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .nav-content {
            height: 52px;
            padding: 0 0.75rem;
          }

          .nav-actions {
            gap: 0.35rem;
          }

          .upload-btn span,
          .time-btn span {
            display: none;
          }

          .upload-btn,
          .time-btn {
            padding: 0.4rem 0.55rem;
            min-height: 36px;
          }

          .app-title {
            font-size: 1rem;
          }

          .logo-icon {
            width: 28px;
            height: 28px;
          }

          .username-label {
            display: none;
          }

          .profile-avatar-btn {
            padding: 0.35rem 0.5rem;
            min-height: 36px;
          }

          .profile-menu {
            right: -0.5rem;
          }
        }
      `}</style>
    </header>
  );
};
