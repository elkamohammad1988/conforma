import { NextResponse } from "next/server";
import { generateDocument, DOC_LABELS } from "@/lib/claude";
import { isLocale } from "@/i18n/config";
import { parseAiBody } from "@/lib/api-guard";
import { generateDocBodySchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const guard = await parseAiBody(req, generateDocBodySchema);
  if ("response" in guard) return guard.response;
  const body = guard.data;

  try {
    const { markdown, source } = await generateDocument(
      body.docType,
      {
        systemName: body.systemName,
        description: body.description ?? "",
        organisation: body.organisation,
        result: body.result,
      },
      isLocale(body.locale) ? body.locale : undefined,
    );

    return NextResponse.json({
      docType: body.docType,
      label: DOC_LABELS[body.docType],
      markdown,
      source,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not generate the document." },
      { status: 500 },
    );
  }
}
