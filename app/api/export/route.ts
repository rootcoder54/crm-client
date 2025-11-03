import { NextResponse } from "next/server";
import { exportToExcel } from "@/lib/exportExcel";

export async function POST(req: Request) {
  try {
    // Récupération du corps de la requête
    const body = await req.json();
    const { data } = body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { message: "Aucune donnée à exporter" },
        { status: 400 }
      );
    }

    // Génération du fichier Excel
    const buffer = exportToExcel(data);

    // Conversion du Buffer en ArrayBuffer
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer;

    // Réponse avec le fichier Excel
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Disposition": 'attachment; filename="data.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    });
  } catch (error) {
    console.error("Erreur export Excel :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'export du fichier Excel" },
      { status: 500 }
    );
  }
}
