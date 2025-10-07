import { getAllClients } from "@/services/client.service";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const clients = await getAllClients();

    return NextResponse.json(clients);
  } catch (error) {
    return new NextResponse(`Internal Error :${error}`, { status: 500 });
  }
}
