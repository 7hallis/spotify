
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const rawTrackId = request.nextUrl.searchParams.get("trackId");

  // Remove parâmetros extras, como ?si=...
  const trackId = rawTrackId?.split("?")[0].trim();

  // Valida o ID do Spotify (22 caracteres)
  if (!trackId || !/^[A-Za-z0-9]{22}$/.test(trackId)) {
    return NextResponse.json(
      { canvasUrl: null, error: "ID da música inválido" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.CANVAS_API_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { canvasUrl: null, error: "CANVAS_API_URL não configurada" },
      { status: 500 }
    );
  }

  try {
    const apiUrl = new URL("/api/canvas", baseUrl);
    apiUrl.searchParams.set("trackId", trackId);

    const response = await fetch(apiUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({
        canvasUrl: null,
        error: `API externa respondeu com status ${response.status}`,
      });
    }

    const result = await response.json();

    const canvasUrl =
      result?.data?.canvasesList?.[0]?.canvasUrl ??
      result?.canvasUrl ??
      null;

    return NextResponse.json({
      canvasUrl:
        typeof canvasUrl === "string" &&
        canvasUrl.startsWith("https://")
          ? canvasUrl
          : null,
    });
  } catch {
    return NextResponse.json(
      { canvasUrl: null, error: "Não foi possível acessar a API externa" },
      { status: 502 }
    );
  }
}