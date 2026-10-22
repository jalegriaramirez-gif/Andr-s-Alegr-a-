import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Info,
  ChevronDown,
  Lock,
  Star,
  Check
} from 'lucide-react';
import { STATIONS_DATA, StationData } from '../data/senaData';
import { soundManager } from '../utils/soundEffects';
import { ApprenticeFigure } from './ApprenticeFigure';

interface StationsHubProps {
  completedStations: string[];
  onCompleteStation: (stationId: string, earnedXp: number) => void;
  onGoToEvaluation: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  Award,
  CheckCircle,
  AlertTriangle,
  Briefcase
};

// Actions and thematic descriptions alusive to apprentice behaviors in each station
const STATION_APPRENTICE_ACTIONS: Record<number, { actionTitle: string; actionDesc: string; badgeColor: string }> = {
  1: {
    actionTitle: "Apropiación de Identidad & Valores",
    actionDesc: "Aprendiz portando con orgullo el chaleco y logosímbolo SENA, conociendo el himno, bandera y principios éticos.",
    badgeColor: "border-[#39A900] text-[#297a00] bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300"
  },
  2: {
    actionTitle: "Ejercicio de Derechos & Seguridad EPP",
    actionDesc: "Aprendiz con casco y gafas de seguridad en taller, levantando la voz en participación democrática y debido proceso.",
    badgeColor: "border-sky-500 text-sky-700 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-300"
  },
  3: {
    actionTitle: "Cumplimiento de Deberes & Puntualidad",
    actionDesc: "Aprendiz con carné visible en el pecho, mochila técnica, verificando asistencia puntual y cuidando las instalaciones.",
    badgeColor: "border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300"
  },
  4: {
    actionTitle: "Sana Convivencia & Mediación Ética",
    actionDesc: "Aprendiz como mediador de paz y respeto mutuo, promoviendo el Código de Integridad y la justicia en el Comité.",
    badgeColor: "border-amber-500 text-amber-800 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300"
  },
  5: {
    actionTitle: "Etapa Productiva & Desempeño Laboral",
    actionDesc: "Aprendiz profesional con portafolio técnico y bitácoras, preparado para el contrato de aprendizaje y su certificación.",
    badgeColor: "border-purple-500 text-purple-700 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300"
  }
};

