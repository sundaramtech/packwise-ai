import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { RecommendationWizard } from './components/RecommendationWizard';
import { RecommendationResultView } from './components/RecommendationResult';
import { MaterialExplorer } from './components/MaterialExplorer';
import { HistoryView } from './components/HistoryView';
import { AskPackWiseModal } from './components/AskPackWiseModal';
import { AdminPanel } from './components/AdminPanel';
import { QRVerifyModal } from './components/QRVerifyModal';
import { User, RecommendationResult, SavedRecommendation } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("packwise_user");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 'u-demo',
      full_name: 'Dr. Rajesh Kumar',
      email: 'demo@packwise.ai',
      user_type: 'Food Manufacturer'
    };
  });

  const [activeView, setActiveView] = useState<string>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const [activeResult, setActiveResult] = useState<RecommendationResult | null>(null);

  const [savedList, setSavedList] = useState<SavedRecommendation[]>(() => {
    const localKey = currentUser ? `packwise_recs_${currentUser.id}` : "packwise_recs_guest";
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Save list to localStorage on change
  useEffect(() => {
    const localKey = currentUser ? `packwise_recs_${currentUser.id}` : "packwise_recs_guest";
    localStorage.setItem(localKey, JSON.stringify(savedList));
  }, [savedList, currentUser]);

  // Persist user session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("packwise_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("packwise_user");
    }
  }, [currentUser]);

  const [askPackWiseOpen, setAskPackWiseOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeQRId, setActiveQRId] = useState('');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const handleWizardComplete = (result: RecommendationResult) => {
    setActiveResult(result);
    // Auto-save to user recommendation history
    const newSaved: SavedRecommendation = {
      id: result.recommendation_id,
      user_id: currentUser?.id || 'u-demo',
      user_name: currentUser?.full_name || 'PackWise User',
      commodity_name: result.commodity_name,
      date: new Date().toISOString().split('T')[0],
      material_name: result.primary_material.name,
      structure_code: result.primary_structure.code_name,
      compatibility_score: result.overall_score,
      storage_type: 'Ambient',
      shelf_life_days: 30,
      notes: '',
      result_data: result
    };
    setSavedList(prev => [newSaved, ...prev.filter(item => item.id !== newSaved.id)]);
    setActiveView('result');
  };

  const handleSaveRecommendation = (notes?: string) => {
    if (!activeResult) return;
    const newSaved: SavedRecommendation = {
      id: activeResult.recommendation_id,
      user_id: currentUser?.id || 'u-demo',
      user_name: currentUser?.full_name || 'PackWise User',
      commodity_name: activeResult.commodity_name,
      date: new Date().toISOString().split('T')[0],
      material_name: activeResult.primary_material.name,
      structure_code: activeResult.primary_structure.code_name,
      compatibility_score: activeResult.overall_score,
      storage_type: 'Ambient',
      shelf_life_days: 30,
      notes: notes || '',
      result_data: activeResult
    };
    setSavedList(prev => [newSaved, ...prev.filter(item => item.id !== newSaved.id)]);
  };

  const handleViewRecommendation = (recId: string) => {
    const found = savedList.find(s => s.id.toUpperCase() === recId.toUpperCase());
    if (found) {
      setActiveResult(found.result_data);
      setActiveView('result');
    }
  };

  const handleDeleteRecommendation = (recId: string) => {
    setSavedList(prev => prev.filter(item => item.id !== recId));
  };

  const handleOpenQR = (recId: string) => {
    setActiveQRId(recId);
    setQrModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7]/30 text-slate-dark antialiased font-sans flex flex-col">
      
      {/* Sticky Header Navigation */}
      <Header
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onStartRecommendation={() => {
              if (!currentUser) {
                handleOpenAuth('signup');
              } else {
                setActiveView('wizard');
              }
            }}
            onOpenAuth={handleOpenAuth}
            onExploreMaterials={() => setActiveView('explorer')}
          />
        )}

        {activeView === 'dashboard' && currentUser && (
          <Dashboard
            user={currentUser}
            onNewRecommendation={() => setActiveView('wizard')}
            onExploreMaterials={() => setActiveView('explorer')}
            onOpenHistory={() => setActiveView('history')}
            onOpenAskPackWise={() => setAskPackWiseOpen(true)}
            onViewRecommendation={handleViewRecommendation}
            savedList={savedList}
          />
        )}

        {activeView === 'wizard' && (
          <RecommendationWizard
            onComplete={handleWizardComplete}
            onCancel={() => setActiveView(currentUser ? 'dashboard' : 'landing')}
          />
        )}

        {activeView === 'result' && activeResult && (
          <RecommendationResultView
            result={activeResult}
            onBack={() => setActiveView('wizard')}
            onSave={handleSaveRecommendation}
            onOpenQR={handleOpenQR}
            onOpenAskPackWise={() => setAskPackWiseOpen(true)}
          />
        )}

        {activeView === 'explorer' && (
          <MaterialExplorer onBack={() => setActiveView(currentUser ? 'dashboard' : 'landing')} />
        )}

        {activeView === 'history' && (
          <HistoryView
            onBack={() => setActiveView('dashboard')}
            savedList={savedList}
            onViewRecommendation={handleViewRecommendation}
            onOpenQR={handleOpenQR}
            onDeleteRecommendation={handleDeleteRecommendation}
          />
        )}

        {activeView === 'admin' && (
          <AdminPanel onBack={() => setActiveView('dashboard')} />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <AskPackWiseModal
        isOpen={askPackWiseOpen}
        onClose={() => setAskPackWiseOpen(false)}
        activeResult={activeResult}
      />

      <QRVerifyModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        recommendationId={activeQRId}
        savedList={savedList}
        onSelectRecommendation={handleViewRecommendation}
      />

    </div>
  );
}

export default App;
