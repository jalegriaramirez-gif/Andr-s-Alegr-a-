import React, { useState } from 'react';
import { 
  User, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  ShieldAlert, 
  GraduationCap 
} from 'lucide-react';
import { DILEMMA_CASES } from '../data/senaData';
import { soundManager } from '../utils/soundEffects';

interface DilemmaSimulatorProps {
  onAddXp: (amount: number) => void;
}

export const DilemmaSimulator: React.FC<DilemmaSimulatorProps> = ({ onAddXp }) => {
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [completedCases, setCompletedCases] = useState<Record<string, boolean>>({});

  const currentCase = DILEMMA_CASES[activeCaseIdx];

  const handleSelectOption = (idx: number) => {
    soundManager.playClick();
    setSelectedOptionIdx(idx);
    const chosen = currentCase.options[idx];

    if (chosen.isCorrect) {
      soundManager.playCorrect();
      if (!completedCases[currentCase.id]) {
        setCompletedCases((prev) => ({ ...prev, [currentCase.id]: true }));
        onAddXp(40);
      }
    } else {
      soundManager.playWrong();
    }
  };

  const handleNextCase = () => {
    soundManager.playClick();
    setSelectedOptionIdx(null);
    if (activeCaseIdx < DILEMMA_CASES.length - 1) {
      setActiveCaseIdx(activeCaseIdx + 1);
    } else {
      setActiveCaseIdx(0);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setSelectedOptionIdx(null);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Simulador Ético & Convivencia
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Resolución de Conflictos SENA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00324D] dark:text-slate-100 font-display">
              Dilemas del Aprendiz: ¿Qué harías tú?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Analiza situaciones cotidianas en centros de formación y toma la decisión correcta conforme al Acuerdo 0009 de 2024.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {DILEMMA_CASES.map((c, i) => (
              <button
                key={c.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCaseIdx(i);
                  setSelectedOptionIdx(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCaseIdx === i
                    ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                    : completedCases[c.id]
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Caso {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Dilemma Box */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors duration-200">
        {/* Case Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-[#39A900]/10 dark:bg-[#39A900]/20 text-[#297a00] dark:text-emerald-400 px-2.5 py-1 rounded-md">
              Caso #{activeCaseIdx + 1} de {DILEMMA_CASES.length}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Protagonista: <strong className="text-slate-700 dark:text-slate-200">{currentCase.protagonist}</strong>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              {currentCase.program}
            </span>
          </div>

          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            +40 XP por respuesta ética
          </span>
        </div>

        {/* Title and Narrative */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#00324D] dark:text-slate-100 mb-3">
            {currentCase.title}
          </h3>
          <div className="bg-slate-50 dark:bg-slate-800/60 border-l-4 border-[#39A900] p-4 rounded-r-xl">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "{currentCase.situation}"
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Selecciona la decisión adecuada:
          </h4>
          <div className="space-y-2.5">
            {currentCase.options.map((option, idx) => {
              const isSelected = selectedOptionIdx === idx;
              let btnClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

              if (isSelected) {
                if (option.isCorrect) {
                  btnClass = 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-400';
                } else {
                  btnClass = 'border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 ring-2 ring-rose-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnClass}`}
                >
                  <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-snug">{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Consequence Feedback Panel */}
        {selectedOptionIdx !== null && (
          <div
            className={`p-5 rounded-xl border transition-all ${
              currentCase.options[selectedOptionIdx].isCorrect
                ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50/80 dark:bg-rose-950/50 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div className="flex items-start gap-3">
              {currentCase.options[selectedOptionIdx].isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-[#39A900] dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-2 flex-1">
                <h5 className="text-sm font-bold">
                  {currentCase.options[selectedOptionIdx].isCorrect
                    ? '¡Excelente resolución basada en el reglamento!'
                    : '¡Cuidado! Esta conducta vulnera las normas institucionales.'}
                </h5>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {currentCase.options[selectedOptionIdx].consequence}
                </p>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700 inline-block">
                  Sustento normativo: <span className="text-[#00324D] dark:text-emerald-400">{currentCase.options[selectedOptionIdx].articleReference}</span>
                </div>
              </div>
            </div>

            {/* Action footer */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-end gap-2">
              {!currentCase.options[selectedOptionIdx].isCorrect && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Intentar otra opción</span>
                </button>
              )}
              <button
                onClick={handleNextCase}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#00324D] dark:bg-emerald-600 hover:bg-[#002235] dark:hover:bg-emerald-500 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Siguiente Caso</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
