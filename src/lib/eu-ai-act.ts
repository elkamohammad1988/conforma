/**
 * Encoded domain knowledge of Regulation (EU) 2024/1689 — the "EU AI Act".
 *
 * This module is the regulatory core of Conforma. It is intentionally written
 * as typed, citable data (not prose) so the classification engine, the gap
 * analysis and the document generator all read from a single source of truth.
 *
 * Citations reference Articles / Annexes of the published consolidated text.
 * Dates reflect the staged application timeline in Art. 113.
 *
 * NOTE: This encodes a good-faith, structured reading of the Regulation to
 * power a compliance *workflow*. It is decision-support, not legal advice.
 */

export type RiskTier = "prohibited" | "high" | "limited" | "minimal";

export interface TierMeta {
  id: RiskTier;
  label: string;
  short: string;
  /** Tailwind-friendly accent token used by the UI badges. */
  accent: "red" | "amber" | "blue" | "emerald";
  summary: string;
  primaryCitation: string;
}

export const RISK_TIERS: Record<RiskTier, TierMeta> = {
  prohibited: {
    id: "prohibited",
    label: "Unacceptable risk — Prohibited",
    short: "Prohibited",
    accent: "red",
    summary:
      "The practice is banned in the EU. It cannot be placed on the market, put into service, or used. Continued use exposes you to the highest penalties.",
    primaryCitation: "Art. 5",
  },
  high: {
    id: "high",
    label: "High risk",
    short: "High risk",
    accent: "amber",
    summary:
      "Permitted only if it meets the full set of obligations in Chapter III before market placement: risk management, data governance, technical documentation, logging, transparency, human oversight, accuracy & cybersecurity, plus a conformity assessment and EU database registration.",
    primaryCitation: "Art. 6 + Annex III",
  },
  limited: {
    id: "limited",
    label: "Limited risk — Transparency",
    short: "Limited",
    accent: "blue",
    summary:
      "Largely permitted, but specific transparency duties apply: people must be told they are interacting with AI, and synthetic / manipulated content must be machine-readably labelled.",
    primaryCitation: "Art. 50",
  },
  minimal: {
    id: "minimal",
    label: "Minimal risk",
    short: "Minimal",
    accent: "emerald",
    summary:
      "No mandatory obligations under the AI Act. Voluntary codes of conduct are encouraged. AI-literacy duties (Art. 4) and general product law still apply.",
    primaryCitation: "—",
  },
};

/* -------------------------------------------------------------------------- */
/*  Art. 5 — Prohibited practices                                             */
/* -------------------------------------------------------------------------- */

export interface ProhibitedPractice {
  id: string;
  title: string;
  description: string;
  citation: string;
}

export const PROHIBITED_PRACTICES: ProhibitedPractice[] = [
  {
    id: "subliminal",
    title: "Subliminal or manipulative techniques",
    description:
      "Deploys subliminal, purposefully manipulative or deceptive techniques that materially distort behaviour and cause (or are likely to cause) significant harm.",
    citation: "Art. 5(1)(a)",
  },
  {
    id: "vulnerability",
    title: "Exploiting vulnerabilities",
    description:
      "Exploits vulnerabilities due to age, disability or a specific social/economic situation to distort behaviour and cause significant harm.",
    citation: "Art. 5(1)(b)",
  },
  {
    id: "social-scoring",
    title: "Social scoring",
    description:
      "Evaluates or classifies people over time based on social behaviour or personal traits, leading to detrimental treatment in unrelated contexts or that is unjustified/disproportionate.",
    citation: "Art. 5(1)(c)",
  },
  {
    id: "predictive-policing",
    title: "Individual predictive policing",
    description:
      "Assesses the risk of a person committing a crime based solely on profiling or personality traits.",
    citation: "Art. 5(1)(d)",
  },
  {
    id: "facial-scraping",
    title: "Untargeted facial-recognition scraping",
    description:
      "Creates or expands facial-recognition databases through untargeted scraping of facial images from the internet or CCTV.",
    citation: "Art. 5(1)(e)",
  },
  {
    id: "emotion-work-edu",
    title: "Emotion recognition at work / in education",
    description:
      "Infers emotions of people in the workplace or educational institutions (save for medical or safety reasons).",
    citation: "Art. 5(1)(f)",
  },
  {
    id: "biometric-categorization",
    title: "Sensitive biometric categorisation",
    description:
      "Categorises people based on biometric data to deduce race, political opinions, trade-union membership, religion, sex life or sexual orientation.",
    citation: "Art. 5(1)(g)",
  },
  {
    id: "rbi",
    title: "Real-time remote biometric identification",
    description:
      "Uses 'real-time' remote biometric identification in publicly accessible spaces for law enforcement (subject to narrow, authorised exceptions).",
    citation: "Art. 5(1)(h)",
  },
];

