import React, { useState } from 'react';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Layers, 
  CheckCircle, 
  BookOpen, 
  Users, 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Printer 
} from 'lucide-react';
import { INDUCTION_PLAN, SENA_IDENTITY } from '../data/senaData';

interface InductionPlanViewProps {
  onStartRoute: () => void;
}

export const InductionPlanView: React.FC<InductionPlanViewProps> = ({ onStartRoute }) => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00324D] via-[#002235] to-[#0a1926] text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-700/50">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 bg-[#39A900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#39A900]/20 text-[#39A900] dark:text-emerald-400 border border-[#39A900]/30 mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Marco Pedagógico & Plan Estratégico Institucional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display mb-3">
            Plan Estructurado de Inducción para Aprendices SENA
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Estrategia integral orientada a la apropiación del <strong className="text-white font-semibold">{SENA_IDENTITY.regulation}</strong>, 
            garantizando que cada aprendiz interiorice sus derechos, asuma con responsabilidad sus deberes y complete su inducción mediante retos gamificados con certificación verificable.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onStartRoute}
              className="inline-flex items-center gap-2 bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all duration-150 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explorar Prototipo en Acción</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Value Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4 transition-colors duration-200">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-[#39A900] dark:text-emerald-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Cero Desconocimiento</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Supera la lectura pasiva de PDFs de 40 páginas; el 100% de los derechos y deberes se abordan mediante casos reales del entorno SENA.
            </p>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4 transition-colors duration-200">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Gamificación Formativa</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Sistema de XP, retos clasificadores, dilemas éticos y evaluación con retroalimentación inmediata sin frustración punitiva.
            </p>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-4 transition-colors duration-200">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-[#00324D] dark:text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Reducción de Deserción</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Aclaración de los tiempos límite de inasistencia (3 días hábiles) y canales formales para evitar cancelaciones prematuras.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Phases Timeline Tabs */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors duration-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#00324D] dark:text-slate-100 font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#39A900] dark:text-emerald-400" />
              Ruta Metodológica de 4 Fases para la Inducción
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cronograma pedagógico estructurado para Centros de Formación Profesional Integral del SENA
            </p>
          </div>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 font-medium px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            Duración recomendada: 2 semanas (15 días)
          </span>
        </div>

        {/* Phase Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {INDUCTION_PLAN.map((phase) => {
            const isSelected = selectedPhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#39A900] dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 shadow-xs ring-2 ring-[#39A900]/20 dark:ring-emerald-400/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      isSelected 
                        ? 'bg-[#39A900] dark:bg-emerald-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Fase {phase.id}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{phase.duration}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{phase.title.split(':')[1] || phase.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{phase.tagline}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Phase Detail Card */}
        {(() => {
          const current = INDUCTION_PLAN.find((p) => p.id === selectedPhase) || INDUCTION_PLAN[0];
          return (
            <div className="bg-slate-50/80 dark:bg-slate-850/60 rounded-xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#00324D] dark:text-slate-100">{current.title}</h3>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{current.tagline}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 self-start md:self-auto">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{current.duration}</span>
                </div>
              </div>

              {/* Objective */}
              <div className="mb-5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Objetivo Clave</span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1 bg-white dark:bg-slate-800/90 p-3 rounded-lg border border-slate-200 dark:border-slate-700 leading-relaxed">
                  {current.objective}
                </p>
              </div>

              {/* Actions & Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {/* Actions */}
                <div className="bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#39A900] dark:text-emerald-400" />
                    Acciones Pedagógicas y Operativas
                  </h4>
                  <ul className="space-y-2">
                    {current.actions.map((act, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] dark:bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tools & Metodology */}
                <div className="space-y-4">
                  <div className="bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Herramientas & Entornos Sugeridos
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {current.tools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* KPI */}
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <h4 className="text-xs font-bold text-[#297a00] dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-[#39A900] dark:text-emerald-400" />
                      Indicador de Éxito (KPI)
                    </h4>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{current.kpi}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Institutional Actors and Responsibilities */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors duration-200">
        <h2 className="text-lg font-bold text-[#00324D] dark:text-slate-100 font-display mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#39A900] dark:text-emerald-400" />
          Roles Institucionales en la Inducción SENA
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-bold text-[#39A900] dark:text-emerald-400 block mb-1">Subdirección de Centro</span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Lidera la bienvenida institucional, garantiza los recursos físicos y aprueba los actos de certificación del aprendiz.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-bold text-[#00324D] dark:text-blue-400 block mb-1">Coordinación Académica</span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Organiza los horarios, asigna a los instructores líderes de ficha y orienta sobre trámites y novedades formativas.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1">Bienestar al Aprendiz</span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Acompaña la integración psicosocial, apoya casos de vulnerabilidad, lidera actividades deportivas y de salud.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block mb-1">Instructores Líderes y Voceros</span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Dinamizan los retos formativos en el aula, facilitan debates éticos y canalizan inquietudes democráticas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
