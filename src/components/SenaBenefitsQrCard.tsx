import React, { useState } from 'react';
import { QrCode, ExternalLink, X, Gift, Sparkles, HeartHandshake, BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface SenaBenefitsQrCardProps {
  className?: string;
}

export const SenaBenefitsQrCard: React.FC<SenaBenefitsQrCardProps> = ({ className = '' }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Official SENA Apprentice Wellbeing and Benefits portal
  const benefitsUrl = "https://www.sena.edu.co/es-co/comunidades/aprendices/Paginas/bienestarAprendiz.aspx";

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(benefitsUrl)}&color=00324D&bgcolor=ffffff`;

  const benefitsList = [
    { title: "Apoyos de Sostenimiento", desc: "Apoyo económico mensual (Regular y FIC) para aprendices en formación titulada." },
    { title: "Monitorías del SENA", desc: "Incentivo económico para aprendices destacados que apoyen procesos formativos y tecnológicos." },
    { title: "Salud y Primeros Auxilios", desc: "Atención básica de enfermería, orientación psicológica y prevención en salud integral." },
    { title: "Deporte, Arte y Cultura", desc: "Torneos intercentros, grupos de danza, música, teatro y actividades recreativas gratuitas." },
    { title: "Fondo Emprender", desc: "Acompañamiento y capital semilla condonable para la creación de empresas de aprendices." },
    { title: "Liderazgo y Representación", desc: "Elección democrática de voceros y representantes ante el Comité y Dirección General." }
  ];

  return (
    <>
      {/* Fixed Widget in Bottom Left */}
      <aside 
        aria-label="Código QR Beneficios SENA para Aprendices"
        className={`fixed bottom-4 left-4 z-30 no-print transition-all duration-300 ${className}`}
      >
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-3 flex flex-col items-center select-none max-w-[210px] group transition-transform hover:shadow-2xl">
          {/* Header Title with Minimize Button */}
          <div className="w-full flex items-center justify-between gap-1 pb-1.5 border-b border-slate-100 dark:border-slate-800 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Gift className="w-3.5 h-3.5 text-[#39A900] dark:text-emerald-400 shrink-0" />
              <h4 className="text-[10px] font-black tracking-tight text-[#00324D] dark:text-white uppercase leading-tight font-display text-center">
                BENEFICIOS SENA PARA APRENDICES
              </h4>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? "Expandir" : "Minimizar"}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
            >
              {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {!isMinimized && (
            <div className="flex flex-col items-center">
              {/* Exact 2cm x 2cm QR Code Box */}
              <div
                style={{ width: '2cm', height: '2cm' }}
                onClick={() => {
                  soundManager.playClick();
                  setModalOpen(true);
                }}
                title="Escanear con tu celular para ver los beneficios o clic para ver detalles"
                className="bg-white p-1 rounded-xl border-2 border-[#39A900] shadow-sm flex items-center justify-center cursor-pointer overflow-hidden transition-transform duration-200 hover:scale-105 shrink-0"
              >
                <img
                  src={qrImageUrl}
                  alt="Código QR Beneficios SENA para Aprendices"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Subtitle / Scan Hint */}
              <p className="text-[9px] text-slate-500 dark:text-slate-400 text-center font-semibold mt-1.5 leading-tight">
                Escanea con tu celular
              </p>

              {/* Action Link to Open Benefits Modal */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setModalOpen(true);
                }}
                className="mt-1 text-[10px] font-bold text-[#39A900] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver Beneficios</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          )}

          {isMinimized && (
            <button
              onClick={() => setIsMinimized(false)}
              className="text-[10px] font-bold text-[#39A900] hover:underline cursor-pointer py-0.5"
            >
              Mostrar QR
            </button>
          )}
        </div>
      </aside>

      {/* Informative Modal about SENA Benefits */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl text-[#39A900] dark:text-emerald-400">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#00324D] dark:text-white font-display">
                    BENEFICIOS SENA PARA APRENDICES
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bienestar al Aprendiz • Formación Profesional Integral
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code Highlight in Modal */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div
                style={{ width: '2cm', height: '2cm' }}
                className="bg-white p-1 rounded-xl border-2 border-[#39A900] shadow-sm shrink-0 flex items-center justify-center"
              >
                <img
                  src={qrImageUrl}
                  alt="QR Beneficios SENA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-[#00324D] dark:text-emerald-300 block">
                  Enlace Directo Institucional
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Apunta con la cámara de tu smartphone hacia el código QR para acceder a las convocatorias de apoyos vigentes.
                </p>
                <a
                  href={benefitsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#39A900] dark:text-emerald-400 hover:underline mt-1"
                >
                  <span>Abrir portal oficial de Bienestar SENA</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* List of Main Benefits */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Principales Programas de Bienestar al Aprendiz:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {benefitsList.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <h5 className="text-xs font-bold text-[#00324D] dark:text-emerald-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39A900]" />
                      <span>{item.title}</span>
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-[#00324D] hover:bg-[#002235] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
