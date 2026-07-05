import { NextResponse } from "next/server";
import { explainClassification } from "@/lib/claude";
import { isLocale } from "@/i18n/config";
import { parseAiBody } from "@/lib/api-guard";
import { explainBodySchema } from "@/lib/schemas";
import { decideAi } from "@/lib/ai/entitlement";
import { captureError } from "@/lib/observability";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const guard = await parseAiBody(req, explainBodySchema);
  if ("response" in guard) return guard.response;
  const body = guard.data;

  // Wallet guard: anonymous callers get the deterministic demo narrative, so the
  // key is never spent by the public internet. The explain call is not metered.
  const decision = await decideAi({ metered: false });

  try {
    const { narrative, source } = await explainClassification(
      {
        systemName: body.systemName,
        description: body.description ?? "",
        result: body.result,
      },
      isLocale(body.locale) ? body.locale : undefined,
      { forceDemo: decision.effect === "demo" },
    );
    return NextResponse.json({ narrative, source });
  } catch (error) {
    captureError(error, { scope: "api.explain" });
    return NextResponse.json(
      { error: "Could not generate the explanation." },
      { status: 500 },
    );
  }
}
