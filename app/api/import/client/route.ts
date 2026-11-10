import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

function excelDate(dateString: string | null): Date | null {
  if (!dateString) return null;

  const str = String(dateString).trim();

  // Vérifie si la chaîne fait bien 8 caractères
  if (str.length === 8 && /^\d+$/.test(str)) {
    const year = parseInt(str.slice(0, 4), 10);
    const month = parseInt(str.slice(4, 6), 10) - 1; // mois = 0-11
    const day = parseInt(str.slice(6, 8), 10);
    return new Date(year, month, day);
  }

  // Si le format ne correspond pas, retourne null
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Aucun fichier envoyé" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return NextResponse.json(
        { message: "Le fichier Excel est vide" },
        { status: 400 }
      );
    }

    // ✅ Colonnes attendues
    const expectedColumns = [
      "nomClient",
      "sigle",
      "adresse",
      "telephone",
      "activite",
      "numero",
      "dateInscription"
    ];

    // Vérification du modèle du fichier
    const firstRow = data[0] as Record<string, unknown>;
    const missingColumns = expectedColumns.filter((col) => !(col in firstRow));

    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          message: "Le modèle du fichier Excel n’est pas conforme.",
          colonnesAttendues: expectedColumns,
          colonnesManquantes: missingColumns
        },
        { status: 400 }
      );
    }

    let insertedCount = 0;
    let skippedCount = 0;
    const skippedRows: unknown[] = [];

    for (const [index, row] of data.entries()) {
      const {
        nomClient,
        sigle,
        adresse,
        telephone,
        activite,
        numero,
        dateInscription
      } = row as {
        nomClient: string;
        sigle?: string;
        adresse?: string;
        telephone?: string;
        activite?: string;
        numero?: string;
        dateInscription?: string;
      };

      // Vérification de cohérence minimale
      if (!nomClient || !numero) {
        skippedCount++;
        skippedRows.push({
          ligne: index + 2,
          raison: "nomClient ou numero manquant"
        });
        continue;
      }

      try {
        await prisma.client.create({
          data: {
            nomClient: String(nomClient).trim(),
            sigle: sigle ? String(sigle).trim() : null,
            adresse: adresse ? String(adresse).trim() : null,
            telephone: telephone ? String(telephone).trim() : null,
            activite: activite ? String(activite).trim() : null,
            numero: numero ? String(numero).trim() : null,
            dateInscription: excelDate(dateInscription ?? null)
          }
        });

        insertedCount++;
      } catch (err) {
        skippedCount++;
        skippedRows.push({
          ligne: index + 2,
          raison: "Erreur d’insertion : " + (err as Error).message
        });
      }
    }

    return NextResponse.json({
      message: "Importation terminée",
      lignesImportées: insertedCount,
      lignesIgnorées: skippedCount,
      detailsIgnorées: skippedRows
    });
  } catch (error) {
    console.error("Erreur lors de l'import :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'importation du fichier" },
      { status: 500 }
    );
  }
}
