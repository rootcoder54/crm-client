import * as XLSX from "xlsx";

export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
export const MAX_IMPORT_ROWS = 5000;

export type ExcelRow = Record<string, unknown>;
export type ImportLine = { ligne: number; row: ExcelRow };
export type ImportIssue = { ligne: number; raison: string };
export type ClientReference = { id: string; numero: string | null; nomClient: string };

export class ImportFileError extends Error {
  constructor(
    message: string,
    public status = 400,
    public colonnesManquantes?: string[],
  ) {
    super(message);
    this.name = "ImportFileError";
  }
}

export const cellText = (value: unknown): string =>
  value === null || value === undefined ? "" : String(value).trim();

export const blank = (value: unknown): boolean => cellText(value) === "";

export function requiredText(row: ExcelRow, key: string): string {
  const value = cellText(row[key]);
  if (!value) throw new Error(`La colonne « ${key} » est obligatoire`);
  return value;
}

export function numberCell(
  value: unknown,
  label: string,
  options: { integer?: boolean; min?: number; max?: number } = {},
): number | null {
  if (blank(value)) return null;
  let text = cellText(value).replace(/[\\s\\u00a0\\u202f]/g, "");
  // "1 234,50" and "1234.50" are supported; reject ambiguous or invalid values.
  if (text.includes(",") && text.includes(".")) {
    if (text.lastIndexOf(",") > text.lastIndexOf(".")) text = text.replace(/\\./g, "").replace(",", ".");
    else text = text.replace(/,/g, "");
  } else {
    text = text.replace(",", ".");
  }
  if (!/^[+-]?(?:\\d+\\.?\\d*|\\.\\d+)$/.test(text))
    throw new Error(`« ${label} » doit être un nombre valide`);
  const number = Number(text);
  if (
    !Number.isFinite(number) ||
    (options.integer && !Number.isInteger(number)) ||
    (options.min !== undefined && number < options.min) ||
    (options.max !== undefined && number > options.max)
  )
    throw new Error(`Valeur invalide pour « ${label} »`);
  return number;
}

export function booleanCell(value: unknown, label: string): boolean | null {
  if (blank(value)) return null;
  const text = cellText(value).toLowerCase();
  if (["oui", "yes", "vrai", "true", "1", "payee", "payée"].includes(text)) return true;
  if (["non", "no", "faux", "false", "0", "impayee", "impayée"].includes(text)) return false;
  throw new Error(`« ${label} » doit valoir oui ou non`);
}

function makeDate(year: number, month: number, day: number, hour = 12, minute = 0): Date | null {
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day ? date : null;
}

export function dateCell(value: unknown, label: string): Date | null {
  if (blank(value)) return null;
  if (value instanceof Date) {
    if (!Number.isNaN(value.getTime())) return value;
    throw new Error(`Date invalide pour « ${label} »`);
  }
  const text = cellText(value);
  let date: Date | null = null;
  if (/^\\d{8}$/.test(text)) {
    date = makeDate(Number(text.slice(0, 4)), Number(text.slice(4, 6)), Number(text.slice(6, 8)));
  } else if (/^\\d{4}-\\d{2}-\\d{2}$/.test(text)) {
    const [y, m, d] = text.split("-").map(Number);
    date = makeDate(y, m, d);
  } else if (/^\\d{1,2}\\/\\d{1,2}\\/\\d{4}$/.test(text)) {
    const [d, m, y] = text.split("/").map(Number);
    date = makeDate(y, m, d);
  } else if (typeof value === "number" && value > 0 && value < 100000) {
    const excel = XLSX.SSF.parse_date_code(value);
    if (excel) date = makeDate(excel.y, excel.m, excel.d, excel.H, excel.M);
  } else if (/^\\d{4}-\\d{2}-\\d{2}T/.test(text)) {
    const parsed = new Date(text);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }
  if (!date) throw new Error(`Date invalide pour « ${label} ». Formats acceptés : JJ/MM/AAAA, AAAA-MM-JJ, AAAAMMJJ ou date Excel`);
  return date;
}

export async function readExcelImport(
  value: FormDataEntryValue | null,
  required: string[],
  oneOf: string[][] = [],
): Promise<{ lines: ImportLine[]; columns: string[] }> {
  if (!value || typeof value === "string")
    throw new ImportFileError("Sélectionnez un fichier Excel");
  if (!/\\.(xlsx|xls)$/i.test(value.name))
    throw new ImportFileError("Le fichier doit être au format .xlsx ou .xls");
  if (value.size > MAX_IMPORT_BYTES)
    throw new ImportFileError("Le fichier dépasse la taille maximale de 5 Mo", 413);
  let sheet: XLSX.WorkSheet | undefined;
  try {
    const workbook = XLSX.read(Buffer.from(await value.arrayBuffer()), { type: "buffer", cellDates: false });
    sheet = workbook.Sheets[workbook.SheetNames[0]];
  } catch {
    throw new ImportFileError("Impossible de lire le fichier Excel. Vérifiez son format");
  }
  if (!sheet) throw new ImportFileError("Aucune feuille trouvée dans le fichier");
  const header = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, blankrows: false })[0] ?? [];
  const columns = header.map((cell) => cellText(cell).replace(/^\\uFEFF/, ""));
  const missing = [
    ...required.filter((column) => !columns.includes(column)),
    ...oneOf.filter((group) => !group.some((column) => columns.includes(column)))
      .map((group) => group.join(" / ")),
  ];
  if (missing.length) throw new ImportFileError("Le modèle Excel ne contient pas toutes les colonnes attendues", 400, missing);
  const entries = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: "", raw: true });
  if (!entries.length) throw new ImportFileError("Le fichier Excel ne contient aucune ligne de données");
  if (entries.length > MAX_IMPORT_ROWS)
    throw new ImportFileError(`Import limité à ${MAX_IMPORT_ROWS} lignes par fichier`, 413);
  return {
    columns,
    lines: entries.map((row, index) => ({
      ligne: typeof (row as ExcelRow & { __rowNum__?: number }).__rowNum__ === "number"
        ? (row as ExcelRow & { __rowNum__: number }).__rowNum__ + 1
        : index + 2,
      row,
    })),
  };
}

/** Never silently associate data with an ambiguous client name/number. */
export function lookupClient(row: ExcelRow, clients: ClientReference[]): ClientReference {
  const id = cellText(row.clientId);
  const numero = cellText(row.clientNumero || row.numeroClient);
  const nom = cellText(row.nomClient);
  if (!id && !numero && !nom) throw new Error("Client manquant : renseignez clientId, clientNumero ou nomClient");
  const matches = clients.filter((client) =>
    (!id || client.id === id) &&
    (!numero || (client.numero ?? "").trim().toLowerCase() === numero.toLowerCase()) &&
    (!nom || client.nomClient.trim().toLowerCase() === nom.toLowerCase())
  );
  if (matches.length !== 1)
    throw new Error(matches.length ? "Client ambigu : indiquez son clientId" : "Client introuvable ou identifiants contradictoires");
  return matches[0];
}

export function importResponse(imported: number, ignored: number, issues: ImportIssue[], extra: Record<string, unknown> = {}) {
  return {
    message: `Importation terminée : ${imported} ligne(s) importée(s), ${ignored} ignorée(s)`,
    lignesImportées: imported,
    lignesIgnorées: ignored,
    detailsIgnorées: issues.slice(0, 100),
    autresErreurs: Math.max(0, issues.length - 100),
    ...extra,
  };
}