export const StationsHub: React.FC<StationsHubProps> = ({
  completedStations,
  onCompleteStation,
  onGoToEvaluation
}) => {
  const [activeStationId, setActiveStationId] = useState<string>(STATIONS_DATA[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedQuiz, setRevealedQuiz] = useState<Record<string, boolean>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentStation = STATIONS_DATA.find((s) => s.id === activeStationId) || STATIONS_DATA[0];
  const isCurrentCompleted = completedStations.includes(currentStation.id);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    soundManager.playClick();
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
    setValidationError(null);
  };

  const handleVerifyStationQuiz = () => {
    const questions = currentStation.challengeQuiz;
    let allAnswered = true;
    let allCorrect = true;

    for (const q of questions) {
      if (selectedAnswers[q.id] === undefined) {
        allAnswered = false;
        break;
      }
      if (selectedAnswers[q.id] !== q.correctAnswer) {
        allCorrect = false;
      }
    }

    if (!allAnswered) {
      setValidationError("Por favor selecciona una respuesta para cada pregunta antes de validar el reto.");
      soundManager.playWrong();
      return;
    }

    setValidationError(null);
    setRevealedQuiz((prev) => ({ ...prev, [currentStation.id]: true }));

    if (allCorrect) {
      soundManager.playFanfare();
      if (!isCurrentCompleted) {
        onCompleteStation(currentStation.id, 50);
      }
    } else {
      soundManager.playWrong();
    }
  };

  const handleGoToNextStation = () => {
    soundManager.playClick();
    const currentIndex = STATIONS_DATA.findIndex((s) => s.id === activeStationId);
    if (currentIndex < STATIONS_DATA.length - 1) {
      setActiveStationId(STATIONS_DATA[currentIndex + 1].id);
    } else {
      onGoToEvaluation();
    }
  };

  const allCompleted = STATIONS_DATA.every((s) => completedStations.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Top Banner: Progress Overview */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-[#39A900] dark:text-emerald-400 bg-[#39A900]/10 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-[#39A900]/30">
                Ruta Pedagógica Vertical
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Acuerdo 0009 de 2024</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#00324D] dark:text-white font-display tracking-tight">
              Ruta Formativa de las 5 Estaciones SENA
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Avanza verticalmente estación por estación. Cada hito representa una acción clave en tu formación integral, desde la identidad y derechos hasta tu etapa productiva y certificación oficial.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 min-w-[240px] shrink-0">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-600 dark:text-slate-300">Progreso de la Ruta:</span>
              <span className="text-[#39A900] dark:text-emerald-400 font-mono text-sm">
                {completedStations.length} / {STATIONS_DATA.length} Estaciones
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden p-0.5">
              <div 
                className="bg-gradient-to-r from-[#39A900] to-emerald-400 h-full transition-all duration-500 rounded-full shadow-xs"
                style={{ width: `${(completedStations.length / STATIONS_DATA.length) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
              <span>{Math.round((completedStations.length / STATIONS_DATA.length) * 100)}% completado</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">+{completedStations.length * 50} XP acumulados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Vertical Journey Roadmap (Left) and Active Station Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMN 1: VERTICAL ROADMAP WITH APPRENTICE FIGURES (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#39A900] animate-pulse" />
                <h3 className="font-bold text-sm sm:text-base text-[#00324D] dark:text-white font-display">
                  Sendero Vertical del Aprendiz
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Selecciona una estación
              </span>
            </div>

            {/* Vertical Trail Container */}
            <div className="relative space-y-4">
              {/* Connecting vertical roadmap line */}
              <div 
                className="absolute left-8 sm:left-9 top-8 bottom-8 w-1 bg-slate-200 dark:bg-slate-800 pointer-events-none rounded-full -z-0"
                aria-hidden="true"
              >
                {/* Dynamic colored progress along the trail */}
                <div 
                  className="w-full bg-gradient-to-b from-[#39A900] via-emerald-400 to-[#00324D] transition-all duration-500 rounded-full"
                  style={{
                    height: `${(completedStations.length / STATIONS_DATA.length) * 100}%`
                  }}
                />
              </div>

              {/* 5 Vertical Station Cards */}
              {STATIONS_DATA.map((st, index) => {
                const isCompleted = completedStations.includes(st.id);
                const isActive = activeStationId === st.id;
                const apprenticeAction = STATION_APPRENTICE_ACTIONS[st.number];
                const Icon = iconMap[st.iconName] || BookOpen;

                return (
                  <div
                    key={st.id}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveStationId(st.id);
                    }}
                    className={`relative z-10 rounded-2xl border transition-all duration-300 p-3.5 sm:p-4 cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-50/90 via-white to-white dark:from-emerald-950/50 dark:via-slate-900 dark:to-slate-900 border-[#39A900] dark:border-emerald-500 shadow-md ring-2 ring-[#39A900]/20'
                        : isCompleted
                        ? 'bg-white/80 dark:bg-slate-900/60 border-emerald-300 dark:border-emerald-800/70 hover:bg-emerald-50/40 dark:hover:bg-slate-800/60'
                        : 'bg-white/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Apprentice Character Figure for Station */}
                      <div className="relative shrink-0">
                        <ApprenticeFigure
                          stationNumber={st.number}
                          isCompleted={isCompleted}
                          isActive={isActive}
                          size="sm"
                          className="transition-transform duration-200 group-hover:scale-105"
                        />
                        {/* Status Check badge */}
                        <div className="absolute -bottom-1 -right-1">
                          {isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-[#39A900] text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : isActive ? (
                            <div className="w-5 h-5 rounded-full bg-[#00324D] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                              {st.number}
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                              {st.number}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Station Info & Action Description */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 mb-0.5">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                            isActive ? 'text-[#39A900] dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                          }`}>
                            Estación {st.number} • {st.legalBase.split('-')[1]?.trim() || 'Reglamento'}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-100 text-[#297a00] dark:bg-emerald-950 dark:text-emerald-300'
                              : isActive
                              ? 'bg-[#00324D] text-white dark:bg-emerald-600'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {isCompleted ? 'Superada ✓' : isActive ? 'En curso' : 'Pendiente'}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {st.title}
                        </h4>

                        {/* Apprentice action caption */}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                          {apprenticeAction.actionDesc}
                        </p>

                        {/* Badge name */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                            {st.badge}
                          </span>
                          <span className="text-[10px] font-bold text-[#39A900] dark:text-emerald-400 ml-auto shrink-0">
                            +50 XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMN 2: ACTIVE STATION WORKSPACE & INTERACTIVE CHALLENGE (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header of Active Station with Feature Illustration */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
              {/* Highlighted Apprentice Figure */}
              <div className="p-2 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <ApprenticeFigure
                  stationNumber={currentStation.number}
                  isCompleted={isCurrentCompleted}
                  isActive={true}
                  size="md"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#00324D] text-white">
                    Estación {currentStation.number} de 5
                  </span>
                  <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {currentStation.legalBase}
                  </span>
                  {isCurrentCompleted && (
                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-950/80 text-[#297a00] dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Insignia Ganada (+50 XP)
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-[#00324D] dark:text-white font-display tracking-tight">
                  {currentStation.title}
                </h3>

                {/* Apprentice Action Highlight Banner */}
                <div className="mt-2 text-xs font-medium bg-[#39A900]/10 dark:bg-emerald-950/50 text-[#1f5c00] dark:text-emerald-300 p-2.5 rounded-xl border border-[#39A900]/25">
                  <span className="font-bold">Acción del Aprendiz: </span>
                  {STATION_APPRENTICE_ACTIONS[currentStation.number].actionDesc}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {currentStation.summary}
                </p>
              </div>
            </div>

            {/* Deep Dive Key Points */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#39A900] dark:text-emerald-400" />
                <span>Conceptos Clave del Acuerdo 0009 de 2024</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentStation.keyPoints.map((point, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    <h5 className="text-xs sm:text-sm font-bold text-[#00324D] dark:text-emerald-300 mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#39A900] dark:bg-emerald-400 shrink-0" />
                      <span>{point.heading}</span>
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {point.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Station Challenge Quiz */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl p-5 sm:p-6 border border-emerald-200/80 dark:border-emerald-800/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#39A900] dark:text-emerald-400" />
                    <span>Reto de Apropiación: Estación {currentStation.number}</span>
                  </span>
                  <h4 className="text-base font-bold text-[#00324D] dark:text-white mt-0.5">
                    Responde correctamente para desbloquear la {currentStation.badge}
                  </h4>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-xs">
                    +50 XP
                  </span>
                </div>
              </div>

              {/* Validation Warning Alert (no window.alert!) */}
              {validationError && (
                <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 p-3 rounded-2xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Quiz Questions */}
              <div className="space-y-4">
                {currentStation.challengeQuiz.map((q, qIndex) => {
                  const isRevealed = revealedQuiz[currentStation.id];
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div 
                      key={q.id} 
                      className="bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center text-xs font-black shrink-0">
                          {qIndex + 1}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {q.question}
                        </h5>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pt-1 pl-8">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = userAnswer === optIndex;
                          let optionClasses = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200';

                          if (isOptionSelected) {
                            optionClasses = 'border-[#00324D] dark:border-emerald-400 bg-slate-100 dark:bg-slate-800 text-[#00324D] dark:text-emerald-300 font-semibold ring-1 ring-[#00324D] dark:ring-emerald-400';
                          }

                          if (isRevealed) {
                            if (optIndex === q.correctAnswer) {
                              optionClasses = 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-400';
                            } else if (isOptionSelected && !isCorrect) {
                              optionClasses = 'border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 line-through';
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${optionClasses}`}
                            >
                              <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className="flex-1 leading-relaxed">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Feedback */}
                      {isRevealed && (
                        <div 
                          className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 mt-2 ml-8 ${
                            isCorrect 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' 
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#39A900] dark:text-emerald-400" />
                          <div>
                            <strong className="block font-bold mb-0.5">
                              {isCorrect ? '¡Excelente! Respuesta Correcta:' : 'Respuesta Incorrecta:'}
                            </strong>
                            <p className="leading-relaxed">{q.explanation}</p>
                            <span className="block mt-1 text-[11px] font-medium opacity-80">
                              Fundamento: {q.legalArticle}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isCurrentCompleted ? '✓ Estación superada con éxito' : 'Valida tus respuestas para registrar el avance'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleVerifyStationQuiz}
                    className="flex-1 sm:flex-none bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Validar Reto</span>
                  </button>

                  {isCurrentCompleted && (
                    <button
                      onClick={handleGoToNextStation}
                      className="flex-1 sm:flex-none bg-[#00324D] hover:bg-[#002235] dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>
                        {currentStation.number < STATIONS_DATA.length ? 'Siguiente Estación' : 'Ir a Evaluación'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Global Celebration Banner When All 5 Stations are Completed */}
            {allCompleted && (
              <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-[#00324D] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg border border-emerald-400/30 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shrink-0">
                    <Star className="w-6 h-6 fill-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold font-display flex items-center gap-2">
                      ¡Felicitaciones! Recorriste las 5 Estaciones de la Inducción
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-100 mt-0.5 leading-relaxed">
                      Has acumulado todas las insignias formativas de la ruta vertical. Ahora puedes presentar la Evaluación Final para expedir tu Certificado Oficial SENA.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onGoToEvaluation();
                  }}
                  className="w-full sm:w-auto bg-white text-[#00324D] hover:bg-slate-100 font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Presentar Evaluación Final</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
