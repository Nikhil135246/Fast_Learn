import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PracticeSettingsDropdown } from '../components/PracticeSettingsDropdown';
import { Play, Settings, Layers, ChevronDown, ChevronUp, Check, PlusCircle, Repeat, Zap, Eye } from 'lucide-react';

export const HomePage = () => {
  const { topics, activeTopicId, selectTopic, activeTopic, settings, navigateTo } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTopicListExpanded, setIsTopicListExpanded] = useState(false);

  const handleStart = () => {
    if (!activeTopic || !activeTopic.data || activeTopic.data.length === 0) {
      navigateTo('upload');
      return;
    }
    navigateTo('session');
  };

  const handleSelectTopicAndCollapse = (topicId) => {
    selectTopic(topicId);
    setIsTopicListExpanded(false);
  };

  return (
    <div className="home-container flex-center">
      <div className="home-content animate-fade-in">
        {/* Active Practice Badges / Mode pills */}
        <div className="practice-badges-row">
          {settings.flipMode && (
            <span className="mode-badge flip-badge">
              <Repeat size={12} /> Flip (Value → Key)
            </span>
          )}
          {settings.rapidFireMode && (
            <span className="mode-badge rapid-badge">
              <Zap size={12} /> Rapid Fire ({settings.rapidFireSeconds}s)
            </span>
          )}
          {settings.revealAnswerMode && (
            <span className="mode-badge reveal-badge">
              <Eye size={12} /> Reveal Mode
            </span>
          )}
        </div>

        {/* Main Center START Button */}
        <div className="start-wrapper">
          <button className="start-btn" onClick={handleStart} title="Click to start practice session">
            <Play size={44} className="play-icon" />
            <span className="start-label">START</span>
          </button>
        </div>

        {/* Minimal Topic Selector Container */}
        <div className="topic-selector-container">
          <div className="selector-header-bar">
            <div className="selector-title">
              <Layers size={16} color="var(--primary)" />
              <span>Selected Topic</span>
            </div>

            {/* Edit Button with attached Dropdown */}
            <div className="edit-dropdown-anchor">
              <button 
                className={`edit-settings-btn ${isSettingsOpen ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSettingsOpen(!isSettingsOpen);
                }}
                title="Practice Settings"
              >
                <Settings size={15} />
                <span>Edit</span>
              </button>

              <PracticeSettingsDropdown
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
              />
            </div>
          </div>

          {/* Active Topic Single Card / Expandable Button */}
          <div 
            className={`active-topic-trigger ${isTopicListExpanded ? 'expanded' : ''}`}
            onClick={() => setIsTopicListExpanded(!isTopicListExpanded)}
          >
            <div className="trigger-left">
              <span className="active-topic-name">{activeTopic.name}</span>
              <span className="active-topic-meta">{activeTopic.data ? activeTopic.data.length : 0} items</span>
            </div>
            <div className="trigger-right">
              {isTopicListExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          {/* Collapsible Scrollable Topic List */}
          {isTopicListExpanded && (
            <div className="scrollable-topics-dropdown animate-fade-in">
              <div className="topics-scroll-area">
                {topics.map((t) => {
                  const isSelected = t.id === activeTopicId;
                  return (
                    <div
                      key={t.id}
                      className={`topic-option-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectTopicAndCollapse(t.id)}
                    >
                      <div className="option-text">
                        <span className="option-title">{t.name}</span>
                        <span className="option-count">{t.data ? t.data.length : 0} items</span>
                      </div>
                      {isSelected && <Check size={16} className="check-icon" />}
                    </div>
                  );
                })}
              </div>

              <button 
                className="manage-topics-link"
                onClick={() => navigateTo('upload')}
              >
                <PlusCircle size={14} />
                <span>Manage Topics / Upload CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .home-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .home-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.75rem;
          width: 100%;
          max-width: 440px;
        }

        .practice-badges-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.4rem;
        }

        .mode-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .flip-badge {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .rapid-badge {
          background-color: #fef3c7;
          color: #d97706;
        }

        .reveal-badge {
          background-color: #f3e8ff;
          color: #7c3aed;
        }

        .start-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .start-btn {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          box-shadow: 0 12px 30px -4px rgba(37, 99, 235, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 4px solid #ffffff;
        }

        .start-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 16px 36px -4px rgba(37, 99, 235, 0.45);
        }

        .start-btn:active {
          transform: scale(0.97);
        }

        .play-icon {
          margin-left: 6px;
        }

        .start-label {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        /* Minimal Topic Selector Container */
        .topic-selector-container {
          width: 100%;
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          padding: 1rem 1.25rem;
          position: relative;
        }

        .selector-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .selector-title {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .edit-dropdown-anchor {
          position: relative;
        }

        .edit-settings-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
        }

        .edit-settings-btn:hover, .edit-settings-btn.active {
          background-color: var(--primary-light);
          border-color: var(--primary);
        }

        /* Single Topic Trigger Card */
        .active-topic-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--primary);
          background-color: var(--primary-light);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .active-topic-trigger:hover {
          background-color: #e0e7ff;
        }

        .trigger-left {
          display: flex;
          flex-direction: column;
        }

        .active-topic-name {
          font-weight: 800;
          font-size: 1rem;
          color: var(--text-main);
        }

        .active-topic-meta {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
        }

        .trigger-right {
          color: var(--primary);
        }

        /* Scrollable Topics Dropdown */
        .scrollable-topics-dropdown {
          margin-top: 0.75rem;
          border-top: 1px solid var(--border-color);
          padding-top: 0.75rem;
        }

        .topics-scroll-area {
          max-height: 220px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding-right: 0.2rem;
        }

        /* Custom Scrollbar */
        .topics-scroll-area::-webkit-scrollbar {
          width: 5px;
        }
        .topics-scroll-area::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 4px;
        }

        .topic-option-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: #ffffff;
          cursor: pointer;
        }

        .topic-option-item:hover {
          border-color: var(--primary);
          background-color: #f8fafc;
        }

        .topic-option-item.selected {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }

        .option-text {
          display: flex;
          flex-direction: column;
        }

        .option-title {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .option-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .check-icon {
          color: var(--primary);
        }

        .manage-topics-link {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.5rem;
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-sm);
        }

        .manage-topics-link:hover {
          color: var(--text-main);
          background-color: #f8fafc;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .home-container {
            padding: 1.5rem 1rem;
          }

          .home-content {
            gap: 1.5rem;
          }

          .start-btn {
            width: 150px;
            height: 150px;
          }

          .start-label {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .home-container {
            padding: 1rem 0.75rem;
          }

          .home-content {
            gap: 1.25rem;
            max-width: 100%;
          }

          .start-btn {
            width: 130px;
            height: 130px;
          }

          .play-icon {
            width: 36px;
            height: 36px;
          }

          .start-label {
            font-size: 1.1rem;
          }

          .mode-badge {
            font-size: 0.7rem;
            padding: 0.2rem 0.5rem;
          }

          .topic-selector-container {
            padding: 0.85rem 1rem;
          }

          .selector-title {
            font-size: 0.8rem;
          }

          .edit-settings-btn {
            font-size: 0.8rem;
            padding: 0.3rem 0.6rem;
          }

          .active-topic-trigger {
            padding: 0.7rem 0.85rem;
          }

          .active-topic-name {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};