/* -------------------------------------------------------------------------- */
/*  Annex III — High-risk use-case areas                                      */
/* -------------------------------------------------------------------------- */

export interface AnnexIIIArea {
  id: string;
  title: string;
  examples: string;
  citation: string;
}

export const ANNEX_III_AREAS: AnnexIIIArea[] = [
  {
    id: "biometrics",
    title: "Biometrics",
    examples:
      "Remote biometric identification, biometric categorisation by sensitive attributes, emotion recognition (where not prohibited).",
    citation: "Annex III(1)",
  },
  {
    id: "critical-infrastructure",
    title: "Critical infrastructure",
    examples:
      "Safety components in the management/operation of critical digital infrastructure, road traffic, or supply of water, gas, heating, electricity.",
    citation: "Annex III(2)",
  },
  {
    id: "education",
    title: "Education & vocational training",
    examples:
      "Admissions decisions, evaluating learning outcomes, assessing the appropriate level of education, monitoring/detecting prohibited exam behaviour.",
    citation: "Annex III(3)",
  },
  {
    id: "employment",
    title: "Employment & worker management",
    examples:
      "Recruitment/selection, targeted job ads, screening applications, promotion/termination decisions, task allocation, monitoring performance.",
    citation: "Annex III(4)",
  },
  {
    id: "essential-services",
    title: "Access to essential services",
    examples:
      "Eligibility for public assistance/benefits, creditworthiness & credit scoring, risk assessment & pricing in life/health insurance, emergency dispatch.",
    citation: "Annex III(5)",
  },
  {
    id: "law-enforcement",
    title: "Law enforcement",
    examples:
      "Assessing risk of offending/re-offending or of becoming a victim, polygraphs, evaluating evidence reliability, profiling during investigations.",
    citation: "Annex III(6)",
  },
  {
    id: "migration",
    title: "Migration, asylum & border control",
    examples:
      "Polygraphs, risk assessments of irregular migration/security/health, examining asylum/visa applications, detecting/identifying persons.",
    citation: "Annex III(7)",
  },
  {
    id: "justice",
    title: "Justice & democratic processes",
    examples:
      "Assisting judicial authorities in researching/interpreting facts and law; influencing the outcome of elections/referenda or voting behaviour.",
    citation: "Annex III(8)",
  },
];

/* -------------------------------------------------------------------------- */
/*  Chapter III — High-risk obligations (the gap-analysis checklist)          */
/* -------------------------------------------------------------------------- */

export type ObligationRole = "provider" | "deployer" | "both";

export interface Obligation {
  id: string;
  title: string;
  description: string;
  citation: string;
  role: ObligationRole;
}

