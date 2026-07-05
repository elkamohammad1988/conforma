import { NextResponse } from "next/server";
import { generateDocument, DOC_LABELS } from "@/lib/claude";
import { isLocale } from "@/i18n/config";
import { parseAiBody } from "@/lib/api-guard";
import { generateDocBodySchema } from "@/lib/schemas";
import { persistGeneratedDocument } from "@/lib/data/persist-document";
import { decideAi } from "@/lib/ai/entitlement";
import { captureError } from "@/lib/observability";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const guard = await parseAiBody(req, generateDocBodySchema);
  if ("response" in guard) return guard.response;
  const body = guard.data;

  // Wallet + meter guard: only an authenticated, in-quota org spends the key.
  const decision = await decideAi({ metered: true });
  if (decision.effect === "quota") {
    return NextResponse.json(
      {
        error: "quota_exceeded",
        message: `You've reached your monthly limit of ${decision.limit} AI documents. Upgrade your plan to generate more.`,
        limit: decision.limit,
      },
      { status: 402 },
    );
  }

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
      { forceDemo: decision.effect === "demo" },
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
  } catch (error) {
    captureError(error, { scope: "api.generate-doc" });
    return NextResponse.json(
      { error: "Could not generate the document." },
      { status: 500 },
    );
  }
}
