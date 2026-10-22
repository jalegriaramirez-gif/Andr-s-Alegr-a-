import React, { useState } from 'react';
import { 
  Play, 
  X, 
  ExternalLink, 
  Minimize2, 
  Maximize2, 
  RotateCcw, 
  Video, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

interface VideoTutorialFloatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTutorialFloatingModal: React.FC<VideoTutorialFloatingModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Mode: 'modal' (centered, large) or 'floating' (bottom-right floating picture-in-picture window)
  const [isFloatingCorner, setIsFloatingCorner] = useState<boolean>(false);
  const [reloadKey, setReloadKey] = useState<number>(0);

  if (!isOpen) return null;

  // The Google Drive video ID provided by the user
  const fileId = "1pKaKQewh-LvWyFPfRjLQxYpWT39a3gr7fXtCtOMt-Fg";
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const directLink = `https://docs.google.com/videos/d/${fileId}/edit?usp=drive_link`;

  const handleToggleMode = () => {
    soundManager.playClick();
    setIsFloatingCorner(!isFloatingCorner);
  };

  const handleReload = () => {
    soundManager.playClick();
    setReloadKey((prev) => prev + 1);
  };

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  // 1. Bottom-Right Floating PiP Window Mode
  if (isFloatingCorner) {
    return (
      <div 
        aria-label="Ventana flotante de video tutorial"
        className="fixed bottom-5 right-5 z-50 w-[360px] sm:w-[440px] bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-emerald-500/80 overflow-hidden animate-fade-in no-print flex flex-col group select-none"
      >
        {/* Floating Header */}
        <div className="bg-slate-950 px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate font-display">
                Video Tutorial: Inducción SENA
              </h4>
              <p className="text-[10px] text-emerald-400 font-medium truncate">
                Modo Flotante • Controles integrados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleMode}
              title="Expandir a ventana completa"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir en Google Drive"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleClose}
              title="Cerrar video"
              className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video Player (16:9) */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            key={reloadKey}
            src={embedUrl}
            title="Video Tutorial Inducción SENA Google Drive"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Floating Quick Hint Bar */}
        <div className="px-3 py-1.5 bg-slate-950/90 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
          <span className="truncate">Controles de reproducción activos en el video</span>
          <button
            onClick={handleToggleMode}
            className="text-emerald-400 hover:underline font-bold text-[10px] ml-2 shrink-0 cursor-pointer"
          >
            Agrandar
          </button>
        </div>
      </div>
    );
  }

  // 2. Centered Large Floating Modal Mode
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in no-print">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-[#00324D] to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#39A900] text-white flex items-center justify-center shadow-md shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-display truncate">
                  Video Tutorial: Cómo Realizar la Inducción
                </h3>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Google Drive
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate">
                Paso a paso para el uso del prototipo digital interactivo SENA
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleReload}
              title="Recargar reproductor"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleMode}
              title="Minimizar a ventana flotante en la esquina"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden md:inline text-xs">Flotante</span>
            </button>
            <a
              href={directLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir directamente en Google Drive"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline text-xs">Drive</span>
            </a>
            <button
              onClick={handleClose}
              title="Cerrar video tutorial"
              className="p-2 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container with 16:9 Aspect Ratio */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <iframe
            key={reloadKey}
            src={embedUrl}
            title="Video Tutorial Inducción SENA Google Drive"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Bottom Information & Controls Guide */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00324D] dark:text-emerald-400">
              <Info className="w-4 h-4 shrink-0 text-[#39A900]" />
              <span>Controles de Reproducción Disponibles:</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
              Haz clic en reproducir (play), pausa, ajusta el volumen, adelanta/retrocede o activa <strong>pantalla completa</strong> con los controles en la parte inferior del video.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              onClick={handleToggleMode}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5 text-[#39A900]" />
              <span>Minimizar a la esquina</span>
            </button>

            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#00324D] hover:bg-[#002235] dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-md transition-all cursor-pointer"
            >
              Entendido / Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
