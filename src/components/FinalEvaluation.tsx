import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  GraduationCap, 
  Info 
} from 'lucide-react';
import { FINAL_EVALUATION_QUESTIONS } from '../data/senaData';
import { soundManager } from '../utils/soundEffects';

interface FinalEvaluationProps {
  onPassExam: (score: number, total: number) => void;
  onGoToCertificate: () => void;
  hasPassedAlready: boolean;
}

export const FinalEvaluation: React.FC<FinalEvaluationProps> = ({
  onPassExam,
  onGoToCertificate,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{ correct: number; total: number; percentage: number } | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const totalQuestions = FINAL_EVALUATION_QUESTIONS.length;
  const currentQ = FINAL_EVALUATION_QUESTIONS[currentIdx];

  const handleSelectAnswer = (optionIdx: number) => {
    soundManager.playClick();
    setValidationWarning(null);
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: optionIdx
    }));
  };

  const handleNext = () => {
    soundManager.playClick();
    setValidationWarning(null);
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    setValidationWarning(null);
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitEvaluation = () => {
    // Check if all answered
    const unanswered = [];
    for (let i = 0; i < totalQuestions; i++) {
      if (answers[i] === undefined) {
        unanswered.push(i + 1);
      }
    }

    if (unanswered.length > 0) {
      setValidationWarning(`Por favor responde todas las preguntas antes de finalizar. Te faltan las preguntas: ${unanswered.join(', ')}`);
      soundManager.playWrong();
      return;
    }

    setValidationWarning(null);
    let correctCount = 0;
    FINAL_EVALUATION_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const result = {
      correct: correctCount,
      total: totalQuestions,
      percentage
    };
    setScoreResult(result);
    setIsSubmitted(true);

    if (percentage >= 80) {
      soundManager.playFanfare();
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#39A900', '#00324D', '#ffb703', '#ffffff']
      });
      onPassExam(correctCount, totalQuestions);
    } else {
      soundManager.playWrong();
    }
  };

  const handleRetry = () => {
    soundManager.playClick();
    setAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
    setCurrentIdx(0);
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#39A900] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Certificación de Inducción
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Acuerdo 0009 de 2024</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00324D] dark:text-slate-100 font-display">
              Evaluación Formativa de Inducción SENA
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Aprueba con al menos el 80% (8 de 10 preguntas) para desbloquear y expedir tu Certificado Oficial de Inducción.
            </p>
          </div>

          {/* Progress / Status indicator */}
          {!isSubmitted && (
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-right">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">Respondidas:</span>
              <span className="text-sm font-extrabold text-[#39A900] dark:text-emerald-400">
                {answeredCount} de {totalQuestions}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Warning Alert */}
      {validationWarning && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 p-4 rounded-xl text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-medium">{validationWarning}</span>
          </div>
          <button 
            onClick={() => setValidationWarning(null)}
            className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Evaluation Body */}
      {!isSubmitted ? (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors duration-200">
          {/* Stepper Dots / Quick jump */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 scrollbar-none">
            {FINAL_EVALUATION_QUESTIONS.map((_, i) => {
              const isAnswered = answers[i] !== undefined;
              const isCurrent = currentIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentIdx(i);
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#00324D] dark:bg-emerald-600 text-white ring-2 ring-[#00324D]/30 dark:ring-emerald-400/40'
                      : isAnswered
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#297a00] dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Display */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Pregunta {currentIdx + 1} de {totalQuestions}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Dimensión: {currentQ.category.toUpperCase()}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#00324D] dark:text-slate-100 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectAnswer(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[#00324D] dark:border-emerald-400 bg-slate-100 dark:bg-slate-800 text-[#00324D] dark:text-emerald-300 font-medium ring-2 ring-[#00324D]/20 dark:ring-emerald-400/30 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        isSelected
                          ? 'border-[#00324D] dark:border-emerald-400 bg-[#00324D] dark:bg-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentIdx < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#00324D] dark:bg-emerald-600 hover:bg-[#002235] dark:hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitEvaluation}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#39A900] dark:bg-emerald-600 hover:bg-[#2e8300] dark:hover:bg-emerald-500 flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalizar y Calificar</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors duration-200">
          {scoreResult && scoreResult.percentage >= 80 ? (
            /* PASSED */
            <div className="text-center space-y-4 py-4">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#39A900] dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner border border-emerald-300 dark:border-emerald-700">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#39A900] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ¡Inducción Aprobada Exitosamente!
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-slate-100 font-display">
                  {scoreResult.percentage}% de Acierto ({scoreResult.correct}/{scoreResult.total})
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                  Has demostrado un conocimiento sólido de tus derechos, deberes, prohibiciones y la ruta formativa estipulada en el <strong>Acuerdo 0009 de 2024</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onGoToCertificate();
                  }}
                  className="bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-5 h-5" />
                  <span>Generar Certificado Oficial SENA</span>
                </button>
                <button
                  onClick={handleRetry}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir Evaluación</span>
                </button>
              </div>
            </div>
          ) : (
            /* FAILED / NEEDS IMPROVEMENT */
            <div className="text-center space-y-4 py-4">
              <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-inner border border-rose-300 dark:border-rose-700">
                <XCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                  Puntaje Insuficiente (Mínimo 80%)
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-slate-100 font-display">
                  {scoreResult?.percentage}% ({scoreResult?.correct}/{scoreResult?.total} Correctas)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                  Para emitir el certificado oficial de inducción debes alcanzar al menos 8 de 10 respuestas correctas. Revisa los fundamentos del reglamento e inténtalo nuevamente.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRetry}
                  className="bg-[#00324D] dark:bg-emerald-600 hover:bg-[#002235] dark:hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Intentar de Nuevo la Evaluación</span>
                </button>
              </div>
            </div>
          )}

          {/* Detailed Question Review Accordion */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold text-[#00324D] dark:text-slate-100 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#39A900] dark:text-emerald-400" />
              Revisión Formativa Detallada de Preguntas
            </h4>

            <div className="space-y-3">
              {FINAL_EVALUATION_QUESTIONS.map((q, idx) => {
                const userChoice = answers[idx];
                const isCorrect = userChoice === q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs sm:text-sm ${
                      isCorrect 
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60' 
                        : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[#39A900] dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {idx + 1}. {q.question}
                        </span>
                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-semibold">Tu respuesta: </span>
                          <span className={isCorrect ? 'text-[#297a00] dark:text-emerald-400 font-bold' : 'text-rose-700 dark:text-rose-400 line-through'}>
                            {userChoice !== undefined ? q.options[userChoice] : 'Sin responder'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                            <span>Respuesta correcta: </span>
                            <span>{q.options[q.correctAnswer]}</span>
                          </div>
                        )}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 italic">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
