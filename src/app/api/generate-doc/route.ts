import { NextResponse } from "next/server";
import { generateDocument, DOC_LABELS, type DocType } from "@/lib/claude";
import type { ClassificationResult } from "@/lib/classifier";
import { isLocale } from "@/i18n/config";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  docType: DocType;
  systemName: string;
  description?: string;
  organisation?: string;
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

  if (!body.docType || !(body.docType in DOC_LABELS)) {
    return NextResponse.json({ error: "Unknown document type." }, { status: 400 });
  }
  if (!body.systemName || !body.result) {
    return NextResponse.json(
      { error: "systemName and result are required." },
      { status: 400 },
    );
  }

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
}
