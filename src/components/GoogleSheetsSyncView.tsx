import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  UserCheck, 
  PlusCircle, 
  AlertCircle, 
  LogOut, 
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';
import { 
  googleSignIn, 
  logout, 
  getAccessToken, 
  initAuth 
} from '../services/googleAuth';
import { 
  getOrCreateInductionSpreadsheet, 
  appendApprenticeRecordToSheet, 
  fetchApprenticeSheetRows, 
  SpreadsheetInfo, 
  ApprenticeSheetRecord 
} from '../services/googleSheetsService';
import { User } from 'firebase/auth';
import { soundManager } from '../utils/soundEffects';
import { autoSyncEngine } from '../services/autoSyncEngine';

interface GoogleSheetsSyncViewProps {
  currentApprentice: ApprenticeSheetRecord;
}

export const GoogleSheetsSyncView: React.FC<GoogleSheetsSyncViewProps> = ({ currentApprentice }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetInfo | null>(() => {
    const savedId = localStorage.getItem('sena_induction_spreadsheet_id');
    if (savedId) {
      return {
        id: savedId,
        url: `https://docs.google.com/spreadsheets/d/${savedId}/edit`,
        title: 'SENA - Registro Oficial de Aprendices e Inducción (Acuerdo 0009 de 2024)',
      };
    }
    return null;
  });
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Confirmation modal state for mutating operations
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string>('');

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // When token is available, load or create the spreadsheet
  useEffect(() => {
    if (accessToken) {
      loadSpreadsheetAndData(accessToken);
    }
  }, [accessToken]);

  const loadSpreadsheetAndData = async (token: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const sheetInfo = await getOrCreateInductionSpreadsheet(token);
      setSpreadsheet(sheetInfo);

      const tableData = await fetchApprenticeSheetRows(token, sheetInfo.id);
      setHeaders(tableData.headers);
      setSheetRows(tableData.rows);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido al cargar Google Sheets';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    soundManager.playClick();
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
        soundManager.playCorrect();
        // Flush any offline pending sync records immediately
        await autoSyncEngine.processQueue(result.accessToken);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión con Google';
      setErrorMsg(message);
      soundManager.playWrong();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    soundManager.playClick();
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
    setSpreadsheet(null);
    setSheetRows([]);
  };

  const handleCopyLink = () => {
    if (!spreadsheet) return;
    soundManager.playClick();
    navigator.clipboard.writeText(spreadsheet.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Safe trigger with user confirmation modal
  const requestSyncCurrentApprentice = () => {
    soundManager.playClick();
    setConfirmMessage(
      `¿Deseas registrar al aprendiz ${currentApprentice.fullName} (${currentApprentice.docType} ${currentApprentice.docNumber}) en la hoja de cálculo de Google Drive?`
    );
    setPendingAction(() => executeSyncCurrentApprentice);
    setConfirmModalOpen(true);
  };

  const executeSyncCurrentApprentice = async () => {
    if (!accessToken || !spreadsheet) return;
    setSyncing(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await autoSyncEngine.triggerAutoSync(currentApprentice, true);
      soundManager.playCorrect();
      setSuccessMsg(`¡Aprendiz ${currentApprentice.fullName} guardado exitosamente en Google Sheets!`);
      // Refresh rows
      const tableData = await fetchApprenticeSheetRows(accessToken, spreadsheet.id);
      setHeaders(tableData.headers);
      setSheetRows(tableData.rows);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar datos';
      setErrorMsg(message);
      soundManager.playWrong();
    } finally {
      setSyncing(false);
      setConfirmModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Google Workspace • Sheets & Drive
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sincronización en la Nube</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00324D] dark:text-slate-100 font-display flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-[#39A900] dark:text-emerald-400" />
              Almacenamiento de Aprendices en Google Sheets
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Conecta tu cuenta de Google para almacenar y consultar en tiempo real los registros de inducción y certificados emitidos.
            </p>
          </div>

          {/* Auth Button or User Profile */}
          <div>
            {!currentUser ? (
              <button
                onClick={handleLogin}
                disabled={loading}
                className="gsi-material-button inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                <span>{loading ? 'Conectando...' : 'Iniciar sesión con Google'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || ''} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]">
                    {currentUser.displayName || 'Usuario Google'}
                  </span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                    {currentUser.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Direct Spreadsheet Link Banner (What user explicitly requested) */}
      {spreadsheet && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-[#00324D] rounded-2xl p-6 text-white shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-emerald-100 border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Hoja de Cálculo Alojada en Google Drive</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display">
                {spreadsheet.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200">
                Cada aprendiz certificado se agrega automáticamente con sus datos, ficha y resultado de inducción.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={spreadsheet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#00324D] hover:bg-slate-100 font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Abrir Hoja en Google Drive</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>
          </div>

          {/* Quick link display box */}
          <div className="bg-black/25 rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-mono overflow-hidden">
            <span className="truncate text-emerald-200">
              {spreadsheet.url}
            </span>
            <span className="text-[10px] text-slate-300 shrink-0 font-sans uppercase font-bold tracking-wider">
              URL Oficial
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 p-4 rounded-xl text-rose-950 dark:text-rose-200 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 p-4 rounded-xl text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick Action: Register current apprentice */}
      {currentUser && spreadsheet && (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] dark:text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">
                Aprendiz Actual en Inducción
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {currentApprentice.fullName} ({currentApprentice.docType} {currentApprentice.docNumber})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ficha {currentApprentice.fichaNumber} • {currentApprentice.programName}
              </p>
            </div>
          </div>

          <button
            onClick={requestSyncCurrentApprentice}
            disabled={syncing}
            className="bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{syncing ? 'Guardando...' : 'Registrar en Google Sheets'}</span>
          </button>
        </div>
      )}

      {/* Live Table of Records */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-[#00324D] dark:text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#39A900] dark:text-emerald-400" />
              Registros Sincronizados en Tiempo Real ({sheetRows.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Datos almacenados directamente en la pestaña "Registro de Aprendices" en Google Drive.
            </p>
          </div>

          {accessToken && (
            <button
              onClick={() => loadSpreadsheetAndData(accessToken)}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar Tabla</span>
            </button>
          )}
        </div>

        {/* Not Logged in Placeholder */}
        {!currentUser ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#39A900] dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Inicia sesión para conectar Google Sheets
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Al conectar tu cuenta de Google, la aplicación creará la hoja de cálculo en tu Google Drive y guardará automáticamente a cada aprendiz.
            </p>
            <button
              onClick={handleLogin}
              className="mt-2 bg-[#00324D] dark:bg-emerald-600 hover:bg-[#002235] dark:hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Conectar con Google Drive</span>
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-12 space-y-2 text-slate-500 dark:text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#39A900] dark:text-emerald-400" />
            <span>Cargando datos desde Google Sheets...</span>
          </div>
        ) : sheetRows.length === 0 ? (
          <div className="text-center py-10 space-y-2 text-slate-500 dark:text-slate-400 text-xs">
            <p>La hoja de cálculo está lista con encabezados oficiales pero aún no tiene aprendices registrados.</p>
            <p>Haz clic en <strong>"Registrar en Google Sheets"</strong> o completa la inducción para añadir el primer registro.</p>
          </div>
        ) : (
          /* Responsive Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Fecha y Hora</th>
                  <th className="p-3">Nombre del Aprendiz</th>
                  <th className="p-3">Documento</th>
                  <th className="p-3">No. Ficha</th>
                  <th className="p-3">Programa</th>
                  <th className="p-3">Calificación</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Código Serial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sheetRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{row[0]}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{row[1]}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{row[2]} {row[3]}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{row[4]}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 truncate max-w-[200px]">{row[5]}</td>
                    <td className="p-3 font-bold text-[#39A900] dark:text-emerald-400 whitespace-nowrap">{row[8]}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        {row[9] || 'APROBADO'}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">{row[10]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog Modal (MANDATORY per Workspace skill for mutating user data) */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs no-print">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] dark:text-emerald-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Confirmar Registro en Google Sheets
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">Acción de escritura en Google Drive</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {confirmMessage}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (pendingAction) pendingAction();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmar y Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
