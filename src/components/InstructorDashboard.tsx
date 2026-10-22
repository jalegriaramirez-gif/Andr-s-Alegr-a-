import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Share2,
  FileSpreadsheet,
  ExternalLink,
  Copy,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  QrCode,
  ShieldAlert,
  ArrowRight,
  LogOut,
  Building,
  GraduationCap,
  Sparkles,
  PhoneCall,
  Check
} from 'lucide-react';
import { 
  googleSignIn, 
  logout, 
  getAccessToken, 
  initAuth 
} from '../services/googleAuth';
import { 
  getOrCreateInductionSpreadsheet, 
  fetchApprenticeSheetRows, 
  SpreadsheetInfo, 
  ApprenticeSheetRecord 
} from '../services/googleSheetsService';
import { User } from 'firebase/auth';
import { soundManager } from '../utils/soundEffects';
import { autoSyncEngine } from '../services/autoSyncEngine';

interface InstructorDashboardProps {
  currentApprentice: ApprenticeSheetRecord;
  onSwitchToApprenticeView: () => void;
  onSelectApprenticeForPreview?: (apprentice: ApprenticeSheetRecord) => void;
}

interface ParsedApprenticeRow {
  fullName: string;
  docType: string;
  docNumber: string;
  fichaNumber: string;
  programName: string;
  regional: string;
  centerName: string;
  scorePercentage: number;
  passedStatus: string;
  certCode: string;
  dateIssued: string;
  source: 'google-sheets' | 'local';
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  currentApprentice,
  onSwitchToApprenticeView,
  onSelectApprenticeForPreview
}) => {
  const [subTab, setSubTab] = useState<'seguimiento' | 'compartir' | 'sheets'>('seguimiento');
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

  const [loading, setLoading] = useState<boolean>(false);
  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'aprobado' | 'en_curso'>('all');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Link generator settings
  const [shareFicha, setShareFicha] = useState<string>(currentApprentice.fichaNumber || '2874192');
  const [sharePrograma, setSharePrograma] = useState<string>(currentApprentice.programName || 'ANÁLISIS Y DESARROLLO DE SOFTWARE');
  const [shareRegional, setShareRegional] = useState<string>(currentApprentice.regional || 'REGIONAL DISTRITO CAPITAL');
  const [shareCentro, setShareCentro] = useState<string>(currentApprentice.centerName || 'CENTRO DE GESTIÓN DE MERCADOS');

  // Initialize Auth
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

  // Fetch data if token available
  useEffect(() => {
    if (accessToken) {
      loadSpreadsheetData(accessToken);
    }
  }, [accessToken]);

  const loadSpreadsheetData = async (token: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const sheetInfo = await getOrCreateInductionSpreadsheet(token);
      setSpreadsheet(sheetInfo);
      const data = await fetchApprenticeSheetRows(token, sheetInfo.id);
      setSheetRows(data.rows);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar datos desde Google Sheets';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    soundManager.playClick();
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result?.accessToken) {
        setAccessToken(result.accessToken);
        setCurrentUser(result.user);
        setSuccessMsg('Conectado exitosamente con Google Workspace.');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en autenticación con Google';
      setErrorMsg(msg);
    }
  };

  const handleGoogleLogout = async () => {
    soundManager.playClick();
    try {
      await logout();
      setCurrentUser(null);
      setAccessToken(null);
      setSuccessMsg('Sesión de Google cerrada.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setErrorMsg(msg);
    }
  };

  // Build the shareable URL for apprentices
  const generatedApprenticeUrl = useMemo(() => {
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const params = new URLSearchParams();
    params.set('role', 'aprendiz');
    if (shareFicha.trim()) params.set('ficha', shareFicha.trim());
    if (sharePrograma.trim()) params.set('programa', sharePrograma.trim());
    if (shareRegional.trim()) params.set('regional', shareRegional.trim());
    if (shareCentro.trim()) params.set('centro', shareCentro.trim());
    return `${baseUrl}?${params.toString()}`;
  }, [shareFicha, sharePrograma, shareRegional, shareCentro]);

  const handleCopyApprenticeLink = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(generatedApprenticeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Convert raw sheet rows and local apprentice records into structured list
  const allApprentices: ParsedApprenticeRow[] = useMemo(() => {
    const list: ParsedApprenticeRow[] = [];

    // Parse Google Sheets rows
    // Expected row format: [Timestamp, FullName, DocType, DocNumber, Ficha, Program, Regional, Center, Score, PassedStatus, CertCode, IssuedDate]
    sheetRows.forEach((row) => {
      if (row.length >= 10) {
        const scoreStr = (row[8] || '').replace('%', '').trim();
        const score = parseInt(scoreStr, 10) || 0;
        list.push({
          fullName: row[1] || 'Sin Nombre',
          docType: row[2] || 'C.C.',
          docNumber: row[3] || '---',
          fichaNumber: row[4] || '---',
          programName: row[5] || '---',
          regional: row[6] || '---',
          centerName: row[7] || '---',
          scorePercentage: score,
          passedStatus: row[9] || (score >= 80 ? 'APROBADO' : 'EN CURSO'),
          certCode: row[10] || '---',
          dateIssued: row[11] || row[0] || '---',
          source: 'google-sheets'
        });
      }
    });

    // Also include current session apprentice if not already in sheet rows
    const alreadyIncluded = list.some(
      (item) => item.docNumber === currentApprentice.docNumber || item.certCode === currentApprentice.certCode
    );

    if (!alreadyIncluded && currentApprentice.fullName) {
      list.unshift({
        fullName: currentApprentice.fullName,
        docType: currentApprentice.docType,
        docNumber: currentApprentice.docNumber,
        fichaNumber: currentApprentice.fichaNumber,
        programName: currentApprentice.programName,
        regional: currentApprentice.regional,
        centerName: currentApprentice.centerName,
        scorePercentage: currentApprentice.scorePercentage,
        passedStatus: currentApprentice.passedStatus,
        certCode: currentApprentice.certCode,
        dateIssued: currentApprentice.dateIssued,
        source: 'local'
      });
    }

    return list;
  }, [sheetRows, currentApprentice]);

  // Filtered apprentices
  const filteredApprentices = useMemo(() => {
    return allApprentices.filter((app) => {
      const matchesSearch =
        searchTerm === '' ||
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.fichaNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.certCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'aprobado' && app.passedStatus.toUpperCase().includes('APROBADO')) ||
        (statusFilter === 'en_curso' && !app.passedStatus.toUpperCase().includes('APROBADO'));

      return matchesSearch && matchesStatus;
    });
  }, [allApprentices, searchTerm, statusFilter]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = allApprentices.length;
    const approved = allApprentices.filter((a) => a.passedStatus.toUpperCase().includes('APROBADO')).length;
    const avgScore = total > 0 ? Math.round(allApprentices.reduce((acc, a) => acc + a.scorePercentage, 0) / total) : 0;
    return { total, approved, avgScore };
  }, [allApprentices]);

  // Export to CSV
  const handleExportCSV = () => {
    soundManager.playClick();
    const headers = [
      'Nombre Completo',
      'Tipo Doc',
      'Documento',
      'Ficha',
      'Programa',
      'Regional',
      'Centro',
      'Puntaje',
      'Estado',
      'Codigo Certificado',
      'Fecha'
    ];

    const rows = filteredApprentices.map((a) => [
      `"${a.fullName}"`,
      `"${a.docType}"`,
      `"${a.docNumber}"`,
      `"${a.fichaNumber}"`,
      `"${a.programName}"`,
      `"${a.regional}"`,
      `"${a.centerName}"`,
      `"${a.scorePercentage}%"`,
      `"${a.passedStatus}"`,
      `"${a.certCode}"`,
      `"${a.dateIssued}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SENA_Seguimiento_Induccion_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Instructor Mode Header */}
      <div className="bg-gradient-to-r from-[#00324D] via-[#004a70] to-[#00263b] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-500/30">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-48 h-48 bg-[#39A900]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Privilegios de Instructor Activos</span>
              <span>•</span>
              <span>Acuerdo 0009 de 2024</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Panel de Control del Instructor SENA
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Gestiona el seguimiento pedagógico de tus fichas, comparte el enlace limpio de inducción para tus aprendices y administra la sincronización institucional con Google Sheets en Google Drive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {spreadsheet?.url && (
              <a
                href={spreadsheet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Abrir Hoja en Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => {
                soundManager.playClick();
                onSwitchToApprenticeView();
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <Eye className="w-4 h-4 text-emerald-300" />
              <span>Vista de Aprendiz</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/10 dark:bg-black/20 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 block">Total Registrados</span>
            <span className="text-xl sm:text-2xl font-black text-white">{stats.total}</span>
          </div>

          <div className="bg-white/10 dark:bg-black/20 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-semibold text-emerald-300 block">Certificados Aprobados</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-300">{stats.approved}</span>
              <span className="text-xs text-slate-300">({stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%)</span>
            </div>
          </div>

          <div className="bg-white/10 dark:bg-black/20 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-semibold text-amber-300 block">Promedio Calificación</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300">{stats.avgScore}%</span>
          </div>

          <div className="bg-white/10 dark:bg-black/20 rounded-2xl p-3.5 backdrop-blur-md border border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 block">Google Drive</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${currentUser ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="truncate">{currentUser ? currentUser.email : 'Sin Conectar'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="font-bold hover:underline">
            Cerrar
          </button>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#39A900] dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tab Navigation within Instructor Dashboard */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => {
            soundManager.playClick();
            setSubTab('seguimiento');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subTab === 'seguimiento'
              ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Seguimiento de Aprendices</span>
          <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
            {filteredApprentices.length}
          </span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setSubTab('compartir');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subTab === 'compartir'
              ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4 text-[#39A900] dark:text-emerald-400" />
          <span>Compartir Enlace con Aprendices</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
            QR / Link
          </span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setSubTab('sheets');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            subTab === 'sheets'
              ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Sincronización Google Sheets</span>
          {spreadsheet && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* SUB-TAB 1: SEGUIMIENTO DE APRENDICES */}
      {subTab === 'seguimiento' && (
        <div className="space-y-4">
          {/* Controls: Search, Filters, Refresh, Export */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, documento, ficha o código..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-[#39A900] outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Todos ({allApprentices.length})
                </button>
                <button
                  onClick={() => setStatusFilter('aprobado')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    statusFilter === 'aprobado'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Aprobados ({stats.approved})
                </button>
                <button
                  onClick={() => setStatusFilter('en_curso')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    statusFilter === 'en_curso'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  En Curso ({stats.total - stats.approved})
                </button>
              </div>

              {accessToken && (
                <button
                  onClick={() => loadSpreadsheetData(accessToken)}
                  disabled={loading}
                  title="Actualizar datos desde Google Sheets"
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#39A900]' : ''}`} />
                </button>
              )}

              <button
                onClick={handleExportCSV}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Table of Apprentices */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Aprendiz</th>
                    <th className="py-3 px-4">Documento</th>
                    <th className="py-3 px-4">Ficha</th>
                    <th className="py-3 px-4">Programa / Regional</th>
                    <th className="py-3 px-4 text-center">Calificación</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4">Código Certificado</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApprentices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-slate-500">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="font-semibold">No se encontraron aprendices registrados con los filtros aplicados.</p>
                        <p className="text-[11px] mt-1">Comparte el enlace con tus aprendices en la pestaña &quot;Compartir Enlace&quot; para empezar a recibir registros.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredApprentices.map((app, index) => {
                      const isApproved = app.passedStatus.toUpperCase().includes('APROBADO');
                      return (
                        <tr key={index} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#39A900] dark:text-emerald-400 font-bold flex items-center justify-center text-[11px]">
                                {app.fullName.charAt(0)}
                              </div>
                              <div>
                                <span>{app.fullName}</span>
                                {app.source === 'google-sheets' && (
                                  <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                                    En Google Sheets
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                            {app.docType} {app.docNumber}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#00324D] dark:text-emerald-300">
                            {app.fichaNumber}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-[200px] truncate" title={`${app.programName} - ${app.regional}`}>
                            <div className="truncate font-semibold text-slate-800 dark:text-slate-200">{app.programName}</div>
                            <div className="truncate text-[10px] text-slate-400">{app.regional}</div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="font-black text-slate-900 dark:text-white text-xs">
                              {app.scorePercentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-block ${
                                isApproved
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                              }`}
                            >
                              {app.passedStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            {app.certCode}
                          </td>
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {app.dateIssued}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {onSelectApprenticeForPreview && (
                              <button
                                onClick={() => {
                                  soundManager.playClick();
                                  onSelectApprenticeForPreview(app);
                                }}
                                title="Ver Certificado de este aprendiz"
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#00324D] dark:text-emerald-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <GraduationCap className="w-3.5 h-3.5 text-[#39A900] dark:text-emerald-400" />
                                <span>Ver Cert.</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: COMPARTIR ENLACE CON APRENDICES */}
      {subTab === 'compartir' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings to customize the apprentice link */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#00324D] dark:text-slate-100 font-display flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#39A900] dark:text-emerald-400" />
                  Generar Enlace Oficial para los Aprendices
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Este enlace abre directamente el <strong>Modo Aprendiz</strong>. Los aprendices <strong>no tendrán acceso a las hojas de cálculo, ni configuraciones de sincronización ni al panel de instructor</strong>.
                </p>
              </div>

              {/* Pre-fill configuration form */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Parámetros Predeterminados de tu Ficha (Opcional pero Recomendado):
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Número de Ficha
                    </label>
                    <input
                      type="text"
                      value={shareFicha}
                      onChange={(e) => setShareFicha(e.target.value)}
                      placeholder="Ej: 2874192"
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold focus:ring-2 focus:ring-[#39A900] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Programa de Formación
                    </label>
                    <input
                      type="text"
                      value={sharePrograma}
                      onChange={(e) => setSharePrograma(e.target.value)}
                      placeholder="Ej: ANÁLISIS Y DESARROLLO DE SOFTWARE"
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 uppercase font-semibold focus:ring-2 focus:ring-[#39A900] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Regional SENA
                    </label>
                    <input
                      type="text"
                      value={shareRegional}
                      onChange={(e) => setShareRegional(e.target.value)}
                      placeholder="Ej: REGIONAL DISTRITO CAPITAL"
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 uppercase focus:ring-2 focus:ring-[#39A900] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Centro de Formación
                    </label>
                    <input
                      type="text"
                      value={shareCentro}
                      onChange={(e) => setShareCentro(e.target.value)}
                      placeholder="Ej: CENTRO DE GESTIÓN..."
                      className="w-full px-3 py-1.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 uppercase focus:ring-2 focus:ring-[#39A900] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Ready Link Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enlace directo para compartir:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedApprenticeUrl}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 select-all outline-none"
                  />
                  <button
                    onClick={handleCopyApprenticeLink}
                    className="bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? '¡Copiado!' : 'Copiar Enlace'}</span>
                  </button>
                </div>
              </div>

              {/* Direct WhatsApp Share */}
              <div className="pt-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `*Inducción SENA - Acuerdo 0009 de 2024*\nEstimados aprendices, por favor ingresen a la plataforma oficial de inducción en el siguiente enlace:\n${generatedApprenticeUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Compartir en Grupo de WhatsApp</span>
                </a>
              </div>

              {/* Feature Checklist for Instructor */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Bloqueo automático de acceso a Google Sheets y funciones administrativas.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>Sincronización silenciosa y automática en segundo plano al aprobar la evaluación final.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                  <span>El aprendiz puede descargar su certificado digital con código QR institucional.</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Card for Classroom Projection */}
          <div className="lg:col-span-5">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#39A900]/10 text-[#297a00] dark:text-emerald-400 border border-[#39A900]/20">
                <QrCode className="w-3.5 h-3.5" />
                <span>Proyección en Clase / Salón</span>
              </div>

              <h4 className="text-base font-bold text-[#00324D] dark:text-slate-100 font-display">
                Código QR para Aprendices
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pídeles a tus aprendices que apunten con la cámara de sus teléfonos inteligentes para ingresar directamente a la inducción.
              </p>

              {/* Clean High-Resolution QR */}
              <div className="flex justify-center py-2">
                <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-md">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                      generatedApprenticeUrl
                    )}`}
                    alt="Código QR para Aprendices"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <strong>Consejo pedagógico:</strong> Puedes proyectar esta pantalla con el videobeam para que todo el grupo comience la inducción al mismo tiempo.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SINCRONIZACIÓN GOOGLE SHEETS */}
      {subTab === 'sheets' && (
        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-[#00324D] dark:text-slate-100 font-display flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#39A900] dark:text-emerald-400" />
                  Conexión Institucional con Google Sheets & Google Drive
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Permite centralizar todas las respuestas y certificados expedidos a los aprendices en una única hoja de cálculo en la nube.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {currentUser ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">
                      {currentUser.email}
                    </span>
                    <button
                      onClick={handleGoogleLogout}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Desconectar</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleLogin}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Conectar con Google Drive</span>
                  </button>
                )}
              </div>
            </div>

            {/* Spreadsheet URL info */}
            {spreadsheet ? (
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#39A900] animate-pulse" />
                    <span className="text-xs font-extrabold uppercase text-emerald-900 dark:text-emerald-200">
                      Hoja Activa en tu Google Drive
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {spreadsheet.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-lg">
                    ID: {spreadsheet.id}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={spreadsheet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#00324D] dark:bg-emerald-600 hover:bg-[#002235] dark:hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Abrir Hoja Oficial en Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
                Conecta tu cuenta de Google arriba para habilitar la hoja de cálculo automática de aprendices. La hoja se creará con el título oficial <em>&quot;SENA - Registro Oficial de Aprendices e Inducción (Acuerdo 0009 de 2024)&quot;</em>.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
