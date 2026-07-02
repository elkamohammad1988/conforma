import { NextResponse } from "next/server";
import { generateDocument, DOC_LABELS } from "@/lib/claude";
import { isLocale } from "@/i18n/config";
import { parseAiBody } from "@/lib/api-guard";
import { generateDocBodySchema } from "@/lib/schemas";
import { persistGeneratedDocument } from "@/lib/data/persist-document";

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

    // Production Mode: persist the document to the signed-in user's org.
    // Best-effort — never fails the generation response.
    const documentId = await persistGeneratedDocument({
      docType: body.docType,
      title: `${DOC_LABELS[body.docType]} — ${body.systemName}`,
      content: markdown,
      locale: body.locale ?? null,
      model: source === "claude" ? "claude-opus-4-8" : "demo",
      systemId: body.systemId ?? null,
    });

    return NextResponse.json({
      docType: body.docType,
      label: DOC_LABELS[body.docType],
      markdown,
      source,
      documentId,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not generate the document." },
      { status: 500 },
    );
  }
}