/** Provider obligations for high-risk systems — Chapter III, Sections 2 & 3. */
export const HIGH_RISK_OBLIGATIONS: Obligation[] = [
  {
    id: "risk-management",
    title: "Risk management system",
    description:
      "Establish, document and maintain a continuous, iterative risk-management process across the system's lifecycle.",
    citation: "Art. 9",
    role: "provider",
  },
  {
    id: "data-governance",
    title: "Data & data governance",
    description:
      "Training, validation and testing data must meet quality criteria: relevant, representative, free of errors, and examined for bias.",
    citation: "Art. 10",
    role: "provider",
  },
  {
    id: "technical-documentation",
    title: "Technical documentation",
    description:
      "Draw up and keep up to date the technical documentation demonstrating conformity (the Annex IV dossier).",
    citation: "Art. 11 + Annex IV",
    role: "provider",
  },
  {
    id: "record-keeping",
    title: "Record-keeping (logging)",
    description:
      "Automatically record events ('logs') over the system's lifetime to ensure traceability of functioning.",
    citation: "Art. 12",
    role: "provider",
  },
  {
    id: "transparency-deployers",
    title: "Transparency to deployers",
    description:
      "Design for sufficient transparency and supply instructions for use enabling deployers to interpret output and use it appropriately.",
    citation: "Art. 13",
    role: "provider",
  },
  {
    id: "human-oversight",
    title: "Human oversight",
    description:
      "Design the system so it can be effectively overseen by humans, including stop/override and awareness of automation bias.",
    citation: "Art. 14",
    role: "both",
  },
  {
    id: "accuracy-robustness",
    title: "Accuracy, robustness & cybersecurity",
    description:
      "Achieve appropriate levels of accuracy, robustness and cybersecurity, consistent and resilient against errors and adversarial attacks.",
    citation: "Art. 15",
    role: "provider",
  },
  {
    id: "qms",
    title: "Quality management system",
    description:
      "Put a documented quality management system in place covering processes, procedures and responsibilities for compliance.",
    citation: "Art. 17",
    role: "provider",
  },
  {
    id: "conformity-assessment",
    title: "Conformity assessment",
    description:
      "Undergo the relevant conformity-assessment procedure before placing the system on the market or putting it into service.",
    citation: "Art. 43",
    role: "provider",
  },
  {
    id: "ce-doc",
    title: "EU declaration of conformity & CE marking",
    description:
      "Draw up the EU declaration of conformity and affix the CE marking indicating conformity with the Regulation.",
    citation: "Art. 47–48",
    role: "provider",
  },
  {
    id: "eu-registration",
    title: "Registration in the EU database",
    description:
      "Register the high-risk system in the EU database before placing it on the market or putting it into service.",
    citation: "Art. 49",
    role: "provider",
  },
];

/** Deployer-side obligations that apply when you *use* a high-risk system. */
export const DEPLOYER_OBLIGATIONS: Obligation[] = [
  {
    id: "use-per-instructions",
    title: "Use per instructions & assign oversight",
    description:
      "Use the system in line with the instructions, assign competent human oversight, and ensure input data is relevant.",
    citation: "Art. 26",
    role: "deployer",
  },
  {
    id: "monitoring",
    title: "Monitor & report",
    description:
      "Monitor operation, suspend use and inform the provider/authority on serious incidents or risks; keep the automatically generated logs.",
    citation: "Art. 26 + 72",
    role: "deployer",
  },
  {
    id: "fria",
    title: "Fundamental Rights Impact Assessment",
    description:
      "Public bodies and certain private deployers (e.g. banking, insurance) must complete a fundamental-rights impact assessment before use.",
    citation: "Art. 27",
    role: "deployer",
  },
  {
    id: "inform-affected",
    title: "Inform affected persons",
    description:
      "Where the system makes or assists decisions about people, inform those people that they are subject to its use.",
    citation: "Art. 26(11)",
    role: "deployer",
  },
];

/* -------------------------------------------------------------------------- */
/*  Art. 50 — Transparency (limited-risk) obligations                         */
/* -------------------------------------------------------------------------- */

export const TRANSPARENCY_OBLIGATIONS: Obligation[] = [
  {
    id: "disclose-chatbot",
    title: "Disclose AI interaction",
    description:
      "People must be informed they are interacting with an AI system, unless it is obvious from the context.",
    citation: "Art. 50(1)",
    role: "provider",
  },
  {
    id: "label-synthetic",
    title: "Mark synthetic content",
    description:
      "AI-generated audio, image, video or text must be marked in a machine-readable format as artificially generated or manipulated.",
    citation: "Art. 50(2)",
    role: "provider",
  },
  {
    id: "label-deepfake",
    title: "Disclose deepfakes",
    description:
      "Deployers of systems generating deepfakes must disclose that the content has been artificially generated or manipulated.",
    citation: "Art. 50(4)",
    role: "deployer",
  },
  {
    id: "emotion-disclosure",
    title: "Disclose emotion / biometric categorisation",
    description:
      "Deployers of emotion-recognition or biometric-categorisation systems must inform the people exposed to them.",
    citation: "Art. 50(3)",
    role: "deployer",
  },
];

/* -------------------------------------------------------------------------- */
/*  GPAI — General-purpose AI models (informational, Art. 51–55)              */
/* -------------------------------------------------------------------------- */

