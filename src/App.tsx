/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StationsHub } from './components/StationsHub';
import { DilemmaSimulator } from './components/DilemmaSimulator';
import { FastClassifierGame } from './components/FastClassifierGame';
import { FinalEvaluation } from './components/FinalEvaluation';
import { CertificateView } from './components/CertificateView';
import { InductionPlanView } from './components/InductionPlanView';
import { RegulationExplorer } from './components/RegulationExplorer';
import { GoogleSheetsSyncView } from './components/GoogleSheetsSyncView';
import { InstructorDashboard } from './components/InstructorDashboard';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { SyncNotificationToast } from './components/SyncNotificationToast';
import { SenaBenefitsQrCard } from './components/SenaBenefitsQrCard';
import { STATIONS_DATA } from './data/senaData';
import { soundManager } from './utils/soundEffects';
import { ApprenticeSheetRecord } from './services/googleSheetsService';
import { autoSyncEngine } from './services/autoSyncEngine';
import { initAuth } from './services/googleAuth';

export default function App() {
  // Read role from query params or localStorage
  const [role, setRole] = useState<'aprendiz' | 'instructor'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role');
      if (urlRole === 'instructor') return 'instructor';
      if (urlRole === 'aprendiz') return 'aprendiz';
    }
    const savedRole = localStorage.getItem('sena_user_role');
    return savedRole === 'instructor' ? 'instructor' : 'aprendiz';
  });

  // View state: 'landing' (Role Selection Landing Page) or 'app' (Main Prototype)
  const [currentView, setCurrentView] = useState<'landing' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      // If URL explicitly requests a role (e.g. ?role=aprendiz or ?role=instructor), jump directly into the app
      if (params.get('role')) {
        return 'app';
      }
    }
    const hasSelectedSession = sessionStorage.getItem('sena_session_role_selected');
    return hasSelectedSession === 'true' ? 'app' : 'landing';
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    return role === 'instructor' ? 'panel_instructor' : 'estaciones';
  });
  
  // Apprentice profile state for certificate and Google Sheets sync
  const [apprentice, setApprentice] = useState<ApprenticeSheetRecord>(() => {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const paramFicha = urlParams?.get('ficha');
    const paramPrograma = urlParams?.get('programa');
    const paramRegional = urlParams?.get('regional');
    const paramCentro = urlParams?.get('centro');

    const saved = localStorage.getItem('sena_apprentice_profile');
    let base: ApprenticeSheetRecord | null = null;
    if (saved) {
      try {
        base = JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    if (!base) {
      base = {
        fullName: 'JUAN CAMILO PÉREZ RODRÍGUEZ',
        docType: 'C.C.',
        docNumber: '1.020.849.521',
        fichaNumber: '2874192',
        programName: 'ANÁLISIS Y DESARROLLO DE SOFTWARE (ADSO)',
        regional: 'REGIONAL DISTRITO CAPITAL',
        centerName: 'CENTRO DE GESTIÓN DE MERCADOS, LOGÍSTICA Y TECNOLOGÍAS DE LA INFORMACIÓN',
        scorePercentage: 0,
        passedStatus: 'EN CURSO',
        certCode: `SENA-IND-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        dateIssued: new Date().toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    }

    if (paramFicha) base.fichaNumber = paramFicha;
    if (paramPrograma) base.programName = paramPrograma.toUpperCase();
    if (paramRegional) base.regional = paramRegional.toUpperCase();
    if (paramCentro) base.centerName = paramCentro.toUpperCase();

    return base;
  });

  const handleUpdateApprentice = (updates: Partial<ApprenticeSheetRecord>) => {
    setApprentice((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('sena_apprentice_profile', JSON.stringify(next));
      return next;
    });
  };

  // Persistent gamification state
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('sena_xp');
    return saved ? parseInt(saved, 10) : 50; // Starting welcoming XP
  });

  const [completedStations, setCompletedStations] = useState<string[]>(() => {
    const saved = localStorage.getItem('sena_completed_stations');
    return saved ? JSON.parse(saved) : [];
  });

  const [hasPassedFinalExam, setHasPassedFinalExam] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_passed_exam');
    return saved === 'true';
  });

  const [finalScore, setFinalScore] = useState<number>(() => {
    const saved = localStorage.getItem('sena_exam_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Dark mode state and full-screen blur transition state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_dark_mode');
    return saved === 'true';
  });

  const [isScreenBlurring, setIsScreenBlurring] = useState<boolean>(false);

  // Keep <html> element sync with .dark class for portal and document-level styles
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sena_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('sena_user_role', role);
  }, [role]);

  // Redirect apprentice if currently on an instructor-only tab
  useEffect(() => {
    if (role === 'aprendiz' && (activeTab === 'panel_instructor' || activeTab === 'sheets')) {
      setActiveTab('estaciones');
    }
  }, [role, activeTab]);

  useEffect(() => {
    localStorage.setItem('sena_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('sena_completed_stations', JSON.stringify(completedStations));
  }, [completedStations]);

  useEffect(() => {
    localStorage.setItem('sena_passed_exam', hasPassedFinalExam.toString());
  }, [hasPassedFinalExam]);

  useEffect(() => {
    localStorage.setItem('sena_exam_score', finalScore.toString());
  }, [finalScore]);

  const handleToggleRole = (newRole: 'aprendiz' | 'instructor') => {
    setRole(newRole);
    if (newRole === 'instructor') {
      setActiveTab('panel_instructor');
    } else {
      if (activeTab === 'panel_instructor' || activeTab === 'sheets') {
        setActiveTab('estaciones');
      }
    }
  };

  // Handler for selecting role from the Landing Page
  const handleSelectRoleFromLanding = (
    selectedRole: 'aprendiz' | 'instructor', 
    updatedApprentice?: ApprenticeSheetRecord
  ) => {
    if (updatedApprentice) {
      handleUpdateApprentice(updatedApprentice);
    }
    handleToggleRole(selectedRole);
    sessionStorage.setItem('sena_session_role_selected', 'true');
    setCurrentView('app');
  };

  const handleLogout = () => {
    soundManager.playClick();
    sessionStorage.removeItem('sena_session_role_selected');
    setCurrentView('landing');
  };

  const handleToggleDarkMode = () => {
    const nextMode = !darkMode;
    soundManager.playClick();
    
    // When activating dark mode (or toggling), trigger the screen blur wave effect
    if (nextMode) {
      setIsScreenBlurring(true);
      setTimeout(() => {
        setIsScreenBlurring(false);
      }, 850);
    } else {
      // Light mode switch
      setIsScreenBlurring(true);
      setTimeout(() => {
        setIsScreenBlurring(false);
      }, 500);
    }

    setDarkMode(nextMode);
  };

  const handleAddXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const handleCompleteStation = (stationId: string, earnedXp: number) => {
    if (!completedStations.includes(stationId)) {
      setCompletedStations((prev) => [...prev, stationId]);
      handleAddXp(earnedXp);
    }
  };

  // Automatically process any offline/queued sync records when Google Auth token is available
  useEffect(() => {
    const unsubscribe = initAuth((_user, token) => {
      autoSyncEngine.processQueue(token);
    });
    return () => unsubscribe();
  }, []);

  const handlePassExam = (correct: number, total: number) => {
    const percentage = Math.round((correct / total) * 100);
    setFinalScore(percentage);
    setHasPassedFinalExam(true);
    handleAddXp(150); // Large bonus XP for certification

    const updatedRecord: ApprenticeSheetRecord = {
      ...apprentice,
      scorePercentage: percentage,
      passedStatus: 'APROBADO',
      dateIssued: new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    handleUpdateApprentice(updatedRecord);

    // Completely automatic background synchronization to Google Sheets & Google Drive
    autoSyncEngine.triggerAutoSync(updatedRecord);
  };

  // If user is currently on the Landing Page, render the dedicated role selector
  if (currentView === 'landing') {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
        <RoleSelectionLanding
          apprentice={apprentice}
          onSelectRole={handleSelectRoleFromLanding}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />
        {/* Lower-left SENA Apprentice Benefits QR Code (2cm x 2cm) */}
        <SenaBenefitsQrCard />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 relative selection:bg-[#39A900] selection:text-white ${
      darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Ambient Glowing Orbs in Dark Mode for aesthetic glass blur backdrop */}
      {darkMode && (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />
          <div className="fixed bottom-20 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed top-1/2 left-10 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        </>
      )}

      {/* Screen Blur Wave Overlay Triggered on Dark Mode Transition */}
      {isScreenBlurring && (
        <div 
          className="fixed inset-0 z-50 pointer-events-none animate-screen-blur-wave flex items-center justify-center p-4"
          aria-hidden="true"
        >
          <div className="bg-slate-900/90 dark:bg-slate-950/90 border border-emerald-500/40 text-emerald-300 px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              {darkMode ? '🌙 Modo Oscuro Activado • Efecto Blur Aplicado' : '☀️ Modo Claro Activado'}
            </span>
          </div>
        </div>
      )}

      {/* Top Header with Dark Mode Toggle, Role Switcher and Back to Landing */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        xp={xp}
        completedStationsCount={completedStations.length}
        totalStations={STATIONS_DATA.length}
        hasPassedFinalExam={hasPassedFinalExam}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        role={role}
        onToggleRole={handleToggleRole}
        onGoToLanding={() => setCurrentView('landing')}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* INSTRUCTOR EXCLUSIVE: Dashboard */}
        {activeTab === 'panel_instructor' && role === 'instructor' && (
          <InstructorDashboard
            currentApprentice={apprentice}
            onSwitchToApprenticeView={() => handleToggleRole('aprendiz')}
            onSelectApprenticeForPreview={(selectedRecord) => {
              handleUpdateApprentice(selectedRecord);
              setActiveTab('certificado');
            }}
          />
        )}

        {/* INSTRUCTOR EXCLUSIVE: Google Sheets Direct View */}
        {activeTab === 'sheets' && role === 'instructor' && (
          <GoogleSheetsSyncView currentApprentice={apprentice} />
        )}

        {/* SHARED LEARNING STATIONS */}
        {activeTab === 'estaciones' && (
          <StationsHub
            completedStations={completedStations}
            onCompleteStation={handleCompleteStation}
            onGoToEvaluation={() => setActiveTab('evaluacion')}
          />
        )}

        {activeTab === 'dilemas' && (
          <DilemmaSimulator onAddXp={handleAddXp} />
        )}

        {activeTab === 'clasificador' && (
          <FastClassifierGame onAddXp={handleAddXp} />
        )}

        {activeTab === 'evaluacion' && (
          <FinalEvaluation
            onPassExam={handlePassExam}
            onGoToCertificate={() => setActiveTab('certificado')}
            hasPassedAlready={hasPassedFinalExam}
          />
        )}

        {activeTab === 'certificado' && (
          <CertificateView
            hasPassedFinalExam={hasPassedFinalExam}
            scorePercentage={finalScore}
            onGoToEvaluation={() => setActiveTab('evaluacion')}
            onGoToSheets={role === 'instructor' ? () => setActiveTab('sheets') : undefined}
            apprentice={apprentice}
            onUpdateApprentice={handleUpdateApprentice}
            isInstructor={role === 'instructor'}
          />
        )}

        {activeTab === 'plan' && (
          <InductionPlanView onStartRoute={() => setActiveTab('estaciones')} />
        )}

        {activeTab === 'reglamento' && (
          <RegulationExplorer />
        )}
      </main>

      {/* Footer (Hidden on print) */}
      <footer className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 no-print transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#39A900]"></span>
            <span className="font-bold text-[#00324D] dark:text-slate-200">SENA - Servicio Nacional de Aprendizaje</span>
            <span>• República de Colombia</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
            <span>
              Perfil actual: <strong className="text-slate-700 dark:text-slate-300 uppercase">{role}</strong>
            </span>
            <span>•</span>
            <button
              onClick={() => setCurrentView('landing')}
              className="text-[#39A900] dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              Cambiar Rol / Volver al Portal
            </button>
            <span>•</span>
            <span>
              Reglamento del Aprendiz: <strong className="text-slate-600 dark:text-slate-300">Acuerdo 0009 de 2024</strong>
            </span>
          </div>
        </div>
      </footer>

      {/* Lower-left SENA Apprentice Benefits QR Code (2cm x 2cm) */}
      <SenaBenefitsQrCard />

      {/* Non-intrusive automatic cloud sync notification toast */}
      <SyncNotificationToast />
    </div>
  );
}
