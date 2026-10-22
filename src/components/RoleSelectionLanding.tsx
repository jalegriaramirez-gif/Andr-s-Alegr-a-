import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Award, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Building2,
  Sparkles,
  Sun,
  Moon,
  Play,
  Video
} from 'lucide-react';
import { SENA_LOGO_SVG } from '../data/senaData';
import { soundManager } from '../utils/soundEffects';
import { ApprenticeSheetRecord } from '../services/googleSheetsService';
import { VideoTutorialFloatingModal } from './VideoTutorialFloatingModal';

interface RoleSelectionLandingProps {
  apprentice: ApprenticeSheetRecord;
  onSelectRole: (role: 'aprendiz' | 'instructor', updatedApprentice?: ApprenticeSheetRecord) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  apprentice,
  onSelectRole,
  darkMode,
  onToggleDarkMode,
}) => {
  const [selectedRoleType, setSelectedRoleType] = useState<'none' | 'aprendiz' | 'instructor'>('none');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  
  // Instructor authentication state
  const [instructorPassword, setInstructorPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Apprentice characterization form state (no password needed!)
  const [formData, setFormData] = useState({
    fullName: apprentice.fullName || '',
    docType: apprentice.docType || 'C.C.',
    docNumber: apprentice.docNumber || '',
    fichaNumber: apprentice.fichaNumber || '',
    programName: apprentice.programName || '',
    regional: apprentice.regional || 'REGIONAL DISTRITO CAPITAL',
    centerName: apprentice.centerName || 'CENTRO DE GESTIÓN DE MERCADOS, LOGÍSTICA Y TECNOLOGÍAS DE LA INFORMACIÓN'
  });
  const [apprenticeFormError, setApprenticeFormError] = useState<string | null>(null);

  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = instructorPassword.trim();
    if (cleanPass === 'SENA1234' || cleanPass.toUpperCase() === 'SENA1234') {
      soundManager.playCorrect();
      setPasswordError(null);
      onSelectRole('instructor');
    } else {
      soundManager.playWrong();
      setPasswordError('Clave incorrecta. Recuerda que la clave asignada es SENA1234.');
    }
  };

  const handleApprenticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      soundManager.playWrong();
      setApprenticeFormError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formData.docNumber.trim()) {
      soundManager.playWrong();
      setApprenticeFormError('Por favor ingresa tu número de documento de identidad.');
      return;
    }
    if (!formData.fichaNumber.trim()) {
      soundManager.playWrong();
      setApprenticeFormError('Por favor ingresa tu número de ficha de caracterización.');
      return;
    }
    if (!formData.programName.trim()) {
      soundManager.playWrong();
      setApprenticeFormError('Por favor ingresa el nombre de tu programa de formación.');
      return;
    }

    soundManager.playCorrect();
    setApprenticeFormError(null);

    const updated: ApprenticeSheetRecord = {
      ...apprentice,
      fullName: formData.fullName.trim().toUpperCase(),
      docType: formData.docType,
      docNumber: formData.docNumber.trim(),
      fichaNumber: formData.fichaNumber.trim(),
      programName: formData.programName.trim().toUpperCase(),
      regional: formData.regional.trim().toUpperCase(),
      centerName: formData.centerName.trim().toUpperCase()
    };

    onSelectRole('aprendiz', updated);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300 relative selection:bg-[#39A900] selection:text-white">
      {/* Ambient background glow */}
      {darkMode ? (
        <>
          <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed bottom-10 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="fixed top-0 left-1/4 w-[450px] h-[450px] bg-emerald-100/70 rounded-full blur-[130px] pointer-events-none -z-10" />
          <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-sky-100/60 rounded-full blur-[130px] pointer-events-none -z-10" />
        </>
      )}

      {/* Top Navigation / Brand Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md shadow-[#39A900]/20 p-1.5 border border-slate-200 dark:border-slate-700">
            <img
              src={SENA_LOGO_SVG}
              alt="Logo SENA"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#00324D] dark:text-emerald-400 text-lg sm:text-xl font-display tracking-tight">
                SENA Inducción Digital
              </span>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#39A900]/10 dark:bg-[#39A900]/20 text-[#297a00] dark:text-[#55d910] border border-[#39A900]/30">
                Acuerdo 0009 de 2024
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Servicio Nacional de Aprendizaje • Portal Oficial de Acceso por Roles
            </p>
          </div>
        </div>

        {/* Actions in Header */}
        <div className="flex items-center gap-2.5">
          {/* Video Tutorial Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setIsVideoModalOpen(true);
            }}
            title="Ver video tutorial de inducción (Google Drive)"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#39A900]/10 dark:bg-emerald-950/60 text-[#297a00] dark:text-emerald-400 hover:bg-[#39A900]/20 dark:hover:bg-emerald-900/60 border border-[#39A900]/30 transition-all cursor-pointer shadow-xs group"
          >
            <div className="w-5 h-5 rounded-full bg-[#39A900] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span className="hidden sm:inline">Video Tutorial</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer border ${
              darkMode
                ? 'bg-amber-400/15 border-amber-400/30 text-amber-300 hover:bg-amber-400/25 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#00324D] shadow-xs'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Hero & Role Selection Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#39A900]/10 dark:bg-emerald-950/60 text-[#297a00] dark:text-emerald-400 border border-[#39A900]/30 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bienvenido a la Inducción Institucional SENA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#00324D] dark:text-white font-display tracking-tight leading-tight">
            Selecciona tu Perfil de Ingreso
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 max-w-2xl mx-auto leading-relaxed">
            Para garantizar que las herramientas, seguimientos y permisos no se confundan, elige si ingresarás como <strong>Aprendiz</strong> o como <strong>Instructor</strong>.
          </p>
        </div>

        {/* Video Tutorial Banner CTA */}
        <div className="flex justify-center mb-10 animate-fade-in">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsVideoModalOpen(true);
            }}
            className="w-full max-w-xl group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-slate-900 via-[#00324D] to-slate-900 dark:from-slate-800 dark:via-slate-800/95 dark:to-slate-800 text-white shadow-xl hover:shadow-2xl hover:border-emerald-400/60 border border-emerald-500/30 transition-all duration-300 cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#39A900] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 font-display">
                    Video Tutorial Explicativo
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    Google Drive
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  ¿Cómo realizar la inducción en este prototipo?
                </h3>
                <p className="text-[11px] text-slate-300 dark:text-slate-400">
                  Haz clic para ver el video en ventana flotante con controles de reproducción.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0 pr-2">
              <span>Ver video</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* The Two Main Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start max-w-4xl mx-auto w-full">
          {/* CARD 1: APRENDIZ */}
          <div
            className={`rounded-3xl border transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden ${
              selectedRoleType === 'aprendiz'
                ? 'ring-2 ring-[#39A900] border-transparent shadow-[#39A900]/15'
                : 'border-slate-200 dark:border-slate-800 hover:border-[#39A900]/50 hover:shadow-xl'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#39A900] dark:text-emerald-400 shadow-xs">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700/60">
                  Sin Clave
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-[#00324D] dark:text-white font-display">
                  Soy Aprendiz
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Realiza tu proceso de inducción, recorre las estaciones formativas, interactúa con dilemas éticos y obtén tu certificado oficial.
                </p>
              </div>

              {/* Highlights */}
              <ul className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Sin contraseñas: solo registra tus datos de caracterización.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Ruta pedagógica interactiva con gamificación y puntos XP.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Expedición inmediata del Certificado Oficial al aprobar.</span>
                </li>
              </ul>
            </div>

            {/* CTA or Expanded Characterization Form */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              {selectedRoleType !== 'aprendiz' ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedRoleType('aprendiz');
                  }}
                  className="w-full bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md shadow-[#39A900]/20 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Ingresar como Aprendiz</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <form onSubmit={handleApprenticeSubmit} className="space-y-3.5 animate-fade-in text-left">
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 mb-2">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#39A900]" />
                      <span>Completa tus Datos de Caracterización (Sin clave):</span>
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Estos datos se usarán para generar tu certificado y registrar tu avance con tu instructor.
                    </p>
                  </div>

                  {apprenticeFormError && (
                    <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{apprenticeFormError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
                      placeholder="Ej: JUAN CAMILO PÉREZ RODRÍGUEZ"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-medium focus:ring-2 focus:ring-[#39A900] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Tipo Doc.
                      </label>
                      <select
                        value={formData.docType}
                        onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                        className="w-full px-2 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#39A900] outline-none"
                      >
                        <option value="C.C.">C.C.</option>
                        <option value="T.I.">T.I.</option>
                        <option value="C.E.">C.E.</option>
                        <option value="P.E.P.">P.E.P.</option>
                        <option value="P.P.T.">P.P.T.</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        No. Documento *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.docNumber}
                        onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                        placeholder="Ej: 1020849521"
                        className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#39A900] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Número de Ficha *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fichaNumber}
                      onChange={(e) => setFormData({ ...formData, fichaNumber: e.target.value })}
                      placeholder="Ej: 2874192"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-[#39A900] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Programa de Formación *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.programName}
                      onChange={(e) => setFormData({ ...formData, programName: e.target.value.toUpperCase() })}
                      placeholder="Ej: ANÁLISIS Y DESARROLLO DE SOFTWARE"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-medium focus:ring-2 focus:ring-[#39A900] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Regional SENA
                    </label>
                    <input
                      type="text"
                      value={formData.regional}
                      onChange={(e) => setFormData({ ...formData, regional: e.target.value.toUpperCase() })}
                      placeholder="Ej: REGIONAL DISTRITO CAPITAL"
                      className="w-full px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-medium focus:ring-2 focus:ring-[#39A900] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRoleType('none')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Iniciar Mi Inducción</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* CARD 2: INSTRUCTOR */}
          <div
            className={`rounded-3xl border transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden ${
              selectedRoleType === 'instructor'
                ? 'ring-2 ring-[#00324D] dark:ring-emerald-400 border-transparent shadow-[#00324D]/15'
                : 'border-slate-200 dark:border-slate-800 hover:border-[#00324D]/50 hover:shadow-xl'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#00324D]/10 dark:bg-slate-800 border border-[#00324D]/20 dark:border-slate-700 flex items-center justify-center text-[#00324D] dark:text-emerald-400 shadow-xs">
                  <Users className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-[#00324D] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  Requiere Clave
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-[#00324D] dark:text-white font-display">
                  Soy Instructor
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Supervisa el avance de tus aprendices, genera enlaces de inducción con QR para la clase y sincroniza los resultados oficiales en Google Sheets.
                </p>
              </div>

              {/* Highlights */}
              <ul className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Requiere clave institucional de acceso docente (<strong>SENA1234</strong>).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Monitoreo de aprendices evaluados y reportes exportables en CSV.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Control de Google Drive y creación de hoja de cálculo oficial.</span>
                </li>
              </ul>
            </div>

            {/* CTA or Expanded Password Form */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              {selectedRoleType !== 'instructor' ? (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedRoleType('instructor');
                  }}
                  className="w-full bg-[#00324D] hover:bg-[#002235] dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md shadow-[#00324D]/20 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span>Ingresar como Instructor</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <form onSubmit={handleInstructorSubmit} className="space-y-4 animate-fade-in text-left">
                  <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 mb-2">
                    <span className="text-xs font-bold text-[#00324D] dark:text-slate-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                      <span>Ingresa la Clave Docente Asignada:</span>
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Para ingresar al perfil de instructor digita la clave <strong>SENA1234</strong>.
                    </p>
                  </div>

                  {passwordError && (
                    <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-2.5 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Clave de Instructor
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoFocus
                        required
                        value={instructorPassword}
                        onChange={(e) => {
                          setInstructorPassword(e.target.value);
                          setPasswordError(null);
                        }}
                        placeholder="Digita SENA1234"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono tracking-wider focus:ring-2 focus:ring-[#00324D] dark:focus:ring-emerald-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleType('none');
                        setInstructorPassword('');
                        setPasswordError(null);
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-[#00324D] hover:bg-[#002235] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Validar y Entrar al Panel</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39A900]" />
            <span className="font-bold text-[#00324D] dark:text-slate-200">SENA - Servicio Nacional de Aprendizaje</span>
            <span>• República de Colombia</span>
          </div>
          <div>
            Reglamento del Aprendiz: <strong className="text-slate-700 dark:text-slate-300">Acuerdo 0009 de 2024</strong> • Plataforma de Inducción Pedagógica
          </div>
        </div>
      </footer>

      {/* Floating Video Tutorial Modal with Playback Controls */}
      <VideoTutorialFloatingModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};
