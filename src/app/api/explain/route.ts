import { NextResponse } from "next/server";
import { explainClassification } from "@/lib/claude";
import { isLocale } from "@/i18n/config";
import { parseAiBody } from "@/lib/api-guard";
import { explainBodySchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const guard = await parseAiBody(req, explainBodySchema);
  if ("response" in guard) return guard.response;
  const body = guard.data;

  try {
    const { narrative, source } = await explainClassification(
      {
        systemName: body.systemName,
        description: body.description ?? "",
        result: body.result,
      },
      isLocale(body.locale) ? body.locale : undefined,
    );
    return NextResponse.json({ narrative, source });
  } catch {
    return NextResponse.json(
      { error: "Could not generate the explanation." },
      { status: 500 },
    );
  }
}
