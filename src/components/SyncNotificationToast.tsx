import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  RefreshCw, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { autoSyncEngine, SyncEvent } from '../services/autoSyncEngine';

export const SyncNotificationToast: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<SyncEvent | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = autoSyncEngine.subscribe((event) => {
      setCurrentEvent(event);
      setVisible(true);

      // Auto-dismiss after 6 seconds for synced, queued, or error
      if (event.status !== 'syncing') {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 6500);
        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!visible || !currentEvent) return null;

  const isSynced = currentEvent.status === 'synced';
  const isSyncing = currentEvent.status === 'syncing';
  const isQueued = currentEvent.status === 'queued';
  const isError = currentEvent.status === 'error';

  return (
    <aside 
      aria-label="Notificación de sincronización"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-slideInRight no-print"
    >
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 ${
        isSynced
          ? 'bg-white/95 dark:bg-slate-900/95 border-emerald-500/40 shadow-emerald-500/10'
          : isSyncing
          ? 'bg-white/95 dark:bg-slate-900/95 border-blue-500/40 shadow-blue-500/10'
          : isQueued
          ? 'bg-white/95 dark:bg-slate-900/95 border-amber-500/40 shadow-amber-500/10'
          : 'bg-white/95 dark:bg-slate-900/95 border-rose-500/40 shadow-rose-500/10'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Status Icon */}
            <div className={`p-2 rounded-xl shrink-0 ${
              isSynced
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                : isSyncing
                ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
                : isQueued
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400'
            }`}>
              {isSynced && <CheckCircle2 className="w-5 h-5" />}
              {isSyncing && <RefreshCw className="w-5 h-5 animate-spin" />}
              {isQueued && <Clock className="w-5 h-5" />}
              {isError && <AlertCircle className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#39A900] dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  {isSynced && 'Sincronización Automática'}
                  {isSyncing && 'Guardando en la Nube...'}
                  {isQueued && 'Cola de Sincronización'}
                  {isError && 'Aviso de Sincronización'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                {currentEvent.message}
              </p>

              {/* Direct link button if available */}
              {currentEvent.sheetUrl && (
                <div className="pt-1.5">
                  <a
                    href={currentEvent.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00324D] dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    <span>Abrir Hoja de Cálculo en Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setVisible(false)}
            aria-label="Cerrar notificación"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
