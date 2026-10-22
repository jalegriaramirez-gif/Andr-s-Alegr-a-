import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Gamepad2, 
  GraduationCap, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Search,
  Moon,
  Sun,
  FileSpreadsheet,
  Users,
  Shield,
  Eye,
  KeyRound,
  X,
  Lock,
  LogOut
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { SENA_LOGO_SVG } from '../data/senaData';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  xp: number;
  completedStationsCount: number;
  totalStations: number;
  hasPassedFinalExam: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  role: 'aprendiz' | 'instructor';
  onToggleRole: (newRole: 'aprendiz' | 'instructor') => void;
  onGoToLanding?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  xp,
  completedStationsCount,
  totalStations,
  hasPassedFinalExam,
  soundEnabled,
  setSoundEnabled,
  darkMode,
  onToggleDarkMode,
  role,
  onToggleRole,
  onGoToLanding,
  onLogout,
}) => {
  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
    if (next) soundManager.playClick();
  };

  // Handle PIN verification for instructor mode (Validates SENA1234)
  const handleVerifyPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = enteredPin.trim().toUpperCase();
    if (cleanPin === 'SENA1234' || cleanPin === 'SENA2024' || cleanPin === '1234' || cleanPin === 'INSTRUCTOR') {
      soundManager.playCorrect();
      setPinModalOpen(false);
      setEnteredPin('');
      setPinError(false);
      onToggleRole('instructor');
      setActiveTab('panel_instructor');
    } else {
      soundManager.playWrong();
      setPinError(true);
    }
  };

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    highlight?: string;
    isCert?: boolean;
    isPrimary?: boolean;
  }

  // Navigation items differentiated by role
  const apprenticeNavItems: NavItem[] = [
    { id: 'estaciones', label: 'Ruta de Estaciones', icon: BookOpen, badge: `${completedStationsCount}/${totalStations}` },
    { id: 'dilemas', label: 'Dilemas de Caso', icon: HelpCircle },
    { id: 'clasificador', label: 'Clasificador Veloz', icon: Gamepad2 },
    { id: 'evaluacion', label: 'Evaluación Final', icon: Award, highlight: hasPassedFinalExam ? 'Aprobada' : 'Pendiente' },
    { id: 'certificado', label: 'Certificado SENA', icon: GraduationCap, isCert: true },
    { id: 'plan', label: 'Plan de Inducción', icon: FileText },
    { id: 'reglamento', label: 'Explorador', icon: Search }
  ];

  const instructorNavItems: NavItem[] = [
    { id: 'panel_instructor', label: 'Panel Instructor', icon: Users, isPrimary: true },
    { id: 'sheets', label: 'Google Sheets', icon: FileSpreadsheet },
    { id: 'estaciones', label: 'Ruta Estaciones', icon: BookOpen },
    { id: 'dilemas', label: 'Dilemas', icon: HelpCircle },
    { id: 'clasificador', label: 'Clasificador', icon: Gamepad2 },
    { id: 'evaluacion', label: 'Evaluación', icon: Award },
    { id: 'certificado', label: 'Certificados', icon: GraduationCap },
    { id: 'plan', label: 'Plan', icon: FileText },
    { id: 'reglamento', label: 'Explorador', icon: Search }
  ];

  const navItems = role === 'instructor' ? instructorNavItems : apprenticeNavItems;

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors duration-300 no-print">
      {/* Top Bar with SENA identity, role switcher, and user stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          {/* Logo & Institution */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md shadow-[#39A900]/20 shrink-0 ring-2 ring-[#39A900]/30 p-1 border border-slate-200/80 dark:border-slate-700">
              <img
                src={SENA_LOGO_SVG}
                alt="Logo SENA"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#00324D] dark:text-emerald-400 tracking-tight text-lg sm:text-xl font-display">
                  SENA Inducción Digital
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#39A900]/10 dark:bg-[#39A900]/20 text-[#297a00] dark:text-[#55d910] border border-[#39A900]/30">
                  Acuerdo 0009 de 2024
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Servicio Nacional de Aprendizaje • Plataforma Institucional de Inducción
              </p>
            </div>
          </div>

          {/* Gamification Stats, Role Badges & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Role Indicator & Switcher */}
            {role === 'instructor' ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Modo</span>
                <span>Instructor</span>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onToggleRole('aprendiz');
                    setActiveTab('estaciones');
                  }}
                  title="Cambiar a vista de Aprendiz"
                  className="ml-1 text-[11px] underline hover:text-emerald-950 dark:hover:text-emerald-100 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden md:inline">Ver como Aprendiz</span>
                </button>
                {onGoToLanding && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onGoToLanding();
                    }}
                    title="Volver a la pantalla de selección de rol"
                    className="ml-1.5 pl-1.5 border-l border-emerald-300 dark:border-emerald-700 text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Cambiar Rol</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700">
                  <span>🎒 Aprendiz</span>
                </div>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setPinModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 bg-[#00324D]/10 hover:bg-[#00324D]/20 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#00324D] dark:text-emerald-300 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border border-[#00324D]/20 dark:border-slate-700 cursor-pointer"
                  title="Acceso exclusivo para el Instructor SENA"
                >
                  <Lock className="w-3.5 h-3.5 text-[#39A900] dark:text-emerald-400" />
                  <span className="hidden sm:inline">Acceso</span>
                  <span>Instructor</span>
                </button>
                {onGoToLanding && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onGoToLanding();
                    }}
                    title="Volver a la pantalla de selección de rol"
                    className="p-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span className="hidden sm:inline text-[11px] font-semibold">Cambiar Rol</span>
                  </button>
                )}
              </div>
            )}

            {/* XP Pill */}
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/50 text-amber-900 dark:text-amber-300 px-2.5 sm:px-3 py-1 rounded-xl text-xs sm:text-sm font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{xp} <span className="font-medium text-amber-700 dark:text-amber-400 text-xs">XP</span></span>
            </div>

            {/* Cert status indicator for apprentice */}
            {role === 'aprendiz' && hasPassedFinalExam && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab('certificado');
                }}
                className="hidden lg:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-600/50 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Certificado</span>
              </button>
            )}

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#39A900]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Dark Mode Toggle Button (Top Right) */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro (con efecto blur en pantalla)'}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer border ${
                darkMode
                  ? 'bg-amber-400/15 border-amber-400/30 text-amber-300 hover:bg-amber-400/25 shadow-xs shadow-amber-400/10'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-[#00324D]'
              }`}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:text-[#00324D]" />
              )}
            </button>

            {/* Cerrar Sesión Button */}
            {(onLogout || onGoToLanding) && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  if (onLogout) onLogout();
                  else if (onGoToLanding) onGoToLanding();
                }}
                title="Cerrar sesión y volver al landing page de selección de rol"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-1.5 overflow-x-auto py-2 scrollbar-none text-xs sm:text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#39A900] dark:text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive 
                        ? 'bg-[#39A900] dark:bg-emerald-800 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.isCert && hasPassedFinalExam && (
                  <span className="w-2 h-2 rounded-full bg-[#39A900] dark:bg-emerald-400 animate-ping" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Instructor PIN Security Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#00324D]/10 dark:bg-emerald-950/60 rounded-xl text-[#00324D] dark:text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#00324D] dark:text-white font-display">
                    Acceso de Instructor SENA
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ingresa el PIN de seguridad institucional
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPinModalOpen(false);
                  setEnteredPin('');
                  setPinError(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Código PIN de Instructor
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    autoFocus
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="Ingresa clave (Ej: SENA1234)"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border ${
                      pinError
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    } text-slate-900 dark:text-white focus:ring-2 focus:ring-[#39A900] outline-none font-mono tracking-widest`}
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-rose-500 mt-1 font-semibold">
                    Clave incorrecta. Intenta con SENA1234
                  </p>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                <span>Clave institucional de instructor: </span>
                <strong className="text-slate-700 dark:text-slate-200 font-mono">SENA1234</strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPinModalOpen(false);
                    setEnteredPin('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#00324D] hover:bg-[#002235] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Desbloquear Modo Instructor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
