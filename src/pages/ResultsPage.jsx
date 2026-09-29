import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, RefreshCw, Home, CheckCircle2, XCircle, Target, Zap, Flame } from 'lucide-react';

export const ResultsPage = () => {
  const { activeSessionResults, navigateTo } = useAuth();

  const results = activeSessionResults || {
    total: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    xp: 0,
    maxStreak: 0
  };

  return (
    <div className="results-container flex-center">
      <div className="results-card animate-fade-in">
        <div className="trophy-wrapper">
          <Trophy size={40} className="trophy-icon" />
        </div>

        <h1 className="results-title">Time's Up!</h1>
        <p className="results-subtitle">Here is your session performance summary:</p>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-box correct-box">
            <CheckCircle2 size={20} className="metric-icon" />
            <span className="metric-value">{results.correct}</span>
            <span className="metric-label">Correct</span>
          </div>

          <div className="metric-box incorrect-box">
            <XCircle size={20} className="metric-icon" />
            <span className="metric-value">{results.incorrect}</span>
            <span className="metric-label">Incorrect</span>
          </div>

          <div className="metric-box total-box">
            <Target size={20} className="metric-icon" />
            <span className="metric-value">{results.total}</span>
            <span className="metric-label">Attempted</span>
          </div>

          <div className="metric-box accuracy-box">
            <span className="metric-value text-accuracy">{results.accuracy}%</span>
            <span className="metric-label">Accuracy</span>
          </div>

          {results.xp > 0 && (
            <div className="metric-box xp-box">
              <Zap size={20} className="metric-icon xp-icon" />
              <span className="metric-value xp-value">{results.xp}</span>
              <span className="metric-label">XP Earned</span>
            </div>
          )}

          {results.maxStreak > 1 && (
            <div className="metric-box streak-box">
              <Flame size={20} className="metric-icon streak-icon" />
              <span className="metric-value streak-value">{results.maxStreak}x</span>
              <span className="metric-label">Max Streak</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="results-actions">
          <button 
            className="btn btn-primary action-btn" 
            onClick={() => navigateTo('session')}
          >
            <RefreshCw size={18} />
            <span>Restart Session</span>
          </button>

          <button 
            className="btn btn-secondary action-btn" 
            onClick={() => navigateTo('home')}
          >
            <Home size={18} />
            <span>Return Home</span>
          </button>
        </div>
      </div>

      <style>{`
        .results-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .results-card {
          width: 100%;
          max-width: 440px;
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          padding: 2.25rem 2rem;
          text-align: center;
        }

        .trophy-wrapper {
          width: 64px;
          height: 64px;
          background-color: var(--primary-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .trophy-icon {
          color: var(--primary);
        }

        .results-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .results-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
          margin-bottom: 1.75rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
          margin-bottom: 2rem;
        }

        .metric-box {
          padding: 0.9rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
        }

        .correct-box {
          background-color: var(--success-bg);
          border-color: rgba(22, 163, 74, 0.2);
        }
        .correct-box .metric-icon, .correct-box .metric-value { color: var(--success); }

        .incorrect-box {
          background-color: var(--danger-bg);
          border-color: rgba(220, 38, 38, 0.2);
        }
        .incorrect-box .metric-icon, .incorrect-box .metric-value { color: var(--danger); }

        .total-box { background-color: #f8fafc; }
        .total-box .metric-icon { color: var(--text-muted); }

        .accuracy-box {
          background-color: var(--primary-light);
          border-color: rgba(37, 99, 235, 0.2);
        }
        .text-accuracy { color: var(--primary); }

        .xp-box {
          background-color: #fef9c3;
          border-color: #fde047;
        }
        .xp-icon, .xp-value { color: #d97706; }

        .streak-box {
          background-color: #ffedd5;
          border-color: #fdba74;
        }
        .streak-icon, .streak-value { color: #ea580c; }

        .metric-value {
          font-size: 1.4rem;
          font-weight: 800;
        }

        .metric-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .results-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-btn {
          width: 100%;
          padding: 0.7rem;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .results-card {
            padding: 2rem 1.5rem;
          }

          .results-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .results-container {
            padding: 1rem 0.5rem;
          }

          .results-card {
            max-width: 100%;
            padding: 1.5rem 1rem;
            border-radius: var(--radius-md);
          }

          .trophy-wrapper {
            width: 52px;
            height: 52px;
            margin-bottom: 1rem;
          }

          .results-title {
            font-size: 1.35rem;
          }

          .results-subtitle {
            font-size: 0.85rem;
            margin-bottom: 1.25rem;
          }

          .metrics-grid {
            gap: 0.65rem;
            margin-bottom: 1.5rem;
          }

          .metric-box {
            padding: 0.7rem;
          }

          .metric-value {
            font-size: 1.2rem;
          }

          .metric-label {
            font-size: 0.7rem;
          }

          .action-btn {
            padding: 0.65rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};
