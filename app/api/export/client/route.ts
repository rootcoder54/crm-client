import { NextResponse } from "next/server";
import { exportToExcel } from "@/lib/exportExcel";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const clients = await prisma.client.findMany();

    if (!clients.length) {
      return NextResponse.json(
        { message: "Aucune donnée à exporter" },
        { status: 404 }
      );
    }

    // Générer le Buffer Excel
    const buffer = exportToExcel(clients);

    // ✅ Convertir le Buffer en ArrayBuffer
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer; // <-- on force le type ici

    // ✅ Retourner le fichier Excel
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Disposition": 'attachment; filename="clients.xlsx"',
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
