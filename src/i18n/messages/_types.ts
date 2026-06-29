/**
 * Shared message-shape helpers.
 *
 * `PluralMessage` lets a single key carry every CLDR plural category a language
 * needs (Arabic uses up to six; English uses two). The translator selects the
 * right form at runtime via `Intl.PluralRules`, falling back to `other`.
 */
export type PluralMessage = {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

/** Identity helper that pins a literal to the `PluralMessage` type. */
export const plural = (m: PluralMessage): PluralMessage => m;
