import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, User, Lock, ArrowRight } from 'lucide-react';

export const AuthPage = () => {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    if (isSignup) {
      const res = signup(username.trim(), password);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      const res = login(username.trim(), password);
      if (!res.success) {
        setError(res.message);
      }
    }
  };

  return (
    <div className="auth-page-container flex-center">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <div className="brand-badge">
            <Zap size={24} color="#ffffff" fill="#ffffff" />
          </div>
          <h1 className="auth-title">Fast Learner</h1>
          <p className="auth-subtitle">
            {isSignup ? 'Create a free account to begin memorizing' : 'Sign in to start your learning session'}
          </p>
        </div>

        {error && (
          <div className="auth-error-banner animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="username"
                type="text"
                placeholder="e.g. alex"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn">
            <span>{isSignup ? 'Create Account' : 'Log In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          {isSignup ? (
            <p>
              Already have an account?{' '}
              <button
                className="auth-switch-btn"
                onClick={() => {
                  setIsSignup(false);
                  setError('');
                }}
              >
                Log In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                className="auth-switch-btn"
                onClick={() => {
                  setIsSignup(true);
                  setError('');
                }}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>

      <style>{`
        .auth-page-container {
          min-height: 100vh;
          padding: 2rem 1rem;
          background-color: var(--bg-color);
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          background-color: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          padding: 2.25rem 2rem;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .brand-badge {
          width: 48px;
          height: 48px;
          background-color: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .auth-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }

        .auth-subtitle {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .auth-error-banner {
          background-color: var(--danger-bg);
          color: var(--danger);
          border: 1px solid rgba(220, 38, 38, 0.2);
          padding: 0.65rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.8rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon input {
          width: 100%;
          padding-left: 2.4rem;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .auth-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .auth-switch-btn {
          color: var(--primary);
          font-weight: 600;
          text-decoration: underline;
        }

        .auth-switch-btn:hover {
          color: var(--primary-hover);
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .auth-page-container {
            padding: 1.5rem 0.75rem;
          }

          .auth-card {
            max-width: 100%;
            padding: 1.75rem 1.25rem;
            border-radius: var(--radius-md);
          }

          .auth-title {
            font-size: 1.35rem;
          }

          .auth-subtitle {
            font-size: 0.8rem;
          }

          .brand-badge {
            width: 42px;
            height: 42px;
          }
        }
      `}</style>
    </div>
  );
};
