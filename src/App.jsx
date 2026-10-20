import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { TimeModal } from './components/TimeModal';
import { Toast } from './components/Toast';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { SessionPage } from './pages/SessionPage';
import { ResultsPage } from './pages/ResultsPage';

const MainApp = () => {
  const { currentPage, loading } = useAuth();
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <Zap size={48} color="#2563eb" />
        <p style={{ color: '#64748b', fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage />;
      case 'home':
        return <HomePage />;
      case 'upload':
        return <UploadPage />;
      case 'session':
        return <SessionPage />;
      case 'results':
        return <ResultsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-root">
      <Navbar onOpenTimeModal={() => setIsTimeModalOpen(true)} />
      <Toast />
      <TimeModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
      />
      <main className="main-viewport">
        {renderPage()}
      </main>
      <style>{`
        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
