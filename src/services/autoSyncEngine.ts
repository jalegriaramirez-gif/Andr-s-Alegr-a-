import { 
  ApprenticeSheetRecord, 
  getOrCreateInductionSpreadsheet, 
  appendApprenticeRecordToSheet,
  getSpreadsheetUrl
} from './googleSheetsService';
import { getAccessToken } from './googleAuth';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'queued' | 'error';

export interface SyncEvent {
  status: SyncStatus;
  message: string;
  record?: ApprenticeSheetRecord;
  sheetUrl?: string;
  timestamp: number;
}

type SyncListener = (event: SyncEvent) => void;

const SYNCED_SERIALS_KEY = 'sena_synced_certificate_serials';
const QUEUE_KEY = 'sena_offline_sync_queue';

class AutoSyncEngine {
  private listeners: Set<SyncListener> = new Set();
  private isProcessingQueue = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Auto-flush queue when browser comes back online
      window.addEventListener('online', () => {
        this.processQueue();
      });
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event: SyncEvent) {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error notifying sync listener:', err);
      }
    });
  }

  /**
   * Checks if this certificate was already synchronized
   */
  public isAlreadySynced(certCode: string): boolean {
    const list = this.getSyncedSerials();
    return list.includes(certCode);
  }

  private getSyncedSerials(): string[] {
    try {
      const data = localStorage.getItem(SYNCED_SERIALS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private markAsSynced(certCode: string) {
    const list = this.getSyncedSerials();
    if (!list.includes(certCode)) {
      list.push(certCode);
      localStorage.setItem(SYNCED_SERIALS_KEY, JSON.stringify(list));
    }
  }

  /**
   * Retrieves pending items from queue
   */
  public getPendingQueue(): ApprenticeSheetRecord[] {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private savePendingQueue(queue: ApprenticeSheetRecord[]) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  private addToQueue(record: ApprenticeSheetRecord) {
    const queue = this.getPendingQueue();
    // Avoid duplicate queue entries for the same cert code
    if (!queue.some((item) => item.certCode === record.certCode)) {
      queue.push(record);
      this.savePendingQueue(queue);
    }
  }

  /**
   * Main automatic trigger invoked when apprentice completes/passes induction
   */
  public async triggerAutoSync(record: ApprenticeSheetRecord, force = false): Promise<boolean> {
    // If already synced and not forcing, skip silently to prevent duplicate rows
    if (!force && this.isAlreadySynced(record.certCode)) {
      const savedSpreadsheetId = localStorage.getItem('sena_induction_spreadsheet_id');
      const url = savedSpreadsheetId ? getSpreadsheetUrl(savedSpreadsheetId) : undefined;
      this.notify({
        status: 'synced',
        message: `El registro de ${record.fullName} ya está sincronizado en Google Sheets.`,
        record,
        sheetUrl: url,
        timestamp: Date.now(),
      });
      return true;
    }

    const token = await getAccessToken();

    // If offline or no active token session, store in queue
    if (!token || !navigator.onLine) {
      this.addToQueue(record);
      this.notify({
        status: 'queued',
        message: `Guardado en cola automática. Se sincronizará en Google Drive al detectar sesión de Google.`,
        record,
        timestamp: Date.now(),
      });
      return false;
    }

    // Perform live sync
    this.notify({
      status: 'syncing',
      message: `Sincronizando automáticamente registro de ${record.fullName} con Google Sheets...`,
      record,
      timestamp: Date.now(),
    });

    try {
      const sheet = await getOrCreateInductionSpreadsheet(token);
      await appendApprenticeRecordToSheet(token, sheet.id, record);

      this.markAsSynced(record.certCode);

      // Remove from queue if present
      const queue = this.getPendingQueue().filter((item) => item.certCode !== record.certCode);
      this.savePendingQueue(queue);

      this.notify({
        status: 'synced',
        message: `¡Registro sincronizado automáticamente en Google Sheets!`,
        record,
        sheetUrl: sheet.url,
        timestamp: Date.now(),
      });

      return true;
    } catch (err: unknown) {
      console.error('Auto sync error:', err);
      // On failure, ensure it's in the queue for later retry
      this.addToQueue(record);
      this.notify({
        status: 'error',
        message: `No se pudo enviar inmediatamente. Guardado en cola para reintento automático.`,
        record,
        timestamp: Date.now(),
      });
      return false;
    }
  }

  /**
   * Processes all queued items when a valid access token is provided
   */
  public async processQueue(overrideToken?: string): Promise<number> {
    if (this.isProcessingQueue) return 0;
    const token = overrideToken || (await getAccessToken());
    if (!token || !navigator.onLine) return 0;

    const queue = this.getPendingQueue();
    if (queue.length === 0) return 0;

    this.isProcessingQueue = true;
    let syncedCount = 0;

    try {
      const sheet = await getOrCreateInductionSpreadsheet(token);

      for (const item of [...queue]) {
        try {
          await appendApprenticeRecordToSheet(token, sheet.id, item);
          this.markAsSynced(item.certCode);
          syncedCount++;
          // Remove processed item
          const updated = this.getPendingQueue().filter((q) => q.certCode !== item.certCode);
          this.savePendingQueue(updated);
        } catch (itemErr) {
          console.warn(`Failed to sync queued item ${item.certCode}:`, itemErr);
          break; // Stop to prevent cascading API errors
        }
      }

      if (syncedCount > 0) {
        this.notify({
          status: 'synced',
          message: `¡${syncedCount} registro(s) pendiente(s) sincronizado(s) en Google Sheets!`,
          sheetUrl: sheet.url,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      console.error('Error processing queue:', err);
    } finally {
      this.isProcessingQueue = false;
    }

    return syncedCount;
  }
}

export const autoSyncEngine = new AutoSyncEngine();
