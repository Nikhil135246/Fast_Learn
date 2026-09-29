import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { parseFileToKeyValuePairs } from '../utils/fileParser';
import { Upload, Plus, Trash2, Save, ArrowLeft, FileText, Table as TableIcon, CheckCircle, Edit2, Layers, Award } from 'lucide-react';

export const UploadPage = () => {
  const { topics, activeTopicId, selectTopic, addTopic, updateTopic, deleteTopic, navigateTo } = useAuth();
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'upload', 'edit'

  // Topic editing state
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [topicName, setTopicName] = useState('');
  const [columns, setColumns] = useState(['Key', 'Value']);
  const [rows, setRows] = useState([['', '']]);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle uploading multiple files (each creates a topic!)
  const handleMultipleFilesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setErrorMsg('');
    let addedCount = 0;

    for (let file of files) {
      try {
        const parsedData = await parseFileToKeyValuePairs(file);
        if (parsedData.length > 0) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
          const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          
          const newTopic = {
            id: 'topic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            name: formattedName,
            isBuiltIn: false,
            mastery: 0,
            data: parsedData
          };

          addTopic(newTopic);
          addedCount++;
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (addedCount > 0) {
      setActiveTab('list');
    } else {
      setErrorMsg('Failed to parse uploaded files. Ensure they are valid CSV or Excel files.');
    }
  };

  // Start Manual Creation
  const handleStartCreateTopic = () => {
    setEditingTopicId(null);
    setTopicName('New Topic');
    setColumns(['Key', 'Value']);
    setRows([
      ['', ''],
      ['', '']
    ]);
    setErrorMsg('');
    setActiveTab('edit');
  };

  // Start Editing Existing Topic
  const handleStartEditTopic = (topic) => {
    setEditingTopicId(topic.id);
    setTopicName(topic.name);
    setColumns(['Key', 'Value']);
    if (topic.data && topic.data.length > 0) {
      setRows(topic.data.map(item => [item.key, item.value]));
    } else {
      setRows([['', '']]);
    }
    setErrorMsg('');
    setActiveTab('edit');
  };

  // Table Row/Column Operations
  const handleAddRow = () => {
    setRows([...rows, new Array(columns.length).fill('')]);
  };

  const handleDeleteRow = (rIdx) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, idx) => idx !== rIdx));
  };

  const handleCellChange = (rIdx, cIdx, val) => {
    const updated = [...rows];
    updated[rIdx] = [...updated[rIdx]];
    updated[rIdx][cIdx] = val;
    setRows(updated);
  };

  // Save Topic (Add or Update)
  const handleSaveTopic = () => {
    setErrorMsg('');

    if (!topicName.trim()) {
      setErrorMsg('Please enter a topic title.');
      return;
    }

    const validData = [];
    for (let r of rows) {
      const k = r[0] ? String(r[0]).trim() : '';
      const v = r[1] ? String(r[1]).trim() : '';
      if (k && v) {
        validData.push({ key: k, value: v });
      }
    }

    if (validData.length === 0) {
      setErrorMsg('Please add at least one valid key-value pair.');
      return;
    }

    if (editingTopicId) {
      const existing = topics.find(t => t.id === editingTopicId);
      updateTopic(editingTopicId, {
        ...existing,
        name: topicName.trim(),
        data: validData
      });
    } else {
      const newTopic = {
        id: 'topic_' + Date.now(),
        name: topicName.trim(),
        isBuiltIn: false,
        mastery: 0,
        data: validData
      };
      addTopic(newTopic);
    }

    setActiveTab('list');
  };

  return (
    <div className="container upload-page-container animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <button className="btn btn-subtle back-btn" onClick={() => navigateTo('home')}>
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>
        <h1 className="page-title">Topic Management</h1>
        <p className="page-subtitle">Manage topics, track mastery levels, or upload multiple CSV files.</p>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <Layers size={16} />
          <span>All Topics ({topics.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          <Upload size={16} />
          <span>Upload CSV / Excel</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={handleStartCreateTopic}
        >
          <Plus size={16} />
          <span>New Topic</span>
        </button>
      </div>

      {errorMsg && (
        <div className="error-banner">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: ALL TOPICS LIST WITH MASTERY PROGRESS BAR */}
      {activeTab === 'list' && (
        <div className="topics-grid">
          {topics.map((t) => {
            const isSelected = t.id === activeTopicId;
            const masteryVal = Math.min(100, Math.max(0, t.mastery || 0));

            return (
              <div key={t.id} className={`topic-manager-card ${isSelected ? 'active-border' : ''}`}>
                <div className="topic-manager-header">
                  <div>
                    <h3 className="topic-manager-title">{t.name}</h3>
                    <span className="topic-manager-count">{t.data ? t.data.length : 0} items</span>
                  </div>
                  {isSelected ? (
                    <span className="selected-badge">
                      <CheckCircle size={14} /> Selected
                    </span>
                  ) : (
                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => selectTopic(t.id)}
                    >
                      Select
                    </button>
                  )}
                </div>

                {/* Mastery Progress Bar & Percentage */}
                <div className="mastery-section">
                  <div className="mastery-labels">
                    <span className="mastery-title">
                      <Award size={13} className="award-icon" /> Mastery Level
                    </span>
                    <span className="mastery-percent">{masteryVal}%</span>
                  </div>
                  <div className="mastery-bar-track">
                    <div 
                      className={`mastery-bar-fill ${masteryVal >= 80 ? 'high' : masteryVal >= 40 ? 'mid' : 'low'}`} 
                      style={{ width: `${masteryVal}%` }}
                    ></div>
                  </div>
                </div>

                <div className="topic-manager-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleStartEditTopic(t)}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>

                  {!t.isBuiltIn && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTopic(t.id)}
                      title="Delete Topic"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MULTIPLE FILE UPLOAD */}
      {activeTab === 'upload' && (
        <div className="upload-box-card">
          <label className="dropzone-area">
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              multiple
              onChange={handleMultipleFilesUpload}
              className="hidden-file-input"
            />
            <div className="dropzone-content">
              <FileText size={48} className="dropzone-icon" />
              <h3>Choose or drag one or multiple CSV/Excel files</h3>
              <p>Each file will be converted into a new selectable <strong>Topic</strong>.</p>
              <span className="btn btn-primary upload-browse-btn">Browse Files</span>
            </div>
          </label>
        </div>
      )}

      {/* TAB 3: TOPIC EDITOR */}
      {activeTab === 'edit' && (
        <div className="table-editor-wrapper">
          <div className="topic-name-row">
            <label>Topic Name:</label>
            <input
              type="text"
              className="topic-name-input"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Spanish Vocabulary"
            />
          </div>

          <div className="table-toolbar">
            <button className="btn btn-secondary btn-sm" onClick={handleAddRow}>
              <Plus size={16} />
              <span>Add Row</span>
            </button>
            <button className="btn btn-primary save-data-btn" onClick={handleSaveTopic}>
              <Save size={18} />
              <span>Save Topic</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="editor-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Key</th>
                  <th>Value</th>
                  <th style={{ width: '60px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="row-num">{rIdx + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={row[0] || ''}
                        onChange={(e) => handleCellChange(rIdx, 0, e.target.value)}
                        placeholder="Key (e.g. HTTP)"
                        className="cell-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row[1] || ''}
                        onChange={(e) => handleCellChange(rIdx, 1, e.target.value)}
                        placeholder="Value (e.g. 80)"
                        className="cell-input"
                      />
                    </td>
                    <td className="action-cell">
                      <button
                        className="delete-row-btn"
                        onClick={() => handleDeleteRow(rIdx)}
                        title="Delete Row"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .upload-page-container {
          padding-top: 2rem;
          padding-bottom: 3rem;
          max-width: 900px;
        }

        .page-header {
          margin-bottom: 1.5rem;
        }

        .back-btn {
          padding-left: 0;
          margin-bottom: 0.5rem;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
        }

        .page-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .tab-bar {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1.5rem;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          color: var(--text-muted);
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .tab-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .error-banner {
          background-color: var(--danger-bg);
          color: var(--danger);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(220, 38, 38, 0.2);
          margin-bottom: 1.25rem;
        }

        /* Topics Grid */
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }

        .topic-manager-card {
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: space-between;
          box-shadow: var(--shadow-sm);
        }

        .active-border {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .topic-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .topic-manager-title {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .topic-manager-count {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .selected-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 0.25rem 0.6rem;
          border-radius: 9999px;
        }

        /* Mastery Section */
        .mastery-section {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          background-color: #f8fafc;
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
        }

        .mastery-labels {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
        }

        .mastery-title {
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .award-icon {
          color: #d97706;
        }

        .mastery-percent {
          font-weight: 800;
          color: var(--text-main);
        }

        .mastery-bar-track {
          width: 100%;
          height: 6px;
          background-color: #e2e8f0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .mastery-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .mastery-bar-fill.high { background-color: #16a34a; }
        .mastery-bar-fill.mid { background-color: #2563eb; }
        .mastery-bar-fill.low { background-color: #64748b; }

        .btn-xs {
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
        }

        .topic-manager-actions {
          display: flex;
          gap: 0.5rem;
        }

        /* Dropzone */
        .upload-box-card {
          background-color: #ffffff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          padding: 2.5rem;
          text-align: center;
        }

        .dropzone-area {
          display: block;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 3rem 1.5rem;
          cursor: pointer;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .dropzone-area:hover {
          border-color: var(--primary);
          background-color: var(--primary-light);
        }

        .hidden-file-input {
          display: none;
        }

        .dropzone-icon {
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .dropzone-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .dropzone-content p {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
        }

        /* Editor */
        .table-editor-wrapper {
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
        }

        .topic-name-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .topic-name-row label {
          font-weight: 700;
          font-size: 0.95rem;
        }

        .topic-name-input {
          flex: 1;
          max-width: 350px;
          font-weight: 600;
        }

        .table-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .editor-table {
          width: 100%;
          border-collapse: collapse;
        }

        .editor-table th, .editor-table td {
          border: 1px solid var(--border-color);
          padding: 0.5rem;
        }

        .editor-table th {
          background-color: #f8fafc;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .row-num {
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .cell-input {
          width: 100%;
          border: 1px solid transparent;
          background: transparent;
          padding: 0.4rem 0.6rem;
        }

        .cell-input:focus {
          background: #ffffff;
        }

        .delete-row-btn {
          color: var(--text-muted);
          padding: 0.2rem 0.4rem;
        }

        .delete-row-btn:hover {
          color: var(--danger);
        }

        .action-cell {
          text-align: center;
        }
      `}</style>
    </div>
  );
};
