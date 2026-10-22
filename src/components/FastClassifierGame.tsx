import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  Award,
  Flame 
} from 'lucide-react';
import { FAST_SORTING_CARDS, FAULT_SEVERITY_CARDS } from '../data/senaData';
import { soundManager } from '../utils/soundEffects';

interface FastClassifierGameProps {
  onAddXp: (amount: number) => void;
}

export const FastClassifierGame: React.FC<FastClassifierGameProps> = ({ onAddXp }) => {
  const [gameMode, setGameMode] = useState<'normas' | 'faltas'>('normas');

  // Mode 1 state: Normas (Derecho / Deber / Prohibicion)
  const [cardIndexNormas, setCardIndexNormas] = useState<number>(0);
  const [streakNormas, setStreakNormas] = useState<number>(0);
  const [scoreNormas, setScoreNormas] = useState<number>(0);
  const [lastFeedbackNormas, setLastFeedbackNormas] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [gameFinishedNormas, setGameFinishedNormas] = useState<boolean>(false);

  // Mode 2 state: Faltas (Leve / Grave / Gravisima)
  const [cardIndexFaltas, setCardIndexFaltas] = useState<number>(0);
  const [streakFaltas, setStreakFaltas] = useState<number>(0);
  const [scoreFaltas, setScoreFaltas] = useState<number>(0);
  const [lastFeedbackFaltas, setLastFeedbackFaltas] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [gameFinishedFaltas, setGameFinishedFaltas] = useState<boolean>(false);

  // Handlers for Mode 1
  const handleAnswerNormas = (chosenCategory: 'derecho' | 'deber' | 'prohibicion') => {
    soundManager.playClick();
    const currentCard = FAST_SORTING_CARDS[cardIndexNormas];
    const isCorrect = currentCard.category === chosenCategory;

    if (isCorrect) {
      soundManager.playCorrect();
      const newStreak = streakNormas + 1;
      setStreakNormas(newStreak);
      const earnedPoints = 10 + newStreak * 2;
      setScoreNormas((prev) => prev + earnedPoints);
      onAddXp(earnedPoints);
      setLastFeedbackNormas({
        isCorrect: true,
        text: `¡Correcto! ${currentCard.explanation}`
      });
    } else {
      soundManager.playWrong();
      setStreakNormas(0);
      setLastFeedbackNormas({
        isCorrect: false,
        text: `¡Incorrecto! Esta afirmación corresponde a un(a) ${currentCard.category.toUpperCase()}. ${currentCard.explanation}`
      });
    }

    if (cardIndexNormas < FAST_SORTING_CARDS.length - 1) {
      setTimeout(() => {
        setCardIndexNormas((prev) => prev + 1);
        setLastFeedbackNormas(null);
      }, 1500);
    } else {
      setTimeout(() => {
        setGameFinishedNormas(true);
        soundManager.playFanfare();
      }, 1500);
    }
  };

  const handleResetNormas = () => {
    setCardIndexNormas(0);
    setStreakNormas(0);
    setScoreNormas(0);
    setLastFeedbackNormas(null);
    setGameFinishedNormas(false);
  };

  // Handlers for Mode 2
  const handleAnswerFaltas = (chosenSeverity: 'leve' | 'grave' | 'gravisima') => {
    soundManager.playClick();
    const currentCard = FAULT_SEVERITY_CARDS[cardIndexFaltas];
    const isCorrect = currentCard.severity === chosenSeverity;

    if (isCorrect) {
      soundManager.playCorrect();
      const newStreak = streakFaltas + 1;
      setStreakFaltas(newStreak);
      const earnedPoints = 15 + newStreak * 3;
      setScoreFaltas((prev) => prev + earnedPoints);
      onAddXp(earnedPoints);
      setLastFeedbackFaltas({
        isCorrect: true,
        text: `¡Correcto! ${currentCard.explanation}`
      });
    } else {
      soundManager.playWrong();
      setStreakFaltas(0);
      setLastFeedbackFaltas({
        isCorrect: false,
        text: `¡Incorrecto! Esta conducta califica como FALTA ${currentCard.severity.toUpperCase()}. ${currentCard.explanation}`
      });
    }

    if (cardIndexFaltas < FAULT_SEVERITY_CARDS.length - 1) {
      setTimeout(() => {
        setCardIndexFaltas((prev) => prev + 1);
        setLastFeedbackFaltas(null);
      }, 1500);
    } else {
      setTimeout(() => {
        setGameFinishedFaltas(true);
        soundManager.playFanfare();
      }, 1500);
    }
  };

  const handleResetFaltas = () => {
    setCardIndexFaltas(0);
    setStreakFaltas(0);
    setScoreFaltas(0);
    setLastFeedbackFaltas(null);
    setGameFinishedFaltas(false);
  };

  return (
    <div className="space-y-6">
      {/* Game Mode Selector Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#39A900] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Minijuego Interactivo
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Acuerdo 0009 de 2024</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00324D] dark:text-slate-100 font-display">
              Clasificador Veloz del Reglamento
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pon a prueba tus reflejos identificando al instante la naturaleza jurídica de cada acción.
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700">
            <button
              onClick={() => {
                soundManager.playClick();
                setGameMode('normas');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                gameMode === 'normas'
                  ? 'bg-white dark:bg-emerald-600 text-[#00324D] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Derecho / Deber / Prohibición
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setGameMode('faltas');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                gameMode === 'faltas'
                  ? 'bg-white dark:bg-emerald-600 text-[#00324D] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Calificador de Faltas (Leve/Grave)
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: NORMAS */}
      {gameMode === 'normas' && (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors duration-200">
          {!gameFinishedNormas ? (
            <>
              {/* Stats Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Tarjeta <strong className="text-slate-800 dark:text-slate-100">{cardIndexNormas + 1}</strong> de {FAST_SORTING_CARDS.length}
                  </span>
                  {streakNormas > 1 && (
                    <div className="flex items-center gap-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-700 animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Racha x{streakNormas}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#39A900] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Puntos: {scoreNormas}
                  </span>
                </div>
              </div>

              {/* Active Card */}
              <div className="min-h-[160px] flex items-center justify-center p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-900/90 border-2 border-slate-200 dark:border-slate-700 text-center shadow-inner relative">
                <span className="absolute top-3 left-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  ¿Cómo se clasifica esto en el SENA?
                </span>
                <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 max-w-xl leading-relaxed">
                  "{FAST_SORTING_CARDS[cardIndexNormas].text}"
                </p>
              </div>

              {/* Feedback Alert if just answered */}
              {lastFeedbackNormas && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 transition-all animate-fadeIn ${
                    lastFeedbackNormas.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {lastFeedbackNormas.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[#39A900] dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <p className="font-medium">{lastFeedbackNormas.text}</p>
                </div>
              )}

              {/* Category Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  disabled={lastFeedbackNormas !== null}
                  onClick={() => handleAnswerNormas('derecho')}
                  className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-extrabold text-sm transition-all duration-150 flex flex-col items-center gap-1 disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="text-xs uppercase text-[#297a00] dark:text-emerald-400">Opción 1</span>
                  <span>Es un DERECHO</span>
                </button>

                <button
                  disabled={lastFeedbackNormas !== null}
                  onClick={() => handleAnswerNormas('deber')}
                  className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-extrabold text-sm transition-all duration-150 flex flex-col items-center gap-1 disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="text-xs uppercase text-blue-600 dark:text-blue-400">Opción 2</span>
                  <span>Es un DEBER</span>
                </button>

                <button
                  disabled={lastFeedbackNormas !== null}
                  onClick={() => handleAnswerNormas('prohibicion')}
                  className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 font-extrabold text-sm transition-all duration-150 flex flex-col items-center gap-1 disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="text-xs uppercase text-rose-600 dark:text-rose-400">Opción 3</span>
                  <span>Es una PROHIBICIÓN</span>
                </button>
              </div>
            </>
          ) : (
            /* Finished state */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#39A900] dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-300 dark:border-emerald-700">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#00324D] dark:text-slate-100">
                ¡Completaste el Clasificador de Normas!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Has clasificado las 9 situaciones del reglamento con un puntaje de <strong className="text-emerald-700 dark:text-emerald-400">{scoreNormas} puntos</strong>.
              </p>
              <button
                onClick={handleResetNormas}
                className="bg-[#00324D] dark:bg-emerald-600 hover:bg-[#002235] dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jugar de Nuevo</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: FALTAS (LEVE, GRAVE, GRAVISIMA) */}
      {gameMode === 'faltas' && (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors duration-200">
          {!gameFinishedFaltas ? (
            <>
              {/* Stats Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Conducta <strong className="text-slate-800 dark:text-slate-100">{cardIndexFaltas + 1}</strong> de {FAULT_SEVERITY_CARDS.length}
                  </span>
                  {streakFaltas > 1 && (
                    <div className="flex items-center gap-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-700 animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Racha x{streakFaltas}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Puntos: {scoreFaltas}
                  </span>
                </div>
              </div>

              {/* Active Card */}
              <div className="min-h-[160px] flex items-center justify-center p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-amber-50/50 to-slate-100/90 dark:from-slate-800/80 dark:to-slate-900/90 border-2 border-slate-200 dark:border-slate-700 text-center shadow-inner relative">
                <span className="absolute top-3 left-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Clasificación de Gravedad (Acuerdo 0009 de 2024)
                </span>
                <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 max-w-xl leading-relaxed">
                  "{FAULT_SEVERITY_CARDS[cardIndexFaltas].text}"
                </p>
              </div>

              {/* Feedback Alert */}
              {lastFeedbackFaltas && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 transition-all animate-fadeIn ${
                    lastFeedbackFaltas.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {lastFeedbackFaltas.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[#39A900] dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <p className="font-medium">{lastFeedbackFaltas.text}</p>
                </div>
              )}

              {/* Severity Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  disabled={lastFeedbackFaltas !== null}
                  onClick={() => handleAnswerFaltas('leve')}
                  className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-extrabold text-sm transition-all duration-150 flex flex-col items-center gap-1 disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="text-xs uppercase text-amber-700 dark:text-amber-400">Llamado de Atención</span>
                  <span>Falta LEVE</span>
                </button>

                <button
                  disabled={lastFeedbackFaltas !== null}
                  onClick={() => handleAnswerFaltas('grave')}
                  className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 border border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200 font-extrabold text-sm transition-all duration-150 flex flex-col items-center gap-1 disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="text-xs uppercase text-orange-700 dark:text-orange-400">Plan Mejoramiento / Comité</span>
                  <span>Falta GRAVE</span>
                </button>

                <button
                  disabled={lastFeedbackFaltas !== null}
                  onClick={() => handleAnswerFaltas('gravisima')}
                  className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 font-extrabold text-sm transition-all duration-150 flex flex-col items-center gap-1 disabled:opacity-50 cursor-pointer shadow-xs active:scale-98"
                >
                  <span className="text-xs uppercase text-rose-700 dark:text-rose-400">Cancelación de Matrícula</span>
                  <span>Falta GRAVÍSIMA</span>
                </button>
              </div>
            </>
          ) : (
            /* Finished state */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-300 dark:border-amber-700">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#00324D] dark:text-slate-100">
                ¡Completaste la Clasificación de Faltas!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Ahora reconoces con exactitud los límites de la convivencia institucional y las medidas formativas del SENA.
              </p>
              <button
                onClick={handleResetFaltas}
                className="bg-[#00324D] dark:bg-emerald-600 hover:bg-[#002235] dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jugar de Nuevo</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
