import { NextResponse } from "next/server";
import { explainClassification } from "@/lib/claude";
import type { ClassificationResult } from "@/lib/classifier";
import { isLocale } from "@/i18n/config";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  systemName: string;
  description?: string;
  result: ClassificationResult;
  locale?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.systemName || !body.result) {
    return NextResponse.json(
      { error: "systemName and result are required." },
      { status: 400 },
    );
  }

  const { narrative, source } = await explainClassification(
    {
      systemName: body.systemName,
      description: body.description ?? "",
      result: body.result,
    },
    isLocale(body.locale) ? body.locale : undefined,
  );

  return NextResponse.json({ narrative, source });
}
