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

    // Lecture du fichier Excel
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

    // Parcourir les lignes Excel et insérer dans la BDD
    for (const row of data) {
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
        sigle: string;
        adresse: string;
        telephone: string;
        activite: string;
        numero: string;
        dateInscription: string;
      };

      await prisma.client.create({
        data: {
          nomClient: String(nomClient || ""),
          sigle: sigle ? String(sigle) : null,
          adresse: adresse ? String(adresse) : null,
          telephone: telephone ? String(telephone) : null,
          activite: activite ? String(activite) : null,
          numero: numero ? String(numero) : null,
          dateInscription: excelDate(dateInscription)
        }
      });
    }

    return NextResponse.json({ message: "Importation réussie !" });
  } catch (error) {
    console.error("Erreur lors de l'import :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'importation du fichier" },
      { status: 500 }
    );
  }
}
