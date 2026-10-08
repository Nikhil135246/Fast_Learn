import React, { useState, useEffect } from 'react';
import { X, Edit2, Save, BookOpen } from 'lucide-react';

export const ExplanationPanel = ({
  isOpen,
  onClose,
  explanation,
  onSaveExplanation,
  questionText
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(explanation || '');

  useEffect(() => {
    setEditedText(explanation || '');
    setIsEditing(false);
  }, [explanation, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveExplanation(editedText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(explanation || '');
    setIsEditing(false);
  };

  return (
    <>
      <div className="explanation-backdrop animate-fade-in" onClick={onClose}></div>
      <div className="explanation-panel">
        <div className="explanation-header">
          <div className="explanation-title">
            <BookOpen size={18} />
            <span className="question-truncate" title={questionText}>
              {questionText}
            </span>
          </div>
          <button className="icon-button close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="explanation-body">
          {isEditing ? (
            <div className="edit-container">
              <textarea
                className="explanation-textarea"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="Enter explanation..."
              />
              <div className="edit-actions">
                <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                <button className="btn-save" onClick={handleSave}>
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          ) : (
            <div className="view-container">
              <div className="explanation-content">
                {explanation ? explanation : <span className="empty-text">No explanation provided.</span>}
              </div>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} /> Edit Explanation
              </button>
            </div>
          )}
        </div>

        <style>{`
          .explanation-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
          }
          
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out;
          }
          
          .explanation-panel {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 450px;
            background-color: var(--card-bg, #ffffff);
            box-shadow: var(--shadow-lg, -4px 0 15px rgba(0,0,0,0.1));
            z-index: 1001;
            display: flex;
            flex-direction: column;
            animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .explanation-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-color, #e2e8f0);
            background-color: var(--bg-color, #f8fafc);
          }
          
          .explanation-title {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-main, #1e293b);
            font-weight: 600;
            overflow: hidden;
            flex: 1;
            margin-right: 12px;
          }
          
          .question-truncate {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
          }
          
          .icon-button {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-muted, #64748b);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            border-radius: var(--radius-sm, 4px);
            transition: background-color 0.2s;
          }
          
          .icon-button:hover {
            background-color: var(--border-color, #e2e8f0);
            color: var(--text-main, #1e293b);
          }
          
          .explanation-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          }
          
          .view-container, .edit-container {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          
          .explanation-content {
            flex: 1;
            white-space: pre-wrap;
            color: var(--text-main, #1e293b);
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          
          .empty-text {
            color: var(--text-muted, #64748b);
            font-style: italic;
          }
          
          .explanation-textarea {
            flex: 1;
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: var(--radius-md, 8px);
            resize: none;
            font-family: inherit;
            font-size: 15px;
            line-height: 1.6;
            color: var(--text-main, #1e293b);
            margin-bottom: 16px;
            background-color: var(--bg-color, #f8fafc);
            min-height: 200px;
          }
          
          .explanation-textarea:focus {
            outline: none;
            border-color: var(--primary, #3b82f6);
            box-shadow: 0 0 0 2px var(--primary-light, #bfdbfe);
          }
          
          .btn-edit {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 16px;
            background-color: var(--bg-color, #f8fafc);
            color: var(--text-main, #1e293b);
            border: 1px solid var(--border-color, #e2e8f0);
            border-radius: var(--radius-md, 8px);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            align-self: flex-start;
          }
          
          .btn-edit:hover {
            background-color: var(--border-color, #e2e8f0);
          }
          
          .edit-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
          
          .btn-cancel {
            padding: 8px 16px;
            background: none;
            border: none;
            color: var(--text-muted, #64748b);
            font-weight: 500;
            cursor: pointer;
            border-radius: var(--radius-md, 8px);
          }
          
          .btn-cancel:hover {
            background-color: var(--bg-color, #f8fafc);
            color: var(--text-main, #1e293b);
          }
          
          .btn-save {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background-color: var(--primary, #3b82f6);
            color: white;
            border: none;
            border-radius: var(--radius-md, 8px);
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          .btn-save:hover {
            background-color: var(--primary-hover, #2563eb);
          }
          
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @media (max-width: 480px) {
            .explanation-panel {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </>
  );
};
