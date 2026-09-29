import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useAuth();

  if (!toastMessage) return null;

  return (
    <div className="toast-container animate-toast">
      <div className="toast-body">
        <CheckCircle2 size={18} className="toast-icon" />
        <span>{toastMessage}</span>
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          pointer-events: none;
        }

        .toast-body {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background-color: #0f172a;
          color: #ffffff;
          padding: 0.65rem 1.25rem;
          border-radius: 9999px;
          box-shadow: var(--shadow-lg);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .toast-icon {
          color: #4ade80;
        }
      `}</style>
    </div>
  );
};
