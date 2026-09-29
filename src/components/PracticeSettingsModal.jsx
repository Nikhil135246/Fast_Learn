import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Repeat, Zap, Flame, X } from 'lucide-react';

export const PracticeSettingsModal = ({ isOpen, onClose }) => {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Settings size={20} color="var(--primary)" />
            <h3>Practice Settings</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="settings-options-list">
          {/* Flip Mode Option */}
          <div className="setting-card">
            <div className="setting-info">
              <div className="setting-icon-badge">
                <Repeat size={18} />
              </div>
              <div>
                <h4 className="setting-name">Flip Mode</h4>
                <p className="setting-desc">
                  {settings.flipMode ? 'Value → Key (e.g. 80 → HTTP)' : 'Key → Value (e.g. HTTP → 80)'}
                </p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.flipMode}
                onChange={handleToggleFlipMode}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {/* Rapid Fire Mode Option */}
          <div className="setting-card-group">
            <div className="setting-card">
              <div className="setting-info">
                <div className="setting-icon-badge rapid-badge">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="setting-name">Rapid Fire Mode</h4>
                  <p className="setting-desc">Auto-advance if question timer expires</p>
                </div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.rapidFireMode}
                  onChange={handleToggleRapidFire}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {settings.rapidFireMode && (
              <div className="sub-setting-panel animate-fade-in">
                <label className="sub-label">Time per Question:</label>
                <div className="time-chips">
                  {[2, 3, 5, 10].map(s => (
                    <button
                      key={s}
                      className={`time-chip ${settings.rapidFireSeconds === s ? 'active' : ''}`}
                      onClick={() => handleRapidFireSecsChange(s)}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ADHD Mode Option */}
          <div className="setting-card adhd-card">
            <div className="setting-info">
              <div className="setting-icon-badge adhd-badge">
                <Flame size={18} />
              </div>
              <div>
                <h4 className="setting-name">ADHD Dopamine Mode</h4>
                <p className="setting-desc">Streaks, XP points, floating popups & audio chimes</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.adhdMode}
                onChange={handleToggleAdhdMode}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <button className="btn btn-primary done-btn" onClick={onClose}>
          Done
        </button>

        <style>{`
          .settings-modal-content {
            max-width: 440px;
          }

          .modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
          }

          .modal-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .modal-title h3 {
            font-size: 1.15rem;
            font-weight: 700;
          }

          .settings-options-list {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
            margin-bottom: 1.5rem;
          }

          .setting-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.85rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            background-color: #ffffff;
          }

          .adhd-card {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            border-color: #fdba74;
          }

          .setting-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .setting-icon-badge {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background-color: var(--primary-light);
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .rapid-badge {
            background-color: #fef3c7;
            color: #d97706;
          }

          .adhd-badge {
            background-color: #ffedd5;
            color: #ea580c;
          }

          .setting-name {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--text-main);
          }

          .setting-desc {
            font-size: 0.8rem;
            color: var(--text-muted);
          }

          /* Toggle Switch */
          .switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
            flex-shrink: 0;
          }

          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .slider {
            position: absolute;
            cursor: pointer;
            inset: 0;
            background-color: #cbd5e1;
            transition: .2s;
            border-radius: 24px;
          }

          .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .2s;
            border-radius: 50%;
          }

          input:checked + .slider {
            background-color: var(--primary);
          }

          input:checked + .slider:before {
            transform: translateX(20px);
          }

          .setting-card-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }

          .sub-setting-panel {
            padding: 0.6rem 0.8rem;
            background-color: #f8fafc;
            border-radius: var(--radius-sm);
            border: 1px dashed var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .sub-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--text-muted);
          }

          .time-chips {
            display: flex;
            gap: 0.35rem;
          }

          .time-chip {
            padding: 0.25rem 0.6rem;
            font-size: 0.8rem;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
            background-color: #ffffff;
            font-weight: 600;
          }

          .time-chip.active {
            background-color: var(--primary);
            color: #ffffff;
            border-color: var(--primary);
          }

          .done-btn {
            width: 100%;
            padding: 0.75rem;
          }
        `}</style>
      </div>
    </div>
  );
};
