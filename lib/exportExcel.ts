import * as XLSX from "xlsx";

/**
 * Exporte une liste d'objets en fichier Excel (.xlsx)
 * @param data - Liste d'objets à exporter
 * @param fileName - Nom du fichier à télécharger (ex: "clients.xlsx")
 * @returns Un Buffer contenant le fichier Excel
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[]
): Buffer {
  if (!Array.isArray(data) || data.length === 0) {
    new Error("Aucune donnée à exporter");
  }

  // 1️⃣ Convertir la liste en feuille Excel
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2️⃣ Créer un classeur et y ajouter la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Feuille1");

  // 3️⃣ Générer le buffer Excel
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return buffer;
}
