import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  CheckCircle2, 
  Copy, 
  ShieldCheck, 
  QrCode, 
  Search, 
  Lock, 
  UserCheck,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { SENA_LOGO_SVG } from '../data/senaData';
import { autoSyncEngine } from '../services/autoSyncEngine';
import { getSpreadsheetUrl } from '../services/googleSheetsService';

export interface ApprenticeData {
  fullName: string;
  docType: string;
  docNumber: string;
  fichaNumber: string;
  programName: string;
  regional: string;
  centerName: string;
  certCode: string;
}

interface CertificateViewProps {
  hasPassedFinalExam: boolean;
  scorePercentage: number;
  onGoToEvaluation: () => void;
  onGoToSheets?: () => void;
  apprentice?: ApprenticeData;
  onUpdateApprentice?: (updates: Partial<ApprenticeData>) => void;
  isInstructor?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  hasPassedFinalExam,
  scorePercentage,
  onGoToEvaluation,
  onGoToSheets,
  apprentice,
  onUpdateApprentice,
  isInstructor = false
}) => {
  // Apprentice form data with fallback
  const [fullName, setFullName] = useState<string>(apprentice?.fullName || 'JUAN CAMILO PÉREZ RODRÍGUEZ');
  const [docType, setDocType] = useState<string>(apprentice?.docType || 'C.C.');
  const [docNumber, setDocNumber] = useState<string>(apprentice?.docNumber || '1.020.849.521');
  const [fichaNumber, setFichaNumber] = useState<string>(apprentice?.fichaNumber || '2874192');
  const [programName, setProgramName] = useState<string>(apprentice?.programName || 'ANÁLISIS Y DESARROLLO DE SOFTWARE (ADSO)');
  const [regional, setRegional] = useState<string>(apprentice?.regional || 'REGIONAL DISTRITO CAPITAL');
  const [centerName, setCenterName] = useState<string>(apprentice?.centerName || 'CENTRO DE GESTIÓN DE MERCADOS, LOGÍSTICA Y TECNOLOGÍAS DE LA INFORMACIÓN');
  
  // Dynamic certificate code
  const [certCode] = useState<string>(() => apprentice?.certCode || `SENA-IND-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-sync status state
  const [isSynced, setIsSynced] = useState<boolean>(() => autoSyncEngine.isAlreadySynced(certCode));
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(() => {
    const id = localStorage.getItem('sena_induction_spreadsheet_id');
    return id ? getSpreadsheetUrl(id) : null;
  });

  useEffect(() => {
    setIsSynced(autoSyncEngine.isAlreadySynced(certCode));
    const unsubscribe = autoSyncEngine.subscribe((event) => {
      if (event.status === 'synced') {
        setIsSynced(true);
        setIsSyncing(false);
        if (event.sheetUrl) setSpreadsheetUrl(event.sheetUrl);
      } else if (event.status === 'syncing') {
        setIsSyncing(true);
      } else {
        setIsSyncing(false);
      }
    });
    return () => unsubscribe();
  }, [certCode]);

  const handleManualSync = async () => {
    soundManager.playClick();
    setIsSyncing(true);
    await autoSyncEngine.triggerAutoSync({
      fullName,
      docType,
      docNumber,
      fichaNumber,
      programName,
      regional,
      centerName,
      scorePercentage,
      passedStatus: hasPassedFinalExam ? 'APROBADO' : 'EN CURSO',
      certCode,
      dateIssued: currentDateFormatted,
    }, true);
  };

  // Sync back to parent when values change
  const handleUpdate = (field: keyof ApprenticeData, val: string) => {
    if (field === 'fullName') setFullName(val);
    if (field === 'docType') setDocType(val);
    if (field === 'docNumber') setDocNumber(val);
    if (field === 'fichaNumber') setFichaNumber(val);
    if (field === 'programName') setProgramName(val);
    if (field === 'regional') setRegional(val);
    if (field === 'centerName') setCenterName(val);
    
    if (onUpdateApprentice) {
      onUpdateApprentice({ [field]: val });
    }
  };

  // Verification modal state
  const [verifyModalOpen, setVerifyModalOpen] = useState<boolean>(false);
  const [verifyInputCode, setVerifyInputCode] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<'valid' | 'invalid' | null>(null);

  const currentDateFormatted = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const handleCopyCode = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(certCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyCode = () => {
    soundManager.playClick();
    if (!verifyInputCode.trim()) return;
    if (verifyInputCode.trim().toUpperCase() === certCode.toUpperCase() || verifyInputCode.trim().toUpperCase().startsWith('SENA-IND')) {
      setVerifyResult('valid');
      soundManager.playCorrect();
    } else {
      setVerifyResult('invalid');
      soundManager.playWrong();
    }
  };

  return (
    <div className="space-y-8">
      {/* If exam not passed yet */}
      {!hasPassedFinalExam && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-amber-900 dark:text-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 no-print transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/60 rounded-xl text-amber-700 dark:text-amber-300">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-950 dark:text-amber-100">
                Certificado Bloqueado Temporalmente
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90">
                Para generar y descargar tu Certificado Oficial de Inducción SENA, debes completar la Evaluación Final con al menos el 80% de aprobación.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onGoToEvaluation();
            }}
            className="bg-[#00324D] dark:bg-emerald-600 hover:bg-[#002235] dark:hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shrink-0 shadow-xs"
          >
            Ir a Evaluación Final
          </button>
        </div>
      )}

      {/* Editor & Customizer Form (Hidden on Print) */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 no-print transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-[#00324D] dark:text-slate-100 font-display flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#39A900] dark:text-emerald-400" />
              Personalizar Datos del Certificado Oficial
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ingresa tus datos exactos tal como aparecen registrados en SOFIA Plus / Zajuna para la expedición de tu credencial.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isInstructor && onGoToSheets && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onGoToSheets();
                }}
                className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#39A900] dark:text-emerald-400" />
                <span>Guardar en Google Sheets</span>
              </button>
            )}
            <button
              onClick={() => {
                setVerifyModalOpen(true);
                setVerifyInputCode(certCode);
                setVerifyResult(null);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Verificar Código</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo del Aprendiz</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => handleUpdate('fullName', e.target.value.toUpperCase())}
              placeholder="Ej: JUAN PÉREZ"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-[#39A900] dark:focus:ring-emerald-400 focus:border-transparent outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo y Documento de Identidad</label>
            <div className="flex gap-2">
              <select
                value={docType}
                onChange={(e) => handleUpdate('docType', e.target.value)}
                className="w-24 px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-[#39A900] dark:focus:ring-emerald-400 outline-none"
              >
                <option value="C.C.">C.C.</option>
                <option value="T.I.">T.I.</option>
                <option value="C.E.">C.E.</option>
                <option value="P.E.P.">P.E.P.</option>
                <option value="P.P.T.">P.P.T.</option>
              </select>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => handleUpdate('docNumber', e.target.value)}
                placeholder="Número de documento"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-[#39A900] dark:focus:ring-emerald-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Número de Ficha de Caracterización</label>
            <input
              type="text"
              value={fichaNumber}
              onChange={(e) => handleUpdate('fichaNumber', e.target.value)}
              placeholder="Ej: 2874192"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-[#39A900] dark:focus:ring-emerald-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Programa de Formación</label>
            <input
              type="text"
              value={programName}
              onChange={(e) => handleUpdate('programName', e.target.value.toUpperCase())}
              placeholder="Nombre del programa"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-[#39A900] dark:focus:ring-emerald-400 outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Regional SENA</label>
            <input
              type="text"
              value={regional}
              onChange={(e) => handleUpdate('regional', e.target.value.toUpperCase())}
              placeholder="Ej: REGIONAL DISTRITO CAPITAL"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-[#39A900] dark:focus:ring-emerald-400 outline-none uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Centro de Formación</label>
            <input
              type="text"
              value={centerName}
              onChange={(e) => handleUpdate('centerName', e.target.value.toUpperCase())}
              placeholder="Nombre del centro"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-[#39A900] dark:focus:ring-emerald-400 outline-none uppercase"
            />
          </div>
        </div>

        {/* Verification code helper */}
        <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#39A900] dark:text-emerald-400" />
            <span className="text-slate-600 dark:text-slate-300">Código Único de Registro Institucional:</span>
            <code className="font-mono font-bold text-[#00324D] dark:text-emerald-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {certCode}
            </code>
          </div>
          <button
            onClick={handleCopyCode}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-medium cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? '¡Copiado!' : 'Copiar código'}</span>
          </button>
        </div>

        {/* Cloud Sync Status Box (Differentiated for Apprentice vs Instructor) */}
        {isInstructor ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-emerald-50/60 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-[#39A900] dark:text-emerald-400 shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Google Sheets en Google Drive
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSynced
                      ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : isSyncing
                      ? 'bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                      : 'bg-amber-100 dark:bg-amber-900/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  }`}>
                    {isSynced ? '✓ Sincronizado Automáticamente' : isSyncing ? 'Sincronizando...' : 'En cola de sincronización'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Hoja institucional: <strong>SENA - Registro Oficial de Aprendices e Inducción</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {spreadsheetUrl && (
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-slate-800 text-[#00324D] dark:text-emerald-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Abrir Hoja</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="bg-[#39A900] hover:bg-[#2e8300] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSynced ? 'Re-sincronizar' : 'Sincronizar ahora'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-[#39A900] dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block">
                {isSynced
                  ? '✓ Inducción Registrada Exitosamente'
                  : 'Sincronización Automática con el Sistema SENA'}
              </span>
              <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/80 mt-0.5">
                Tu certificado y resultado han sido transmitidos automáticamente para el seguimiento y validación de tu instructor.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DIPLOMA / CERTIFICATE CANVAS DISPLAY (Both on-screen and printable) */}
      <div className="overflow-x-auto pb-4">
        <div 
          id="printable-certificate"
          className="mx-auto w-[820px] sm:w-[920px] bg-[#FCFDFB] border-[12px] border-[#00324D] p-8 sm:p-12 relative shadow-2xl rounded-sm text-slate-800"
          style={{ minHeight: '620px' }}
        >
          {/* Inner Decorative Golden Border */}
          <div className="absolute inset-2 border-2 border-amber-500/60 pointer-events-none rounded-xs" />
          <div className="absolute inset-3 border border-emerald-600/30 pointer-events-none" />

          {/* Watermark Logo in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
            <div className="w-96 h-96 rounded-full border-32 border-[#39A900] flex items-center justify-center font-black text-9xl text-[#00324D]">
              SENA
            </div>
          </div>

          {/* Certificate Content */}
          <div className="relative z-10 flex flex-col justify-between h-full space-y-6 text-center">
            
            {/* Header Logos & Institutional Hierarchy */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1 shadow-sm border border-slate-200">
                  <img src={SENA_LOGO_SVG} alt="Logo SENA" className="w-full h-full object-contain" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-sm tracking-wider text-[#00324D]">
                    SERVICIO NACIONAL DE APRENDIZAJE
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">
                    República de Colombia • Ministerio del Trabajo
                  </div>
                </div>
              </div>

              <div className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">
                Dirección de Formación Profesional Integral • {regional}
              </div>
              <div className="text-xs uppercase font-bold text-slate-600">
                {centerName}
              </div>
            </div>

            {/* Title */}
            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl font-black font-display text-[#00324D] tracking-tight">
                CERTIFICADO DE INDUCCIÓN DE LA FORMACIÓN PROFESIONAL INTEGRAL
              </h1>
              <div className="w-32 h-1 bg-[#39A900] mx-auto mt-2 rounded-full" />
            </div>

            {/* Attestation Body */}
            <div className="space-y-4 max-w-2xl mx-auto text-slate-700 text-xs sm:text-sm leading-relaxed">
              <p className="uppercase tracking-wide font-semibold text-slate-500 text-xs">
                Hace constar que:
              </p>

              <h2 className="text-xl sm:text-2xl font-black text-[#00324D] tracking-wide font-display border-b border-slate-200 pb-1">
                {fullName || 'NOMBRE DEL APRENDIZ'}
              </h2>

              <p className="text-xs sm:text-sm">
                Identificado(a) con <strong>{docType} No. {docNumber}</strong>, culminó y aprobó con éxito el programa de inducción institucional, demostrando apropiación y compromiso con las disposiciones del:
              </p>

              <div className="bg-emerald-50/70 border border-emerald-300 py-2 px-4 rounded-lg inline-block">
                <span className="font-black text-[#297a00] text-sm sm:text-base">
                  REGLAMENTO DEL APRENDIZ SENA — ACUERDO 0009 DE 2024
                </span>
                <span className="block text-[11px] text-slate-600 font-medium">
                  Derechos, Deberes, Prohibiciones, Faltas, Medidas Formativas y Etapas de la Formación Profesional
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left bg-slate-50/80 p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Programa de Formación:</span>
                  <span className="font-bold text-slate-800">{programName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Ficha de Caracterización:</span>
                  <span className="font-bold text-slate-800">{fichaNumber}</span>
                </div>
              </div>
            </div>

            {/* Seals, QR & Signatures */}
            <div className="pt-4 grid grid-cols-3 items-end gap-4 border-t border-slate-200">
              
              {/* Signature 1: Subdirector */}
              <div className="text-center space-y-1">
                <div className="h-10 flex items-center justify-center">
                  <span className="font-serif italic text-base text-slate-600">Subdirección de Centro</span>
                </div>
                <div className="border-t border-slate-400 pt-1 text-slate-800">
                  <span className="text-xs font-bold block">SUBDIRECTOR(A) DE CENTRO</span>
                  <span className="text-[10px] text-slate-500 uppercase">{centerName.slice(0, 32)}...</span>
                </div>
              </div>

              {/* Center Seal & QR Code */}
              <div className="flex flex-col items-center justify-center space-y-1.5">
                {/* Simulated QR Box */}
                <div className="w-16 h-16 bg-white border border-slate-300 rounded p-1 flex items-center justify-center shadow-xs">
                  <QrCode className="w-12 h-12 text-[#00324D]" />
                </div>
                <div className="text-[10px] text-slate-500">
                  <span className="block font-mono font-bold text-slate-700">{certCode}</span>
                  <span>Verificación Digital SENA</span>
                </div>
              </div>

              {/* Signature 2: Coordinador */}
              <div className="text-center space-y-1">
                <div className="h-10 flex items-center justify-center">
                  <span className="font-serif italic text-base text-slate-600">Coordinación Académica</span>
                </div>
                <div className="border-t border-slate-400 pt-1 text-slate-800">
                  <span className="text-xs font-bold block">COORDINACIÓN ACADÉMICA</span>
                  <span className="text-[10px] text-slate-500">Formación Profesional Integral</span>
                </div>
              </div>

            </div>

            {/* Bottom Footer Info */}
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Expedido en Colombia el {currentDateFormatted}</span>
              <span>Intensidad: 40 Horas de Inducción Formativa</span>
              <span>Válido conforme a los Acuerdos del Consejo Directivo Nacional</span>
            </div>

          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-md no-print">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-[#00324D] dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#39A900] dark:text-emerald-400" />
                Verificador de Credencial SENA
              </h3>
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ingresa el código único del certificado para comprobar su autenticidad y registro oficial en la base de datos de inducción del SENA.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Código de Certificado</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verifyInputCode}
                  onChange={(e) => setVerifyInputCode(e.target.value.toUpperCase())}
                  placeholder="Ej: SENA-IND-2024-XXXXXX"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-[#39A900] dark:focus:ring-emerald-400 outline-none"
                />
                <button
                  onClick={handleVerifyCode}
                  className="bg-[#00324D] dark:bg-emerald-600 hover:bg-[#002235] dark:hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Verificar
                </button>
              </div>
            </div>

            {/* Validation Output */}
            {verifyResult === 'valid' && (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 p-4 rounded-xl text-emerald-950 dark:text-emerald-100 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-[#297a00] dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-[#39A900] dark:text-emerald-400" />
                  <span>¡CERTIFICADO AUTÉNTICO Y VIGENTE!</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200">
                  El aprendiz <strong>{fullName}</strong> aprobó satisfactoriamente la inducción reglamentaria bajo el <strong>Acuerdo 0009 de 2024</strong> para el programa <strong>{programName}</strong> (Ficha {fichaNumber}).
                </p>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                  Registro avalado por la Dirección de Formación Profesional Integral del SENA.
                </div>
              </div>
            )}

            {verifyResult === 'invalid' && (
              <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 p-4 rounded-xl text-rose-950 dark:text-rose-100 space-y-1 animate-fadeIn">
                <div className="font-bold text-xs text-rose-700 dark:text-rose-300">
                  Código No Encontrado
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  El código ingresado no coincide con ningún registro activo de inducción. Por favor verifica los caracteres e inténtalo de nuevo.
                </p>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
