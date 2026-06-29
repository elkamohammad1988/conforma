/**
 * Renders a deterministic `RationalePoint` into localized prose using the active
 * locale's catalog. This is the bridge between the locale-free classification
 * engine and the translated UI / AI narrative.
 */
import type { RationalePoint } from "@/lib/classifier";
import type { Translator } from "./translator";

export function renderRationale(
  point: RationalePoint,
  t: Translator["t"],
): string {
  switch (point.kind) {
    case "notAISystem":
      return t("classifier.notAISystem");
    case "prohibitedMatch":
      return t("classifier.prohibitedMatch", {
        practice: t(`domain.prohibited.${point.practiceId}.title`),
      });
    case "annexIMatch":
      return t("classifier.annexIMatch");
    case "annexIIIMatch":
      return t("classifier.annexIIIMatch", {
        area: t(`domain.annexIII.${point.areaId}.title`),
      });
    case "derogation":
      return t("classifier.derogation");
    case "transparencyMatch":
      return t("classifier.transparencyMatch", {
        trigger: t(`classifier.transparencyTriggers.${point.triggerId}`),
      });
    case "minimalDefault":
      return t("classifier.minimalDefault");
    case "gpaiOverlay":
      return t("classifier.gpaiOverlay");
  }
}