export const GPAI_OBLIGATIONS: Obligation[] = [
  {
    id: "gpai-techdoc",
    title: "Model technical documentation",
    description:
      "Draw up and maintain technical documentation of the model, including training and testing process and evaluation results.",
    citation: "Art. 53(1)(a)",
    role: "provider",
  },
  {
    id: "gpai-downstream",
    title: "Information to downstream providers",
    description:
      "Provide information and documentation to downstream providers integrating the model into their AI systems.",
    citation: "Art. 53(1)(b)",
    role: "provider",
  },
  {
    id: "gpai-copyright",
    title: "Copyright policy & training-data summary",
    description:
      "Put in place a policy to comply with EU copyright law and publish a sufficiently detailed summary of training content.",
    citation: "Art. 53(1)(c)-(d)",
    role: "provider",
  },
  {
    id: "gpai-systemic",
    title: "Systemic-risk obligations",
    description:
      "Models with systemic risk must additionally perform model evaluations, adversarial testing, incident tracking and cybersecurity protection.",
    citation: "Art. 55",
    role: "provider",
  },
];

/* -------------------------------------------------------------------------- */
/*  Art. 113 — Application timeline                                           */
/* -------------------------------------------------------------------------- */

export interface ComplianceDeadline {
  id: string;
  /** ISO date the obligations become applicable. */
  date: string;
  label: string;
  description: string;
  citation: string;
  appliesTo: RiskTier[] | "all";
}

export const COMPLIANCE_DEADLINES: ComplianceDeadline[] = [
  {
    id: "force",
    date: "2024-08-01",
    label: "Regulation enters into force",
    description: "The AI Act enters into force; the staged application clock starts.",
    citation: "Art. 113",
    appliesTo: "all",
  },
  {
    id: "prohibitions",
    date: "2025-02-02",
    label: "Prohibited practices & AI literacy apply",
    description:
      "Bans in Art. 5 become applicable, together with the AI-literacy duty (Art. 4).",
    citation: "Art. 113(a)",
    appliesTo: ["prohibited"],
  },
  {
    id: "gpai",
    date: "2025-08-02",
    label: "GPAI, governance & penalties apply",
    description:
      "Obligations for general-purpose AI models, the governance framework and penalty regime become applicable.",
    citation: "Art. 113(b)",
    appliesTo: "all",
  },
  {
    id: "high-risk-annex-iii",
    date: "2026-08-02",
    label: "High-risk (Annex III) & transparency apply",
    description:
      "The core high-risk obligations for Annex III systems and the Art. 50 transparency duties become applicable. This is the deadline most organisations are racing toward.",
    citation: "Art. 113",
    appliesTo: ["high", "limited"],
  },
  {
    id: "high-risk-annex-i",
    date: "2027-08-02",
    label: "High-risk (regulated products) apply",
    description:
      "High-risk obligations for AI that is a safety component of products already covered by EU harmonised legislation (Annex I) become applicable.",
    citation: "Art. 113(c)",
    appliesTo: ["high"],
  },
];

/** The deadline organisations are most commonly racing toward right now. */
export const PRIMARY_DEADLINE = COMPLIANCE_DEADLINES.find(
  (d) => d.id === "high-risk-annex-iii",
)!;

/**
 * Penalty ceilings (Art. 99). Used in the UI to convey stakes.
 * Figures are the higher of a fixed cap or a percentage of worldwide annual turnover.
 */
export const PENALTIES = {
  prohibited: { amountEur: 35_000_000, turnoverPct: 7, citation: "Art. 99(3)" },
  highRisk: { amountEur: 15_000_000, turnoverPct: 3, citation: "Art. 99(4)" },
  misleadingInfo: { amountEur: 7_500_000, turnoverPct: 1, citation: "Art. 99(5)" },
} as const;

/** Map a risk tier to the obligations a system must satisfy. */
export function obligationsForTier(
  tier: RiskTier,
  role: "provider" | "deployer" | "both" = "both",
): Obligation[] {
  let base: Obligation[] = [];
  if (tier === "high") base = [...HIGH_RISK_OBLIGATIONS, ...DEPLOYER_OBLIGATIONS];
  else if (tier === "limited") base = TRANSPARENCY_OBLIGATIONS;
  else return [];

  if (role === "both") return base;
  return base.filter((o) => o.role === role || o.role === "both");
}

/** Days remaining until a deadline, given an ISO 'today'. Negative = passed. */
export function daysUntil(deadlineIso: string, todayIso: string): number {
  const ms = Date.parse(deadlineIso) - Date.parse(todayIso);
  return Math.ceil(ms / 86_400_000);
}
