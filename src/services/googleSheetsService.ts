export interface ApprenticeSheetRecord {
  fullName: string;
  docType: string;
  docNumber: string;
  fichaNumber: string;
  programName: string;
  regional: string;
  centerName: string;
  scorePercentage: number;
  passedStatus: string; // "APROBADO" | "EN CURSO"
  certCode: string;
  dateIssued: string;
}

export interface SpreadsheetInfo {
  id: string;
  url: string;
  title: string;
}

const STORAGE_KEY_SPREADSHEET_ID = 'sena_induction_spreadsheet_id';

/**
 * Returns the public / direct link to view the spreadsheet on Google Sheets
 */
export const getSpreadsheetUrl = (spreadsheetId: string): string => {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
};

/**
 * Gets the existing spreadsheet or creates a new one in Google Drive
 */
export const getOrCreateInductionSpreadsheet = async (accessToken: string): Promise<SpreadsheetInfo> => {
  const savedId = localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID);

  if (savedId) {
    try {
      const verifyRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${savedId}?fields=spreadsheetId,properties.title`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (verifyRes.ok) {
        const data = await verifyRes.json();
        return {
          id: data.spreadsheetId,
          url: getSpreadsheetUrl(data.spreadsheetId),
          title: data.properties?.title || 'SENA - Registro Oficial de Aprendices e Inducción',
        };
      }
    } catch {
      // Saved spreadsheet not accessible or deleted; will create a new one
    }
  }

  // Create a new spreadsheet in user's Google Drive
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'SENA - Registro Oficial de Aprendices e Inducción (Acuerdo 0009 de 2024)',
      },
      sheets: [
        {
          properties: {
            title: 'Registro de Aprendices',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Error al crear la hoja de cálculo en Google Drive: ${errorText}`);
  }

  const created = await createRes.json();
  const spreadsheetId = created.spreadsheetId;

  // Insert Header Row
  const headers = [
    'Marca Temporal',
    'Nombre Completo del Aprendiz',
    'Tipo Documento',
    'Número de Documento',
    'Número de Ficha',
    'Programa de Formación',
    'Regional SENA',
    'Centro de Formación',
    'Calificación Inducción (%)',
    'Estado Inducción',
    'Código Único Verificación',
    'Fecha de Expedición',
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Registro de Aprendices'!A1:L1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [headers],
      }),
    }
  );

  localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, spreadsheetId);

  return {
    id: spreadsheetId,
    url: getSpreadsheetUrl(spreadsheetId),
    title: created.properties?.title || 'SENA - Registro Oficial de Aprendices e Inducción',
  };
};

/**
 * Appends an apprentice record to the spreadsheet
 */
export const appendApprenticeRecordToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  record: ApprenticeSheetRecord
): Promise<{ success: boolean; url: string }> => {
  const timestamp = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
  });

  const rowValues = [
    timestamp,
    record.fullName.toUpperCase(),
    record.docType,
    record.docNumber,
    record.fichaNumber,
    record.programName.toUpperCase(),
    record.regional.toUpperCase(),
    record.centerName.toUpperCase(),
    `${record.scorePercentage}%`,
    record.passedStatus,
    record.certCode,
    record.dateIssued,
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Registro de Aprendices'!A:L:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );

  if (!appendRes.ok) {
    const errorText = await appendRes.text();
    throw new Error(`Error al registrar datos en Google Sheets: ${errorText}`);
  }

  return {
    success: true,
    url: getSpreadsheetUrl(spreadsheetId),
  };
};

/**
 * Fetches all apprentice rows from the spreadsheet to display in the UI
 */
export const fetchApprenticeSheetRows = async (
  accessToken: string,
  spreadsheetId: string
): Promise<{ headers: string[]; rows: string[][] }> => {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Registro de Aprendices'!A1:L500`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al leer los datos de Google Sheets: ${errText}`);
  }

  const data = await res.json();
  const values = data.values || [];

  if (values.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = values[0];
  const rows = values.slice(1);

  return { headers, rows };
};
