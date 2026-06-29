/**
 * Message registry. `Messages` is derived from the English catalog, so every
 * other locale is structurally forced to provide the same keys.
 */
import type { Locale } from "../config";
import { DEFAULT_LOCALE } from "../config";
import en from "./en";
import ar from "./ar";
import fr from "./fr";
import es from "./es";
import zhCN from "./zh-CN";

export type Messages = typeof en;

const MESSAGES: Record<Locale, Messages> = {
  en,
  ar,
  fr,
  es,
  "zh-CN": zhCN,
};

/** The English catalog — always available as the ultimate fallback. */
export const FALLBACK_MESSAGES: Messages = en;

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}
