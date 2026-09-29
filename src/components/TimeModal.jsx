import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, X } from 'lucide-react';

export const TimeModal = ({ isOpen, onClose }) => {
  const { sessionTime, updateSessionTime } = useAuth();
  const [selectedOption, setSelectedOption] = useState(() => {
    if ([120, 240, 300, 600, 900].includes(sessionTime)) {
      return sessionTime;
    }
    return 'custom';
  });
  
  const [customMinutes, setCustomMinutes] = useState(() => {
    return Math.max(1, Math.floor(sessionTime / 60));
  });

  if (!isOpen) return null;

  const handleSelectPreset = (secs) => {
    setSelectedOption(secs);
    updateSessionTime(secs);
    onClose();
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      const totalSecs = mins * 60;
      updateSessionTime(totalSecs);
      onClose();
    }
  };

  const PRESETS = [
    { label: '2 minutes', value: 120 },
    { label: '4 minutes', value: 240 },
    { label: '5 minutes', value: 300 },
    { label: '10 minutes', value: 600 },
    { label: '15 minutes', value: 900 },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Clock size={18} color="var(--primary)" />
            <h3>Session Time Limit</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="preset-list">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              className={`preset-item ${selectedOption === preset.value ? 'active' : ''}`}
              onClick={() => handleSelectPreset(preset.value)}
            >
              <span>{preset.label}</span>
              {selectedOption === preset.value && <div className="active-dot"></div>}
            </button>
          ))}
        </div>

        <div className="custom-section">
          <button
            className={`preset-item ${selectedOption === 'custom' ? 'active' : ''}`}
            onClick={() => setSelectedOption('custom')}
          >
            <span>Custom</span>
            {selectedOption === 'custom' && <div className="active-dot"></div>}
          </button>

          {selectedOption === 'custom' && (
            <form onSubmit={handleApplyCustom} className="custom-form">
              <div className="custom-input-group">
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="Minutes"
                  autoFocus
                />
                <span className="unit-label">minutes</span>
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Set Time
              </button>
            </form>
          )}
        </div>

        <style>{`
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
            font-size: 1.1rem;
            font-weight: 700;
          }

          .close-btn {
            color: var(--text-muted);
            padding: 0.2rem;
            border-radius: var(--radius-sm);
          }

          .close-btn:hover {
            color: var(--text-main);
            background-color: #f1f5f9;
          }

          .preset-list {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            margin-bottom: 0.4rem;
          }

          .preset-item {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
            background-color: #ffffff;
            font-size: 0.95rem;
            color: var(--text-main);
            text-align: left;
            transition: all 0.15s ease;
          }

          .preset-item:hover {
            border-color: var(--primary);
            background-color: var(--primary-light);
          }

          .preset-item.active {
            border-color: var(--primary);
            background-color: var(--primary-light);
            font-weight: 600;
            color: var(--primary);
          }

          .active-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--primary);
          }

          .custom-section {
            margin-top: 0.4rem;
          }

          .custom-form {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
            padding: 0.5rem;
            background-color: #f8fafc;
            border-radius: var(--radius-sm);
            border: 1px dashed var(--border-color);
          }

          .custom-input-group {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            flex: 1;
          }

          .custom-input-group input {
            width: 80px;
            padding: 0.4rem 0.6rem;
          }

          .unit-label {
            font-size: 0.85rem;
            color: var(--text-muted);
          }

          .btn-sm {
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
          }
        `}</style>
      </div>
    </div>
  );
};
