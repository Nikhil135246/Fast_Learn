import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/audio';
import { Clock, X, Check, Flame, Zap, Award, Repeat, Eye, ArrowRight, HelpCircle } from 'lucide-react';

export const SessionPage = () => {
  const { activeTopic, settings, setActiveSessionResults, updateTopicMastery, navigateTo } = useAuth();

  const dataset = activeTopic && activeTopic.data ? activeTopic.data : [];

  // Shuffled Queue State
  const [shuffledDeck, setShuffledDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Input & Error State
  const [inputValue, setInputValue] = useState('');
  const [isError, setIsError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [lastSubmittedVal, setLastSubmittedVal] = useState(null);

  // Reveal Answer & Wrong Attempts Tracking
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Session Time Left
  const durationSecs = Number(settings?.sessionDuration) || 300;
  const [sessionTimeLeft, setSessionTimeLeft] = useState(durationSecs);

  // Rapid Fire Per-Question Timer State
  const [rapidFireTimeLeft, setRapidFireTimeLeft] = useState(settings?.rapidFireSeconds || 3);

  // Stats & ADHD Gamification State
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  // ADHD Mode Metrics
  const [streakCount, setStreakCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [floatingXp, setFloatingXp] = useState(null);

  const inputRef = useRef(null);

  // Shuffle helper
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize deck
  useEffect(() => {
    if (dataset.length > 0) {
      setShuffledDeck(shuffleArray(dataset));
      setCurrentIndex(0);
    }
  }, [activeTopic]);

  // Focus input automatically & reset question-specific flags
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setConsecutiveWrong(0);
    setIsAnswerRevealed(false);

    if (settings?.rapidFireMode) {
      setRapidFireTimeLeft(settings?.rapidFireSeconds || 3);
    }
  }, [currentIndex]);

  // Total Session Countdown Timer
  useEffect(() => {
    if (sessionTimeLeft <= 0) {
      handleFinishSession();
      return;
    }

    const timer = setInterval(() => {
      setSessionTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionTimeLeft]);

  // Rapid Fire Countdown Timer per question
  useEffect(() => {
    if (!settings?.rapidFireMode) return;

    if (rapidFireTimeLeft <= 0) {
      handleRapidFireTimeout();
      return;
    }

    const timer = setInterval(() => {
      setRapidFireTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [rapidFireTimeLeft, settings?.rapidFireMode]);

  const handleRapidFireTimeout = () => {
    if (settings?.adhdMode) {
      soundFx.playWrongSound();
    }

    setIncorrectCount(prev => prev + 1);
    setStreakCount(0);
    advanceToNextQuestion();
  };

  const handleFinishSession = () => {
    const total = correctCount + incorrectCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    if (activeTopic && activeTopic.id) {
      updateTopicMastery(activeTopic.id, accuracy);
    }

    setActiveSessionResults({
      total,
      correct: correctCount,
      incorrect: incorrectCount,
      accuracy,
      xp: totalXp,
      maxStreak: streakCount
    });

    navigateTo('results');
  };

  // Current Question Prompt and Expected Answer based on Flip Mode
  const rawItem = shuffledDeck[currentIndex] || { key: '', value: '' };

  const promptText = settings?.flipMode ? rawItem.value : rawItem.key;
  const targetAnswer = String(settings?.flipMode ? rawItem.key : rawItem.value).trim();
  const expectedLength = targetAnswer.length;

  const advanceToNextQuestion = () => {
    setInputValue('');
    setIsError(false);
    setIsShaking(false);
    setLastSubmittedVal(null);
    setConsecutiveWrong(0);
    setIsAnswerRevealed(false);

    if (currentIndex + 1 < shuffledDeck.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShuffledDeck(shuffleArray(dataset));
      setCurrentIndex(0);
    }
  };

  const handleManualReveal = () => {
    setIsAnswerRevealed(true);
  };

  // Submission Processor
  const processSubmission = (typed) => {
    const cleanTyped = String(typed).trim();

    if (cleanTyped === lastSubmittedVal && isError) return;
    setLastSubmittedVal(cleanTyped);

    if (cleanTyped.toLowerCase() === targetAnswer.toLowerCase()) {
      // CORRECT ANSWER
      setCorrectCount(prev => prev + 1);

      const newStreak = streakCount + 1;
      setStreakCount(newStreak);

      const multiplier = newStreak >= 10 ? 4 : newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      const earnedXp = 100 * multiplier;
      setTotalXp(prev => prev + earnedXp);

      if (settings?.adhdMode) {
        if (newStreak >= 3) {
          soundFx.playStreakSound();
        } else {
          soundFx.playCorrectSound();
        }

        const xpText = multiplier > 1 ? `+${earnedXp} XP (${multiplier}x Streak!)` : `+${earnedXp} XP`;
        setFloatingXp({ id: Date.now(), text: xpText });
        setTimeout(() => setFloatingXp(null), 900);
      }

      advanceToNextQuestion();
    } else {
      // INCORRECT ANSWER
      setIncorrectCount(prev => prev + 1);
      setStreakCount(0);
      setIsError(true);
      setIsShaking(true);

      const newWrongCount = consecutiveWrong + 1;
      setConsecutiveWrong(newWrongCount);

      // Auto reveal answer on 3 wrong attempts
      if (newWrongCount >= 3 || settings?.revealAnswerMode) {
        setIsAnswerRevealed(true);
      }

      if (settings?.adhdMode) {
        soundFx.playWrongSound();
      }

      setTimeout(() => setIsShaking(false), 350);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (isError) setIsError(false);

    if (expectedLength > 0 && val.trim().length >= expectedLength) {
      processSubmission(val);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (inputValue.trim().length > 0) {
      processSubmission(inputValue);
    }
  };

  const formatTime = (secs) => {
    const valid = isNaN(secs) || secs <= 0 ? 0 : secs;
    const m = Math.floor(valid / 60);
    const s = valid % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="session-container flex-center">
      <div className={`session-card animate-fade-in ${settings?.adhdMode ? 'adhd-session-card' : ''}`}>
        
        {/* Floating Dopamine XP Popup */}
        {floatingXp && (
          <div key={floatingXp.id} className="floating-xp-popup animate-float-up">
            <Award size={18} />
            <span>{floatingXp.text}</span>
          </div>
        )}

        {/* Top Header Controls */}
        <div className="session-header">
          <div className="header-left">
            <div className="timer-badge">
              <Clock size={16} />
              <span>{formatTime(sessionTimeLeft)}</span>
            </div>

            {settings?.flipMode && (
              <span className="mini-badge flip-mini">
                <Repeat size={12} /> Flipped
              </span>
            )}
          </div>

          {settings?.adhdMode && (
            <div className="xp-score-badge">
              <Zap size={15} color="#eab308" fill="#eab308" />
              <span>{totalXp} XP</span>
            </div>
          )}

          <button className="btn btn-subtle exit-btn" onClick={() => navigateTo('home')}>
            <X size={20} />
          </button>
        </div>

        {/* Rapid Fire Progress Bar */}
        {settings?.rapidFireMode && (
          <div className="rapid-fire-bar-container">
            <div
              className="rapid-fire-bar-fill"
              style={{
                width: `${(rapidFireTimeLeft / (settings?.rapidFireSeconds || 3)) * 100}%`
              }}
            ></div>
          </div>
        )}

        {/* ADHD Streak Badge */}
        {settings?.adhdMode && streakCount >= 2 && (
          <div className="streak-banner animate-fade-in">
            <Flame size={18} color="#ea580c" fill="#ea580c" />
            <span>{streakCount} STREAK COMBO! ({streakCount >= 10 ? '4x' : streakCount >= 5 ? '3x' : '2x'})</span>
          </div>
        )}

        {/* Question Prompt */}
        <div className="question-box">
          <span className="question-label">
            {settings?.flipMode ? 'VALUE → TYPE KEY' : 'KEY → TYPE VALUE'}
          </span>
          <h2 className="question-key">{promptText || '...'}</h2>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmitForm} className="answer-form">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className={`session-input ${isShaking ? 'animate-shake' : ''} ${isError ? 'input-error' : ''}`}
              placeholder="Type answer..."
              value={inputValue}
              onChange={handleInputChange}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>

          {/* Reveal Answer Banner or Manual Reveal Button */}
          {isAnswerRevealed ? (
            <div className="revealed-answer-banner animate-fade-in">
              <div className="reveal-text-group">
                <Eye size={16} className="reveal-banner-icon" />
                <span>Correct Answer: <strong>{targetAnswer}</strong></span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-xs skip-next-btn"
                onClick={advanceToNextQuestion}
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="session-subtool-row">
              {isError && (
                <p className="error-hint">Incorrect answer.</p>
              )}
              <button
                type="button"
                className="reveal-hint-btn"
                onClick={handleManualReveal}
                title="Reveal correct answer"
              >
                <HelpCircle size={14} />
                <span>Reveal Answer</span>
              </button>
            </div>
          )}
        </form>

        {/* Stats footer */}
        <div className="session-stats-footer">
          <div className="stat-pill correct-pill">
            <Check size={14} />
            <span>{correctCount}</span>
          </div>
          <div className="stat-pill incorrect-pill">
            <X size={14} />
            <span>{incorrectCount}</span>
          </div>
        </div>
      </div>

      <style>{`
        .session-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .session-card {
          width: 100%;
          max-width: 480px;
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .adhd-session-card {
          border-color: #fdba74;
          box-shadow: 0 10px 30px -5px rgba(234, 88, 12, 0.15);
        }

        .floating-xp-popup {
          position: absolute;
          top: -24px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 0.9rem;
          box-shadow: 0 8px 20px rgba(217, 119, 6, 0.4);
          z-index: 100;
        }

        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(10px) scale(0.9); }
          50% { opacity: 1; transform: translateY(-8px) scale(1.05); }
          100% { opacity: 0; transform: translateY(-24px) scale(0.95); }
        }

        .animate-float-up {
          animation: floatUp 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .session-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .timer-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background-color: var(--primary-light);
          color: var(--primary);
          padding: 0.4rem 0.8rem;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .mini-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.55rem;
          border-radius: 9999px;
          background-color: #f1f5f9;
          color: var(--text-main);
        }

        .xp-score-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background-color: #fef9c3;
          color: #a16207;
          border: 1px solid #fde047;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .exit-btn {
          color: var(--text-muted);
          padding: 0.3rem;
        }

        /* Rapid Fire Bar */
        .rapid-fire-bar-container {
          width: 100%;
          height: 6px;
          background-color: #f1f5f9;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 1.25rem;
        }

        .rapid-fire-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);
          transition: width 1s linear;
        }

        .streak-banner {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: #ffedd5;
          color: #c2410c;
          border: 1px solid #fdba74;
          padding: 0.3rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .question-box {
          text-align: center;
          margin-bottom: 1.75rem;
          width: 100%;
        }

        .question-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.08em;
        }

        .question-key {
          font-size: 2.75rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.03em;
          margin-top: 0.25rem;
          word-break: break-word;
        }

        .answer-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }

        .input-wrapper {
          width: 100%;
        }

        .session-input {
          width: 100%;
          text-align: center;
          font-size: 1.75rem;
          font-weight: 700;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 2px solid var(--border-color);
          background-color: #ffffff;
        }

        .session-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
        }

        .session-subtool-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 0.25rem;
        }

        .error-hint {
          font-size: 0.85rem;
          color: var(--danger);
          font-weight: 500;
        }

        .reveal-hint-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.8rem;
          color: #7c3aed;
          font-weight: 600;
          margin-left: auto;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
        }

        .reveal-hint-btn:hover {
          background-color: #f3e8ff;
        }

        .revealed-answer-banner {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f3e8ff;
          border: 1px solid #ddd6fe;
          color: #6b21a8;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }

        .reveal-text-group {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .reveal-banner-icon {
          color: #7c3aed;
        }

        .skip-next-btn {
          padding: 0.25rem 0.65rem;
          font-size: 0.8rem;
          background-color: #7c3aed;
        }

        .skip-next-btn:hover {
          background-color: #6d28d9;
        }

        .session-stats-footer {
          display: flex;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .stat-pill {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.3rem 0.7rem;
          border-radius: 9999px;
        }

        .correct-pill {
          background-color: var(--success-bg);
          color: var(--success);
        }

        .incorrect-pill {
          background-color: var(--danger-bg);
          color: var(--danger);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .session-container {
            padding: 1.5rem 1rem;
          }

          .session-card {
            padding: 1.5rem;
          }

          .question-key {
            font-size: 2.25rem;
          }

          .session-input {
            font-size: 1.5rem;
            padding: 0.65rem 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .session-container {
            padding: 1rem 0.5rem;
            align-items: flex-start;
            padding-top: 1.5rem;
          }

          .session-card {
            max-width: 100%;
            padding: 1.25rem 1rem;
            border-radius: var(--radius-md);
          }

          .session-header {
            margin-bottom: 1rem;
          }

          .timer-badge {
            padding: 0.3rem 0.6rem;
            font-size: 0.8rem;
          }

          .mini-badge {
            font-size: 0.7rem;
            padding: 0.2rem 0.45rem;
          }

          .xp-score-badge {
            padding: 0.3rem 0.6rem;
            font-size: 0.8rem;
          }

          .streak-banner {
            font-size: 0.75rem;
            padding: 0.25rem 0.7rem;
          }

          .question-box {
            margin-bottom: 1.25rem;
          }

          .question-label {
            font-size: 0.7rem;
          }

          .question-key {
            font-size: 1.85rem;
          }

          .session-input {
            font-size: 1.3rem;
            padding: 0.6rem 0.75rem;
            border-radius: var(--radius-sm);
          }

          .revealed-answer-banner {
            font-size: 0.8rem;
            padding: 0.45rem 0.7rem;
            flex-wrap: wrap;
            gap: 0.4rem;
          }

          .session-subtool-row {
            flex-wrap: wrap;
            gap: 0.3rem;
          }

          .session-stats-footer {
            margin-top: 1.25rem;
          }

          .stat-pill {
            font-size: 0.8rem;
            padding: 0.25rem 0.6rem;
          }

          .floating-xp-popup {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};
