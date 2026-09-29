import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Repeat, Zap, Flame, Eye, X } from 'lucide-react';

export const PracticeSettingsDropdown = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useAuth();

  if (!isOpen) return null;

  const handleToggleFlipMode = () => {
    updateSettings({ flipMode: !settings.flipMode });
  };

  const handleToggleRapidFire = () => {
    updateSettings({ rapidFireMode: !settings.rapidFireMode });
  };

  const handleRapidFireSecsChange = (secs) => {
    updateSettings({ rapidFireSeconds: parseInt(secs, 10) || 3 });
  };

  const handleToggleAdhdMode = () => {
    updateSettings({ adhdMode: !settings.adhdMode });
  };

  const handleToggleRevealAnswer = () => {
    updateSettings({ revealAnswerMode: !settings.revealAnswerMode });
  };

  return (
    <div className="settings-dropdown-wrapper animate-fade-in" onClick={(e) => e.stopPropagation()}>
      <div className="dropdown-header">
        <span className="dropdown-title">Practice Settings</span>
        <button className="dropdown-close-btn" onClick={onClose}>
          <X size={14} />
        </button>
      </div>

      <div className="dropdown-options">
        {/* Flip Mode Option */}
        <div className="dropdown-option-row">
          <div className="option-label-group">
            <Repeat size={15} className="option-icon" />
            <div>
              <p className="option-name">Flip Mode</p>
              <p className="option-sub">{settings.flipMode ? 'Value → Key' : 'Key → Value'}</p>
            </div>
          </div>
          <label className="switch-sm">
            <input
              type="checkbox"
              checked={settings.flipMode}
              onChange={handleToggleFlipMode}
            />
            <span className="slider-sm round"></span>
          </label>
        </div>

        {/* Rapid Fire Mode Option */}
        <div className="dropdown-option-row-group">
          <div className="dropdown-option-row">
            <div className="option-label-group">
              <Zap size={15} className="option-icon rapid-icon" />
              <div>
                <p className="option-name">Rapid Fire Mode</p>
                <p className="option-sub">Timed per question</p>
              </div>
            </div>
            <label className="switch-sm">
              <input
                type="checkbox"
                checked={settings.rapidFireMode}
                onChange={handleToggleRapidFire}
              />
              <span className="slider-sm round"></span>
            </label>
          </div>

          {settings.rapidFireMode && (
            <div className="rapid-chips-row animate-fade-in">
              <span className="chips-label">Timer:</span>
              <div className="chips-list">
                {[2, 3, 5, 10].map(s => (
                  <button
                    key={s}
                    className={`mini-chip ${settings.rapidFireSeconds === s ? 'active' : ''}`}
                    onClick={() => handleRapidFireSecsChange(s)}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ADHD Dopamine Mode Option */}
        <div className="dropdown-option-row">
          <div className="option-label-group">
            <Flame size={15} className="option-icon adhd-icon" />
            <div>
              <p className="option-name">ADHD Dopamine Mode</p>
              <p className="option-sub">Streaks, XP & Sound Chimes</p>
            </div>
          </div>
          <label className="switch-sm">
            <input
              type="checkbox"
              checked={settings.adhdMode}
              onChange={handleToggleAdhdMode}
            />
            <span className="slider-sm round"></span>
          </label>
        </div>

        {/* Reveal Answer Mode Option */}
        <div className="dropdown-option-row reveal-row">
          <div className="option-label-group">
            <Eye size={15} className="option-icon reveal-icon" />
            <div>
              <p className="option-name">Reveal Answer Mode</p>
              <p className="option-sub">Show answer on 3 fails or button</p>
            </div>
          </div>
          <label className="switch-sm">
            <input
              type="checkbox"
              checked={settings.revealAnswerMode}
              onChange={handleToggleRevealAnswer}
            />
            <span className="slider-sm round"></span>
          </label>
        </div>
      </div>

      <style>{`
        .settings-dropdown-wrapper {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 300px;
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 0.9rem;
          z-index: 80;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 0.75rem;
        }

        .dropdown-title {
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-main);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .dropdown-close-btn {
          color: var(--text-muted);
          padding: 0.15rem;
          border-radius: 4px;
        }

        .dropdown-close-btn:hover {
          background-color: #f1f5f9;
          color: var(--text-main);
        }

        .dropdown-options {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .dropdown-option-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0;
        }

        .dropdown-option-row-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .option-label-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .option-icon { color: var(--primary); }
        .rapid-icon { color: #d97706; }
        .adhd-icon { color: #ea580c; }
        .reveal-icon { color: #8b5cf6; }

        .option-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
        }

        .option-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .rapid-chips-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.5rem;
          background-color: #f8fafc;
          border-radius: var(--radius-sm);
        }

        .chips-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .chips-list {
          display: flex;
          gap: 0.3rem;
        }

        .mini-chip {
          padding: 0.15rem 0.45rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          background-color: #ffffff;
        }

        .mini-chip.active {
          background-color: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
        }

        /* Small Switch */
        .switch-sm {
          position: relative;
          display: inline-block;
          width: 36px;
          height: 20px;
          flex-shrink: 0;
        }

        .switch-sm input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider-sm {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #cbd5e1;
          transition: .2s;
          border-radius: 20px;
        }

        .slider-sm:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .2s;
          border-radius: 50%;
        }

        input:checked + .slider-sm {
          background-color: var(--primary);
        }

        input:checked + .slider-sm:before {
          transform: translateX(16px);
        }
      `}</style>
    </div>
  );
};
