/**
 * English — the source-of-truth catalog.
 *
 * `typeof en` defines the `Messages` type that every other locale must satisfy,
 * which is what guarantees 100% key coverage: a missing key is a type error.
 *
 * Interpolation uses `{name}` placeholders. Citations ("Art. 5", "Annex III")
 * are regulatory identifiers and are intentionally NOT translated.
 */
import { plural } from "./_types";

const en = {
  /* ------------------------------------------------------------------ common */
  common: {
    brand: "Conforma",
    euAiAct: "EU AI Act",
    regulation: "Regulation (EU) 2024/1689",
    startFree: "Start free",
    bookDemo: "Book a demo",
    talkToSales: "Talk to sales",
    back: "Back",
    continue: "Continue",
    optional: "(optional)",
    yes: "Yes",
    no: "No",
    thinking: "Thinking…",
    loading: "Loading…",
    dash: "—",
    daysLeft: plural({
      one: "{count} day left",
      other: "{count} days left",
    }),
    deadlinePassed: "deadline passed",
    cancel: "Cancel",
    delete: "Delete",
    notLegalAdvice:
      "Decision-support tooling for Regulation (EU) 2024/1689 — not legal advice. Confirm classifications with qualified counsel.",
  },

  /* ------------------------------------------------------------ languageSwitcher */
  languageSwitcher: {
    label: "Language",
    change: "Change language",
    selected: "Selected language: {language}",
  },

  /* -------------------------------------------------------------- themeToggle */
  themeToggle: {
    label: "Toggle theme",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },

  /* --------------------------------------------------------------------- nav */
  nav: {
    howItWorks: "How it works",
    security: "Security",
    pricing: "Pricing",
    dashboard: "Dashboard",
    bookDemo: "Book a demo",
    startFree: "Start free",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
  },

  /* ------------------------------------------------------------------ footer */
  footer: {
    tagline:
      "The compliance platform for the EU AI Act. Classify, close gaps, and prove conformity — without a compliance team.",
    columns: {
      product: {
        title: "Product",
        riskClassifier: "Risk classifier",
        aiRegistry: "AI registry",
        pricing: "Pricing",
        bookDemo: "Book a demo",
      },
      trust: {
        title: "Trust",
        security: "Security",
        dataResidency: "Data residency",
        subprocessors: "Sub-processors",
      },
      company: {
        title: "Company",
        howItWorks: "How it works",
        faq: "FAQ",
        contactSales: "Contact sales",
      },
      legal: {
        title: "Legal",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        dataProcessing: "Data Processing",
      },
    },
    rights: "© {year} Conforma. All rights reserved.",
    disclaimer:
      "Decision-support tooling for Regulation (EU) 2024/1689 — not legal advice. Confirm classifications with qualified counsel.",
    builtBy: "Designed & built by",
    portfolioNote:
      "an independent portfolio project demonstrating production-grade full-stack engineering.",
    caseStudy: "Case study",
    hireCta: "Available for work",
  },

  /* ------------------------------------------------------------ announcement */
  announcement: {
    prefix: "High-risk obligations apply",
    cta: "Check your exposure",
    dismiss: "Dismiss",
  },

  /* -------------------------------------------------------------------- home */
  home: {
    hero: {
      badge: "High-risk obligations apply",
      titleLine1: "EU AI Act compliance,",
      titleAccent: "on autopilot",
      subtitle:
        "Conforma inventories your AI systems, auto-classifies their risk with citations to the exact Articles, closes every obligation gap, and generates the documentation regulators expect — without hiring a compliance team.",
      fineprint:
        "No credit card · 30-second classification · audit-ready in minutes",
      trustEyebrow: "Aligned with the frameworks your auditors expect",
    },
    showcase: {
      url: "app.conforma.eu/dashboard",
      registryTitle: "AI System Registry",
      registrySub: "3 systems · 1 high-risk",
      classify: "Classify",
      stats: {
        systems: "Systems",
        compliance: "Compliance",
        nearest: "Nearest",
      },
      table: {
        system: "System",
        risk: "Risk",
        owner: "Owner",
        compliance: "Compliance",
      },
      owners: {
        peopleOps: "People Ops",
        support: "Support",
        supplyChain: "Supply Chain",
      },
    },
    stats: {
      fine: { value: "€35M", label: "max fine for prohibited AI", sub: "or 7% of turnover" },
      areas: { value: "8", label: "high-risk use-case areas", sub: "Annex III" },
      deadline: { value: "Aug 2026", label: "the deadline most face", sub: "Art. 113" },
      states: { value: "27", label: "EU member states", sub: "one regulation" },
    },
    interactiveDemo: {
      eyebrow: "Interactive demo",
      title: "Classify a system right now",
      subtitle:
        "No sign-up. Pick a system below and watch the deterministic engine pin its risk tier, cite the Articles, and count the obligations — live.",
    },
    problem: {
      eyebrow: "The problem",
      title: "Every company now ships AI. Almost none can prove it's compliant.",
      p1: "The EU AI Act is the world's first comprehensive AI law, and it reaches any organisation whose AI touches the EU market — wherever they're based. Yet compliance today means a lawyer, a spreadsheet, and weeks of cross-referencing a 100-page regulation.",
      p2: "Conforma turns that into a guided workflow: answer a few questions per system, get a defensible classification, and walk out with the evidence and documents you need.",
      code: {
        comment: "# classify a system",
        result: "→ HIGH RISK",
        obligations: "11 provider obligations · Art. 9–49",
        deadlineLabel: "deadline:",
        drafted: "✓ documentation drafted",
      },
    },
    personas: {
      eyebrow: "Built for every team",
      title: "One source of truth for everyone on the hook",
      subtitle:
        "The AI Act doesn't sit with one team. Conforma gives each stakeholder the same defensible record.",
      items: {
        legal: {
          role: "Legal & Compliance",
          desc: "Defensible, cited classifications and an auditable trail — without manually parsing the regulation.",
        },
        product: {
          role: "AI & Product teams",
          desc: "Know what each model requires before launch, so compliance stops blocking the roadmap.",
        },
        security: {
          role: "Security & IT leaders",
          desc: "A single registry of every AI system in the org, its risk tier, and its evidence.",
        },
      },
    },
    tiers: {
      title: "Four risk tiers. One clear answer.",
      subtitle:
        "The Act sorts every AI system into a risk tier — and the tier decides what you must do. Conforma pins yours, with the citation.",
    },
    how: {
      title: "From unknown to audit-ready in four steps",
      steps: {
        register: {
          title: "Register",
          desc: "Add each AI system to your registry — built, bought, or embedded in a product.",
        },
        classify: {
          title: "Classify",
          desc: "A guided questionnaire maps the system to a risk tier with cited Articles. No lawyer required.",
        },
        closeGaps: {
          title: "Close gaps",
          desc: "Work through the exact obligations for that tier as a tracked checklist with owners and status.",
        },
        generate: {
          title: "Generate docs",
          desc: "Draft the technical documentation, transparency notices and declaration of conformity in one click.",
        },
      },
    },
    timeline: {
      eyebrow: "The clock is ticking",
      title: "The EU AI Act application timeline",
      subtitle:
        "Obligations switch on in phases under Art. 113. Conforma tracks every milestone so nothing slips.",
      inForce: "In force",
    },
    features: {
      title: "Everything you need to prove conformity",
      subtitle:
        "A complete toolkit — from cited classification to audit-ready documents.",
      items: {
        cited: {
          title: "Cited, not vibes",
          desc: "Every classification and obligation links to the specific Article or Annex of Regulation (EU) 2024/1689 — defensible in an audit.",
        },
        annexIII: {
          title: "Annex III coverage",
          desc: "All {count} high-risk areas encoded — from employment and credit scoring to biometrics and law enforcement.",
        },
        drafted: {
          title: "AI-drafted documents",
          desc: "Claude drafts the Annex IV technical file, Art. 50 transparency notices and the EU declaration of conformity, tailored to each system.",
        },
        deadlines: {
          title: "Deadline tracking",
          desc: "Live countdowns to each phased application date so nothing slips past 2 Aug 2026 or 2027.",
        },
        roles: {
          title: "Provider & deployer",
          desc: "Obligations split by your role — whether you build the system or merely deploy someone else's.",
        },
        gpai: {
          title: "GPAI aware",
          desc: "Flags general-purpose AI model obligations (Art. 53+) on top of the system-level risk tier.",
        },
      },
    },
    comparison: {
      title: "A fraction of the cost of the alternatives",
      conforma: "Conforma",
      lawFirm: "Law firm",
      spreadsheet: "Spreadsheet",
      rows: {
        cited: "Cited risk classification",
        continuous: "Continuous, not one-off",
        drafted: "AI-drafted documentation",
        registry: "Whole-portfolio registry",
        cost: "Cost",
      },
      values: {
        manual: "manual",
        conformaCost: "€149/mo",
        lawFirmCost: "€10k+/audit",
        spreadsheetCost: "€0 + risk",
      },
    },
    testimonials: {
      title: "Built for the teams on the hook",
      note: "Illustrative of target customers during early access.",
      items: {
        one: {
          quote:
            "We went from a 40-tab spreadsheet to a single registry our auditors actually trust. The cited classifications are the part that sold our GC.",
          name: "Head of Compliance",
          company: "B2B SaaS · 200 employees",
        },
        two: {
          quote:
            "Our product team can finally self-serve a risk read before launch instead of waiting two weeks for legal. That alone paid for it.",
          name: "VP Product",
          company: "Fintech scale-up",
        },
        three: {
          quote:
            "The generated Annex IV draft saved our outside counsel days of work. We treat Conforma as the system of record for AI governance.",
          name: "DPO",
          company: "Healthcare platform",
        },
      },
    },
    penalty: {
      title: "The cost of getting it wrong",
      subtitle:
        "Penalties under Art. 99 scale to the higher of a fixed cap or a share of worldwide annual turnover.",
      orTurnover: "or {pct}% of turnover",
      labels: {
        prohibited: "Prohibited use",
        highRisk: "High-risk breach",
        misleadingInfo: "Misleading info",
      },
    },
    security: {
      eyebrow: "Enterprise-ready",
      title: "Security and governance built in",
      body: "EU data residency, encryption in transit and at rest, SSO/SAML, role-based access, audit logs and a custom DPA. Your compliance tool should be compliant too.",
      cta: "Read about our security",
      badges: {
        residency: "EU data residency",
        encryption: "Encryption at rest & in transit",
        sso: "SSO / SAML",
        rbac: "Role-based access",
        audit: "Audit logging",
        dpa: "Custom DPA",
      },
    },
    pricing: {
      title: "Pricing that beats a compliance retainer",
      subtitle:
        "A single high-risk audit from a law firm costs more than a year of Conforma. Start free, upgrade when you scale.",
    },
    faq: {
      title: "Frequently asked questions",
      items: {
        scope: {
          q: "Does the EU AI Act apply to us if we're not in the EU?",
          a: "If your AI system is placed on the market or its output is used in the EU, the Act applies regardless of where your company is based — much like GDPR. Conforma helps any global team scope their exposure.",
        },
        advice: {
          q: "Is Conforma legal advice?",
          a: "No. Conforma is decision-support tooling that encodes the regulation as a structured workflow with citations. It dramatically reduces the work, but you should confirm classifications with qualified counsel.",
        },
        deadline: {
          q: "What's the August 2026 deadline?",
          a: "Under Art. 113, the core obligations for high-risk systems (Annex III) and the Art. 50 transparency duties become applicable on 2 August 2026 — the deadline most organisations are racing toward.",
        },
        accuracy: {
          q: "How accurate is the classification?",
          a: "Classification runs on a deterministic decision tree mapped directly to the Act's text, so every result is traceable to specific Articles. AI is used only to draft documentation and explanations, never to override the cited logic.",
        },
        data: {
          q: "Where is our data stored?",
          a: "Enterprise plans run in EU data residency with encryption in transit and at rest. See our Security page for the full detail, including SSO, audit logs and our DPA.",
        },
      },
    },
    finalCta: {
      title: "Find out where you stand in 30 seconds",
      subtitle:
        "No account, no card. Classify your first AI system and see exactly what the EU AI Act requires of it.",
    },
  },

  /* ----------------------------------------------------------------- pricing */
  pricing: {
    hero: {
      title: "Pricing that beats a compliance retainer",
      subtitle:
        "A single high-risk audit from a law firm costs more than a year of Conforma. Start free — no credit card required.",
    },
    comparePlans: "Compare plans",
    table: {
      feature: "Feature",
      starter: "Starter",
      team: "Team",
      business: "Business",
      enterprise: "Enterprise",
      rows: {
        systems: "AI systems",
        classification: "Risk classification",
        checklists: "Obligation checklists",
        drafted: "AI-drafted documents",
        exports: "Audit-ready exports",
        users: "Users & roles",
        auditLog: "Audit log",
        api: "API access",
        sso: "SSO / SAML",
        residency: "EU data residency",
        dpa: "Custom DPA",
        successManager: "Dedicated success manager",
      },
      unlimited: "Unlimited",
    },
    custom: {
      text: "Need something custom?",
      cta: "Talk to sales",
    },
  },

  /* ------------------------------------------------------------- pricingTable */
  pricingTable: {
    monthly: "Monthly",
    annual: "Annual",
    save: "Save 20%",
    mostPopular: "Most popular",
    perMonth: "/mo",
    billedAnnually: "billed annually",
    billedMonthly: "billed monthly",
    freeForever: "free forever",
    tiers: {
      starter: {
        name: "Starter",
        tagline: "Map your first system",
        cta: "Start free",
        features: {
          oneSystem: "1 AI system",
          classification: "Risk classification with cited Articles",
          checklist: "Obligation checklist",
          deadlines: "Deadline tracking",
        },
      },
      team: {
        name: "Team",
        tagline: "For teams shipping AI",
        cta: "Start 14-day trial",
        features: {
          systems: "Up to 25 AI systems",
          drafted: "AI-drafted documentation",
          annexIV: "Annex IV technical files",
          exports: "Audit-ready exports",
          email: "Email support",
        },
      },
      business: {
        name: "Business",
        tagline: "For scaling AI portfolios",
        cta: "Start 14-day trial",
        features: {
          systems: "Up to 100 AI systems",
          users: "Multiple users & roles",
          auditLog: "Audit log & change history",
          api: "API access",
          priority: "Priority support",
        },
      },
    },
    enterprise: {
      name: "Enterprise",
      badge: "SSO · RBAC · DPA",
      desc: "Unlimited systems, SSO/SAML, role-based access, EU data residency, audit logs, custom DPA, and a dedicated compliance success manager.",
      cta: "Talk to sales",
    },
  },

  /* ---------------------------------------------------------------- security */
  security: {
    eyebrow: "Security & Trust",
    title: "Your compliance tool should be compliant too",
    subtitle:
      "Conforma holds the most sensitive map of your AI estate. We protect it with enterprise-grade controls and full transparency about how your data is handled.",
    badges: {
      gdpr: "GDPR-aligned",
      iso: "ISO/IEC 42001 aligned",
      nist: "NIST AI RMF",
      dpa: "Custom DPA",
    },
    principles: {
      encryption: {
        title: "Encryption everywhere",
        desc: "All data is encrypted in transit with TLS 1.2+ and at rest with AES-256. Secrets are managed in a dedicated key-management service.",
      },
      residency: {
        title: "EU data residency",
        desc: "Enterprise data is stored and processed in EU regions, so your compliance record never leaves the jurisdiction it covers.",
      },
      leastPrivilege: {
        title: "Least-privilege access",
        desc: "Role-based access control, SSO/SAML and enforced MFA mean people see only what their role requires — and you can prove it.",
      },
      audit: {
        title: "Full audit trail",
        desc: "Every change to a classification, obligation or document is logged with actor and timestamp — your evidence for an audit.",
      },
      isolation: {
        title: "Tenant isolation",
        desc: "Customer data is logically isolated per organisation, with strict access boundaries enforced at the application and data layers.",
      },
      resilient: {
        title: "Resilient by design",
        desc: "Automated backups, monitored infrastructure and a tested recovery process keep your registry available and intact.",
      },
    },
    privacy: {
      title: "Data protection & privacy",
      body: "You own your data. We process it solely to provide the service, never to train third-party models, and we make it exportable at any time. Enterprise customers receive a custom Data Processing Agreement (DPA) covering roles, sub-processors and security commitments under the GDPR.",
      cards: {
        residency: { title: "Data residency", value: "EU regions (Enterprise)" },
        retention: { title: "Retention", value: "Yours to control; deleted on request" },
        portability: { title: "Portability", value: "Full export, any time" },
      },
    },
    subprocessors: {
      title: "Sub-processors",
      intro:
        "We use a small, vetted set of sub-processors to deliver the service. Each is bound by data-protection terms consistent with our commitments to you.",
      table: { category: "Category", purpose: "Purpose", region: "Region" },
      rows: {
        hosting: {
          category: "Cloud hosting",
          purpose: "EU region application & database hosting",
          region: "EU",
        },
        ai: {
          category: "AI document drafting",
          purpose: "Generates draft compliance documents on request",
          region: "EU / US",
        },
        monitoring: {
          category: "Error monitoring",
          purpose: "Aggregated, scrubbed application telemetry",
          region: "EU",
        },
        email: {
          category: "Email delivery",
          purpose: "Transactional and notification email",
          region: "EU",
        },
      },
      note: "Representative list for the current product stage; the binding list is maintained in your DPA.",
    },
    disclosure: {
      title: "Responsible disclosure",
      bodyBefore: "Found a vulnerability? We want to hear from you. Report it to ",
      email: "security@conforma.eu",
      bodyAfter: " and we'll acknowledge within one business day.",
      cta: "Request our security pack",
    },
  },

  /* -------------------------------------------------------------------- demo */
  demo: {
    eyebrow: "Book a demo",
    title: "See your AI Act exposure in 30 minutes",
    subtitle:
      "A compliance specialist will walk your team through classifying your AI systems, closing obligation gaps, and generating the documentation your auditors expect.",
    bullets: {
      riskRead: {
        title: "A live risk read",
        desc: "We classify one of your real systems on the call, with cited Articles.",
      },
      gaps: {
        title: "Your obligation gaps",
        desc: "See exactly what's outstanding and the deadline that applies.",
      },
      rollout: {
        title: "Enterprise rollout",
        desc: "SSO, roles, EU data residency and how teams adopt Conforma.",
      },
    },
  },

  /* ---------------------------------------------------------------- demoForm */
  demoForm: {
    fullName: "Full name",
    workEmail: "Work email",
    company: "Company",
    role: "Your role",
    systemsInScope: "AI systems in scope",
    anythingElse: "Anything we should know?",
    placeholders: {
      name: "Jane Doe",
      email: "jane@company.com",
      company: "Company Ltd",
      message: "Your timeline, the systems you're worried about, etc.",
    },
    roles: {
      compliance: "Compliance / Legal",
      product: "AI / Product",
      security: "Security / IT",
      executive: "Executive",
      other: "Other",
    },
    submit: "Request a demo",
    consent:
      "We'll never share your details. By submitting you agree to be contacted about Conforma.",
    success: {
      title: "Thanks, {name}!",
      nameFallback: "there",
      body: "A member of our team will reach out to {email} within one business day to schedule your walkthrough.",
      emailFallback: "your email",
      impatient: "Can't wait? You can ",
      impatientLink: "classify a system right now",
    },
  },

  /* ------------------------------------------------------------------- legal */
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    effective: "Effective {date}",
    effectiveDate: "2026-06-24",
    sections: {
      agreement: {
        title: "1. Agreement",
        body: 'These terms govern your access to and use of Conforma (the "Service"). By using the Service, you agree to these terms. If you are using the Service on behalf of an organisation, you represent that you are authorised to bind it.',
      },
      service: {
        title: "2. The Service",
        body: "Conforma provides software to help organisations assess and document compliance with the EU AI Act. We may update, improve, or modify features over time.",
      },
      notAdvice: {
        title: "3. Not legal advice",
        body: "Conforma is a decision-support tool. Its classifications, checklists, and generated documents are informational and do **not** constitute legal advice. You remain responsible for your compliance and should confirm classifications with qualified counsel.",
      },
      accounts: {
        title: "4. Accounts & acceptable use",
        body: "You are responsible for safeguarding your account and for activity under it. You agree not to misuse the Service, attempt to disrupt it, or use it to violate any law or third-party right.",
      },
      content: {
        title: "5. Your content",
        body: "You retain all rights to the data you submit. You grant us a limited licence to process it solely to provide the Service, as described in our [Privacy Policy](/privacy).",
      },
      ip: {
        title: "6. Intellectual property",
        body: "The Service, including its software, design, and content (excluding your data), is owned by Conforma and protected by applicable law. These terms grant you no rights to our trademarks or branding.",
      },
      disclaimers: {
        title: "7. Disclaimers",
        body: 'The Service is provided "as is" without warranties of any kind, to the fullest extent permitted by law. We do not warrant that the Service will be uninterrupted, error-free, or that its outputs are complete or legally sufficient for your specific circumstances.',
      },
      liability: {
        title: "8. Limitation of liability",
        body: "To the maximum extent permitted by law, Conforma will not be liable for any indirect, incidental, or consequential damages, or for any regulatory penalties arising from your use of the Service.",
      },
      law: {
        title: "9. Governing law",
        body: "These terms are governed by the laws of Ireland, without regard to conflict of law principles, and the courts of Ireland will have exclusive jurisdiction, unless your mandatory local consumer law provides otherwise.",
      },
      changes: {
        title: "10. Changes & contact",
        body: "We may update these terms; material changes will be notified in advance. Questions? Email [legal@conforma.eu](mailto:legal@conforma.eu).",
      },
    },
  },

  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    effective: "Effective {date}",
    effectiveDate: "2026-06-24",
    sections: {
      overview: {
        title: "Overview",
        body: 'Conforma ("we", "us") provides software that helps organisations assess and document their compliance with the EU AI Act (Regulation (EU) 2024/1689). This policy explains what personal data we process and the choices you have. We are committed to processing personal data lawfully under the General Data Protection Regulation (GDPR).',
      },
      dataWeProcess: {
        title: "Data we process",
        body: "- **Account & contact data** — name, work email, company, and role, when you create an account or request a demo.\n- **Product data** — the AI-system records, classifications and documents you create in Conforma. This is your content; we process it only to provide the service.\n- **Usage & technical data** — aggregated, scrubbed telemetry (e.g. error events) used to keep the service reliable.",
      },
      howWeUse: {
        title: "How we use data",
        body: "We process personal data to provide and secure the service, respond to enquiries, and meet our legal obligations. We do **not** sell personal data, and we do not use your product content to train third-party AI models.",
      },
      legalBases: {
        title: "Legal bases",
        body: "Depending on the context, we rely on the performance of a contract (providing the service), our legitimate interests (securing and improving the service), your consent (e.g. marketing), and compliance with legal obligations.",
      },
      residency: {
        title: "Data residency & retention",
        body: "Enterprise customer data is hosted in EU regions. We retain personal data only as long as needed to provide the service or as required by law, and delete or anonymise it on request. See our [Security page](/security) for technical detail.",
      },
      subprocessors: {
        title: "Sub-processors",
        body: "We use a small, vetted set of sub-processors bound by data-protection terms consistent with this policy. The current list is published on our [Security page](/security#subprocessors).",
      },
      rights: {
        title: "Your rights",
        body: "Under the GDPR you have the right to access, rectify, erase, restrict, and port your personal data, and to object to certain processing. To exercise any of these, contact us at [privacy@conforma.eu](mailto:privacy@conforma.eu). You also have the right to lodge a complaint with your local supervisory authority.",
      },
      contact: {
        title: "Contact",
        body: "Questions about this policy or your data? Email [privacy@conforma.eu](mailto:privacy@conforma.eu).",
      },
    },
    footnote:
      "This page is provided for transparency about how the product handles data and does not constitute legal advice.",
  },

  /* ---------------------------------------------------------------- notFound */
  notFound: {
    code: "404",
    title: "Page not found",
    body: "The page you're looking for doesn't exist or has moved.",
    backHome: "Back home",
    classify: "Classify a system",
  },

  /* ---------------------------------------------------------------- appShell */
  app: {
    nav: {
      overview: "Overview",
      classify: "Classify",
      reports: "Reports",
    },
    workspace: "Workspace",
    account: "Account",
    settings: "Settings",
    helpDocs: "Help & docs",
    helpAria: "Help and docs",
    notifications: "Notifications",
    accountSettings: "Account settings",
    complianceClock: "Compliance clock",
    untilHighRisk: "until high-risk obligations apply —",
    highRiskDate: "2 Aug 2026",
    accountName: "Mohammad E.",
    accountPlan: "Acme AI · Pro",
    breadcrumb: {
      assessment: "Assessment",
      classifyTitle: "Classify a system",
      reporting: "Reporting",
      reportTitle: "Readiness report",
      registry: "Registry",
      systemDetail: "System detail",
      workspace: "Workspace",
      overview: "Overview",
    },
  },

  /* ---------------------------------------------------------------- settings */
  settings: {
    title: "Settings",
    subtitle: "Manage how Conforma looks and behaves on this device.",
    appearance: {
      title: "Appearance",
      desc: "Choose the interface theme. Your preference is saved on this device.",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
    },
    language: {
      title: "Language",
      desc: "Interface language and text direction. Changes apply instantly.",
      label: "Interface language",
    },
    data: {
      title: "Registry data",
      desc: "Your AI-system registry lives only in this browser — nothing is sent to a server. Reset it to the seeded examples, or clear it entirely.",
      count: plural({
        one: "{count} system in this browser",
        other: "{count} systems in this browser",
      }),
      reset: "Reset to demo data",
      clear: "Clear all systems",
      resetDone: "Registry reset to the demo systems.",
      clearDone: "Registry cleared.",
      confirmResetTitle: "Reset to demo data?",
      confirmResetBody:
        "This replaces the current registry with the ten seeded example systems. Any entries you added in this browser will be lost.",
      confirmClearTitle: "Clear all systems?",
      confirmClearBody:
        "This permanently removes every system from this browser's registry. This cannot be undone.",
    },
    about: {
      title: "About",
      desc: "A portfolio-grade EU AI Act compliance workspace.",
      version: "Version",
      mode: "Document generation",
      docs: "Documentation",
      source: "Source code",
      builtBy: "Built by",
    },
  },

  /* ------------------------------------------------------------------ alerts */
  alerts: {
    title: "Alerts",
    subtitle: "Signals from your registry",
    empty: "You're all caught up — no open compliance signals.",
    viewAll: "Go to dashboard",
    prohibitedTitle: plural({
      one: "{count} prohibited-practice system",
      other: "{count} prohibited-practice systems",
    }),
    prohibitedBody: "Banned under Article 5 — stop use immediately.",
    attentionTitle: plural({
      one: "{count} high-risk system below target",
      other: "{count} high-risk systems below target",
    }),
    attentionBody: "Less than half of their obligations are complete.",
    deadlineTitle: "High-risk obligations deadline",
    deadlineBody: "Chapter III duties apply on {date} (Art. 113).",
  },

  /* ------------------------------------------------------------------- error */
  error: {
    title: "Something went wrong",
    body: "An unexpected error interrupted this page. Your saved systems are safe — nothing was lost.",
    retry: "Try again",
    home: "Return home",
    reference: "Error reference",
  },

  /* ------------------------------------------------------------------- toast */
  toast: {
    region: "Notifications",
    dismiss: "Dismiss",
    saved: "System saved to your registry.",
    deleted: "System deleted.",
    copied: "Copied to clipboard.",
    copyFailed: "Couldn't copy — please select and copy manually.",
    exportBlocked: "Pop-up blocked. Allow pop-ups to export the document.",
  },

  /* ------------------------------------------------------------ commandPalette */
  commandPalette: {
    aria: "Command palette",
    trigger: "Search",
    placeholder: "Search commands and systems…",
    empty: "No results.",
    groups: { navigate: "Navigate", actions: "Actions", systems: "Systems" },
    actions: {
      newClassification: "New classification",
      resetDemo: "Reset demo data",
      toggleTheme: "Toggle theme",
      openDocs: "Open documentation",
    },
  },

  /* ---------------------------------------------------------------- classify */
  classify: {
    steps: {
      basics: "Basics",
      definition: "Definition",
      prohibited: "Prohibited",
      highRisk: "High-risk",
      transparency: "Transparency",
    },
    step0: {
      title: "Tell us about the system",
      sub: "The basics. You can register systems you build (provider) or systems you use (deployer).",
      nameLabel: "System name",
      namePlaceholder: "e.g. CV screening model",
      descLabel: "What does it do?",
      descPlaceholder: "Short description of its intended purpose.",
      roleLabel: "Your role",
      roleProvider: "Provider (we build it)",
      roleDeployer: "Deployer (we use it)",
      roleBoth: "Both",
      ownerLabel: "Owner / team",
      ownerPlaceholder: "e.g. People Ops",
    },
    step1: {
      title: "Is it an AI system?",
      sub: "The Act applies to systems that infer outputs from inputs with some autonomy (Art. 3(1)).",
      isAi: "This meets the definition of an AI system",
      isGpai: "It is built on a general-purpose AI model (e.g. an LLM)",
      isGpaiHint: "Triggers extra GPAI provider obligations (Art. 53+).",
    },
    step2: {
      title: "Does it do any of these?",
      sub: "These practices are prohibited outright under Art. 5. Select all that apply — or none.",
    },
    step3: {
      title: "High-risk use cases",
      sub: "High-risk systems carry the full weight of the Act. Select any that match the system's intended purpose.",
      annexI: "It is a safety component of a product covered by EU harmonised law (Annex I)",
      annexIHint: "e.g. machinery, medical devices, vehicles.",
      annexIIIHeading: "Annex III areas",
      derogation:
        "It performs only a narrow procedural task and does not materially influence decisions",
      derogationHint:
        "The Art. 6(3) derogation — may take it out of high-risk, but you must document the assessment.",
    },
    step4: {
      title: "Transparency triggers",
      sub: "Even outside high-risk, some uses carry disclosure duties under Art. 50.",
      interacts: "Interacts directly with people (e.g. a chatbot)",
      synthetic: "Generates synthetic audio, image, video or text",
      deepfake: "Produces deepfakes",
      emotion: "Emotion recognition or biometric categorisation",
    },
    nav: {
      back: "Back",
      continue: "Continue",
      seeClassification: "See classification",
    },
    provisional: "Provisional tier:",
    result: {
      untitled: "Untitled system",
      plusGpai: "+ GPAI obligations",
      whyTier: "Why this tier",
      applicableDeadline: "Applicable deadline",
      obligationsToSatisfy: plural({
        one: "{count} obligation to satisfy",
        other: "{count} obligations to satisfy",
      }),
      moreObligations: "+ {count} more — full checklist after you save.",
      explain: "Explain in plain English",
      aiExplanation: "AI explanation",
      demoModeTag: "Demo Mode",
      demoModeTitle:
        "Realistic, pre-generated sample. Add an ANTHROPIC_API_KEY to switch to live, system-specific drafting.",
      couldNotReach: "Could not reach the explanation service.",
      editAnswers: "Edit answers",
      saveToRegistry: "Save to registry",
      disclaimer:
        "Decision-support only — not legal advice. Confirm with qualified counsel.",
      viewDashboard: "View dashboard",
    },
  },

  /* --------------------------------------------------------------- dashboard */
  dashboard: {
    eyebrow: "AI Governance",
    title: "System Registry",
    subtitle:
      "Every AI system you build or deploy, with its live status under Regulation (EU) 2024/1689.",
    exportReport: "Export report",
    classifySystem: "Classify a system",
    kpi: {
      systems: "Systems registered",
      systemsTip: "AI systems currently in your inventory.",
      systemsSub: "{count} high-risk or prohibited",
      compliance: "Portfolio compliance",
      complianceTip: "Average share of applicable obligations marked done.",
      complianceSub: "obligations closed, on average",
      highRisk: "High-risk systems",
      highRiskTip: "Annex III systems carrying the full Chapter III duties.",
      highRiskSub: "full Chapter III obligations",
      nearest: "Nearest deadline",
      nearestTip: "Soonest statutory deadline across your portfolio.",
      nearestNoSystems: "no systems yet",
    },
    emptyTitle: "No systems registered yet",
    emptyBody:
      "Classify your first AI system to see exactly what the EU AI Act requires of it — with cited Articles and a tracked obligation checklist.",
    riskDistribution: "Risk distribution",
    total: "{count} total",
    systemsUnit: "systems",
    needsAttention: "Needs attention",
    needsAttentionSub: "Highest risk and least complete — review these first.",
    toNearestDeadline: "to nearest deadline",
    unassigned: "Unassigned",
    portfolioCompliance: "Portfolio compliance",
    viewFullReport: "View full report",
    allSystems: "All systems",
    searchPlaceholder: "Search systems…",
    searchAria: "Search systems",
    filterAria: "Filter by risk tier",
    all: "All",
    sortAria: "Sort systems",
    sortRecent: "Most recent",
    sortRisk: "Highest risk",
    sortCompliance: "Lowest compliance",
    sortName: "Name (A–Z)",
    noMatches: "No matches",
    noMatchesBody: "Try a different search or clear the filters.",
    clearFilters: "Clear filters",
    table: {
      system: "System",
      risk: "Risk",
      owner: "Owner",
      compliance: "Compliance",
      deadline: "Deadline",
      open: "Open",
    },
    showing: "Showing {from}–{to} of {total}",
    prev: "Prev",
    next: "Next",
  },

  /* ------------------------------------------------------------------ report */
  report: {
    backDashboard: "Dashboard",
    printSave: "Print / Save as PDF",
    reportTitle: "EU AI Act Compliance Readiness Report",
    generated: "Generated {date}",
    regulation: "Regulation (EU) 2024/1689",
    executiveSummary: "Executive summary",
    summary: {
      systems: "Systems",
      highRiskPlus: "High-risk +",
      avgCompliance: "Avg. compliance",
      tiersInUse: "Tiers in use",
    },
    riskDistribution: "Risk distribution",
    systemRegister: "System register",
    table: {
      system: "System",
      risk: "Risk",
      owner: "Owner",
      outstanding: "Outstanding",
      compliance: "Compliance",
    },
    noSystems: "No systems registered.",
    footer:
      "This report is generated by Conforma as decision-support for Regulation (EU) 2024/1689. It does not constitute legal advice. Classifications should be confirmed with qualified counsel before reliance.",
  },

  /* ------------------------------------------------------------------ system */
  system: {
    backRegistry: "Registry",
    notFoundTitle: "System not found",
    notFoundBody:
      "It may have been deleted, or it was saved in another browser. Your registry is stored locally on this device.",
    backToDashboard: "Back to dashboard",
    plusGpai: "+ GPAI",
    meta: {
      tier: "Tier",
      role: "Role",
      owner: "Owner",
      deadline: "Deadline",
    },
    unassigned: "Unassigned",
    compliance: "Compliance",
    rationaleTitle: "Classification rationale",
    obligationsTitle: "Obligations checklist",
    obligationsHint: "Tap a status to cycle: To do → In progress → Done.",
    states: {
      todo: "To do",
      inProgress: "In progress",
      done: "Done",
    },
    classifyAnother: "Classify another system",
    deleteSystem: "Delete system",
    deleteConfirm: 'Delete "{name}" from the registry?',
    docs: {
      title: "Compliance documents",
      hint: "Generate first-draft regulatory documents tailored to this system, then preview and export to Markdown, Word or PDF.",
      types: {
        technical: { label: "Technical Documentation", cite: "Annex IV / Art. 11" },
        transparency: { label: "Transparency Notice", cite: "Art. 50" },
        conformity: { label: "Declaration of Conformity", cite: "Art. 47" },
      },
      drafting: "Drafting {label}…",
      preview: "Preview",
      markdown: "Markdown",
      copy: "Copy",
      copied: "Copied!",
      couldNotGenerate: "Could not generate this document. Please try again.",
    },
  },

  /* -------------------------------------------------------------- landingDemo */
  landingDemo: {
    pickSystem: "Pick a system",
    builtOnGpai: "Built on a general-purpose model",
    builtOnGpaiHint: "Adds GPAI provider duties (Art. 53+)",
    liveClassification: "Live classification",
    plusGpai: "+ GPAI",
    obligations: "Obligations",
    deadline: "Deadline",
    runFull: "Run the full 5-step classifier",
    scenarios: {
      employment: { label: "CV screening", hint: "Ranks job applicants" },
      credit: { label: "Credit scoring", hint: "Assesses creditworthiness" },
      chatbot: { label: "Support chatbot", hint: "Talks to customers" },
      deepfake: { label: "Deepfake studio", hint: "Generates synthetic media" },
      social: { label: "Social scoring", hint: "Ranks citizens by behaviour" },
      forecast: { label: "Demand forecasting", hint: "Predicts inventory needs" },
    },
  },

  /* ----------------------------------------------------------------- aiSource */
  ai: {
    demoDocNote:
      "> **AI-drafted by Conforma · Demo Mode.** This is a realistic English-language sample generated with no external AI service, so the public demo works with zero credentials. With an `ANTHROPIC_API_KEY` configured, Conforma drafts documents natively in your selected language. Replace every `[BRACKETED PLACEHOLDER]` before use. Decision-support, not legal advice.",
    demoBadge: "Demo Mode · sample AI output",
    demoBadgeTitle:
      "No Anthropic API key is configured, so AI generation runs in Demo Mode — realistic, pre-generated sample documents. No paid API required.",
    draftedByClaude: "Drafted by Claude",
    aiDraftDemo: "AI draft · Demo Mode",
    aiDraftDemoTitle:
      "Realistic, pre-generated sample. Add an ANTHROPIC_API_KEY to switch to live, system-specific drafting.",
    couldNotGenerate: "Could not generate — please try again.",
    docLabels: {
      technical: "Technical Documentation (Annex IV)",
      transparency: "Transparency Notice (Art. 50)",
      conformity: "EU Declaration of Conformity (Art. 47)",
    },
    /** Plain-language narrative, composed from these fragments per locale. */
    narrative: {
      intro:
        '"{system}" has been classified as {tier} under Regulation (EU) 2024/1689. {reasons} In practice this means {summary}{gpai}',
      gpai: " Because it is built on a general-purpose AI model, the GPAI provider duties in Art. 53 apply on top of the tier above — keep model technical documentation and a training-data summary ready.",
      nextStep:
        "The single most urgent next step is to {step}. The clock that matters here is {deadline} — {date} — after which the obligations become enforceable. Non-compliance can attract penalties of up to {penalty} or {pct}% of worldwide annual turnover, whichever is higher ({citation}).",
      closing:
        "Treat the obligation checklist below as your gap analysis: assign an owner to each item, capture the evidence that shows you meet it, and close anything still open well ahead of the deadline. None of this is legal advice — confirm the final classification and your remediation plan with qualified counsel.",
      steps: {
        prohibited:
          "stop placing the system on the market or putting it into service, because the practice is banned outright under Art. 5",
        high: "stand up the Art. 9 risk-management process and begin the Annex IV technical file, since these gate the conformity assessment you must pass before the deadline",
        limited:
          "implement the Art. 50 transparency disclosures — tell people they are dealing with AI and machine-readably label any synthetic content",
        minimal:
          "record this assessment in your AI inventory and keep it under review, since intended-purpose changes can move the system into a higher tier",
      },
    },
    /** Used to instruct Claude to write in the visitor's language (live mode). */
    promptLanguage: "English",
  },

  /* ------------------------------------------------------------- classifier */
  classifier: {
    notAISystem:
      "The system does not meet the Art. 3(1) definition of an 'AI system', so the Act's system-level obligations do not apply.",
    prohibitedMatch: "Matches a prohibited practice: {practice}.",
    annexIMatch:
      "The AI is a safety component of, or is itself, a product covered by EU harmonised legislation listed in Annex I, and requires third-party conformity assessment.",
    annexIIIMatch: "Intended purpose falls within a high-risk area: {area}.",
    derogation:
      "You indicated the system performs only a narrow procedural or preparatory task and does not materially influence decision outcomes. Under the Art. 6(3) derogation it may fall outside high-risk — but you must document this assessment and still register the system.",
    transparencyMatch: "The system {trigger}, triggering transparency duties.",
    transparencyTriggers: {
      interacts: "interacts directly with people",
      synthetic: "generates synthetic audio/image/video/text",
      deepfake: "produces deepfakes",
      emotion: "performs emotion recognition or biometric categorisation",
    },
    minimalDefault:
      "No prohibited practice, high-risk use case or transparency trigger was identified. The system falls into the minimal-risk category.",
    gpaiOverlay:
      "The system is built on a general-purpose AI model, so the GPAI provider obligations apply in addition to the system-level tier above.",
  },

  /* ------------------------------------------------------------------ domain */
  domain: {
    roles: {
      provider: "Provider",
      deployer: "Deployer",
      both: "Both",
    },
    riskTiers: {
      prohibited: {
        label: "Unacceptable risk — Prohibited",
        short: "Prohibited",
        summary:
          "The practice is banned in the EU. It cannot be placed on the market, put into service, or used. Continued use exposes you to the highest penalties.",
      },
      high: {
        label: "High risk",
        short: "High risk",
        summary:
          "Permitted only if it meets the full set of obligations in Chapter III before market placement: risk management, data governance, technical documentation, logging, transparency, human oversight, accuracy & cybersecurity, plus a conformity assessment and EU database registration.",
      },
      limited: {
        label: "Limited risk — Transparency",
        short: "Limited",
        summary:
          "Largely permitted, but specific transparency duties apply: people must be told they are interacting with AI, and synthetic / manipulated content must be machine-readably labelled.",
      },
      minimal: {
        label: "Minimal risk",
        short: "Minimal",
        summary:
          "No mandatory obligations under the AI Act. Voluntary codes of conduct are encouraged. AI-literacy duties (Art. 4) and general product law still apply.",
      },
    },
    prohibited: {
      subliminal: {
        title: "Subliminal or manipulative techniques",
        description:
          "Deploys subliminal, purposefully manipulative or deceptive techniques that materially distort behaviour and cause (or are likely to cause) significant harm.",
      },
      vulnerability: {
        title: "Exploiting vulnerabilities",
        description:
          "Exploits vulnerabilities due to age, disability or a specific social/economic situation to distort behaviour and cause significant harm.",
      },
      "social-scoring": {
        title: "Social scoring",
        description:
          "Evaluates or classifies people over time based on social behaviour or personal traits, leading to detrimental treatment in unrelated contexts or that is unjustified/disproportionate.",
      },
      "predictive-policing": {
        title: "Individual predictive policing",
        description:
          "Assesses the risk of a person committing a crime based solely on profiling or personality traits.",
      },
      "facial-scraping": {
        title: "Untargeted facial-recognition scraping",
        description:
          "Creates or expands facial-recognition databases through untargeted scraping of facial images from the internet or CCTV.",
      },
      "emotion-work-edu": {
        title: "Emotion recognition at work / in education",
        description:
          "Infers emotions of people in the workplace or educational institutions (save for medical or safety reasons).",
      },
      "biometric-categorization": {
        title: "Sensitive biometric categorisation",
        description:
          "Categorises people based on biometric data to deduce race, political opinions, trade-union membership, religion, sex life or sexual orientation.",
      },
      rbi: {
        title: "Real-time remote biometric identification",
        description:
          "Uses 'real-time' remote biometric identification in publicly accessible spaces for law enforcement (subject to narrow, authorised exceptions).",
      },
    },
    annexIII: {
      biometrics: {
        title: "Biometrics",
        examples:
          "Remote biometric identification, biometric categorisation by sensitive attributes, emotion recognition (where not prohibited).",
      },
      "critical-infrastructure": {
        title: "Critical infrastructure",
        examples:
          "Safety components in the management/operation of critical digital infrastructure, road traffic, or supply of water, gas, heating, electricity.",
      },
      education: {
        title: "Education & vocational training",
        examples:
          "Admissions decisions, evaluating learning outcomes, assessing the appropriate level of education, monitoring/detecting prohibited exam behaviour.",
      },
      employment: {
        title: "Employment & worker management",
        examples:
          "Recruitment/selection, targeted job ads, screening applications, promotion/termination decisions, task allocation, monitoring performance.",
      },
      "essential-services": {
        title: "Access to essential services",
        examples:
          "Eligibility for public assistance/benefits, creditworthiness & credit scoring, risk assessment & pricing in life/health insurance, emergency dispatch.",
      },
      "law-enforcement": {
        title: "Law enforcement",
        examples:
          "Assessing risk of offending/re-offending or of becoming a victim, polygraphs, evaluating evidence reliability, profiling during investigations.",
      },
      migration: {
        title: "Migration, asylum & border control",
        examples:
          "Polygraphs, risk assessments of irregular migration/security/health, examining asylum/visa applications, detecting/identifying persons.",
      },
      justice: {
        title: "Justice & democratic processes",
        examples:
          "Assisting judicial authorities in researching/interpreting facts and law; influencing the outcome of elections/referenda or voting behaviour.",
      },
    },
    obligations: {
      "risk-management": {
        title: "Risk management system",
        description:
          "Establish, document and maintain a continuous, iterative risk-management process across the system's lifecycle.",
      },
      "data-governance": {
        title: "Data & data governance",
        description:
          "Training, validation and testing data must meet quality criteria: relevant, representative, free of errors, and examined for bias.",
      },
      "technical-documentation": {
        title: "Technical documentation",
        description:
          "Draw up and keep up to date the technical documentation demonstrating conformity (the Annex IV dossier).",
      },
      "record-keeping": {
        title: "Record-keeping (logging)",
        description:
          "Automatically record events ('logs') over the system's lifetime to ensure traceability of functioning.",
      },
      "transparency-deployers": {
        title: "Transparency to deployers",
        description:
          "Design for sufficient transparency and supply instructions for use enabling deployers to interpret output and use it appropriately.",
      },
      "human-oversight": {
        title: "Human oversight",
        description:
          "Design the system so it can be effectively overseen by humans, including stop/override and awareness of automation bias.",
      },
      "accuracy-robustness": {
        title: "Accuracy, robustness & cybersecurity",
        description:
          "Achieve appropriate levels of accuracy, robustness and cybersecurity, consistent and resilient against errors and adversarial attacks.",
      },
      qms: {
        title: "Quality management system",
        description:
          "Put a documented quality management system in place covering processes, procedures and responsibilities for compliance.",
      },
      "conformity-assessment": {
        title: "Conformity assessment",
        description:
          "Undergo the relevant conformity-assessment procedure before placing the system on the market or putting it into service.",
      },
      "ce-doc": {
        title: "EU declaration of conformity & CE marking",
        description:
          "Draw up the EU declaration of conformity and affix the CE marking indicating conformity with the Regulation.",
      },
      "eu-registration": {
        title: "Registration in the EU database",
        description:
          "Register the high-risk system in the EU database before placing it on the market or putting it into service.",
      },
      "use-per-instructions": {
        title: "Use per instructions & assign oversight",
        description:
          "Use the system in line with the instructions, assign competent human oversight, and ensure input data is relevant.",
      },
      monitoring: {
        title: "Monitor & report",
        description:
          "Monitor operation, suspend use and inform the provider/authority on serious incidents or risks; keep the automatically generated logs.",
      },
      fria: {
        title: "Fundamental Rights Impact Assessment",
        description:
          "Public bodies and certain private deployers (e.g. banking, insurance) must complete a fundamental-rights impact assessment before use.",
      },
      "inform-affected": {
        title: "Inform affected persons",
        description:
          "Where the system makes or assists decisions about people, inform those people that they are subject to its use.",
      },
      "disclose-chatbot": {
        title: "Disclose AI interaction",
        description:
          "People must be informed they are interacting with an AI system, unless it is obvious from the context.",
      },
      "label-synthetic": {
        title: "Mark synthetic content",
        description:
          "AI-generated audio, image, video or text must be marked in a machine-readable format as artificially generated or manipulated.",
      },
      "label-deepfake": {
        title: "Disclose deepfakes",
        description:
          "Deployers of systems generating deepfakes must disclose that the content has been artificially generated or manipulated.",
      },
      "emotion-disclosure": {
        title: "Disclose emotion / biometric categorisation",
        description:
          "Deployers of emotion-recognition or biometric-categorisation systems must inform the people exposed to them.",
      },
      "gpai-techdoc": {
        title: "Model technical documentation",
        description:
          "Draw up and maintain technical documentation of the model, including training and testing process and evaluation results.",
      },
      "gpai-downstream": {
        title: "Information to downstream providers",
        description:
          "Provide information and documentation to downstream providers integrating the model into their AI systems.",
      },
      "gpai-copyright": {
        title: "Copyright policy & training-data summary",
        description:
          "Put in place a policy to comply with EU copyright law and publish a sufficiently detailed summary of training content.",
      },
      "gpai-systemic": {
        title: "Systemic-risk obligations",
        description:
          "Models with systemic risk must additionally perform model evaluations, adversarial testing, incident tracking and cybersecurity protection.",
      },
    },
    deadlines: {
      force: {
        label: "Regulation enters into force",
        description:
          "The AI Act enters into force; the staged application clock starts.",
      },
      prohibitions: {
        label: "Prohibited practices & AI literacy apply",
        description:
          "Bans in Art. 5 become applicable, together with the AI-literacy duty (Art. 4).",
      },
      gpai: {
        label: "GPAI, governance & penalties apply",
        description:
          "Obligations for general-purpose AI models, the governance framework and penalty regime become applicable.",
      },
      "high-risk-annex-iii": {
        label: "High-risk (Annex III) & transparency apply",
        description:
          "The core high-risk obligations for Annex III systems and the Art. 50 transparency duties become applicable. This is the deadline most organisations are racing toward.",
      },
      "high-risk-annex-i": {
        label: "High-risk (regulated products) apply",
        description:
          "High-risk obligations for AI that is a safety component of products already covered by EU harmonised legislation (Annex I) become applicable.",
      },
    },
  },

  /* ---------------------------------------------------------------- metadata */
  metadata: {
    root: {
      titleDefault: "Conforma — EU AI Act compliance, automated",
      titleTemplate: "%s · Conforma",
      description:
        "Conforma is the compliance platform for the EU AI Act. Inventory your AI systems, auto-classify their risk with cited Articles, close obligation gaps, and generate audit-ready documentation before the August 2026 deadline.",
      ogTitle: "Conforma — EU AI Act compliance, automated",
      ogDescription:
        "Auto-classify your AI systems, close obligation gaps, and generate audit-ready documentation before the EU AI Act's August 2026 deadline.",
      twitterTitle: "Conforma — EU AI Act compliance, automated",
      twitterDescription:
        "The compliance platform for the EU AI Act. Classify, close gaps, and generate documentation before August 2026.",
    },
    pricing: {
      title: "Pricing",
      description:
        "Simple, transparent pricing for EU AI Act compliance. Start free, scale to unlimited systems with SSO, audit logs and EU data residency on Enterprise.",
    },
    security: {
      title: "Security & Trust",
      description:
        "How Conforma protects your data: EU data residency, encryption in transit and at rest, SSO/SAML, role-based access, audit logging, sub-processor transparency and a custom DPA.",
    },
    demo: {
      title: "Book a demo",
      description:
        "See how Conforma classifies your AI systems under the EU AI Act, closes obligation gaps, and generates audit-ready documentation. Book a 30-minute walkthrough.",
    },
    terms: {
      title: "Terms of Service",
      description:
        "The terms governing use of Conforma, including the scope of the service, the no-legal-advice disclaimer, acceptable use, and liability.",
    },
    privacy: {
      title: "Privacy Policy",
      description:
        "How Conforma collects, uses, and protects personal data, your rights under the GDPR, data residency, retention, and our sub-processors.",
    },
    classify: {
      title: "Classify an AI system",
      description:
        "Answer a few questions and get an EU AI Act risk classification with cited Articles, the obligations that apply, and your compliance deadline — in 30 seconds.",
    },
    dashboard: { title: "Dashboard" },
    report: { title: "Compliance Readiness Report" },
    system: { title: "AI system" },
  },

  /* ---------------------------------------------------------- opengraph image */
  og: {
    alt: "Conforma — EU AI Act compliance, automated",
    title: "EU AI Act compliance, on autopilot",
    subtitle:
      "Classify your AI systems, close obligation gaps, and generate audit-ready documentation.",
    badge: "High-risk obligations apply 2 Aug 2026",
    regulation: "Regulation (EU) 2024/1689",
  },

  /* -------------------------------------------------------------------- auth */
  auth: {
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    passwordLabel: "Password",
    fullNameLabel: "Full name",
    fullNamePlaceholder: "Jane Doe",
    orgNameLabel: "Organization name",
    orgNamePlaceholder: "Acme Inc.",
    showPassword: "Show password",
    hidePassword: "Hide password",
    passwordHint: "At least 8 characters.",
    signOut: "Sign out",
    signIn: {
      title: "Welcome back",
      subtitle: "Sign in to your Conforma workspace.",
      submit: "Sign in",
      submitting: "Signing in…",
      forgot: "Forgot password?",
      noAccount: "New to Conforma?",
      createAccount: "Create an account",
    },
    signUp: {
      title: "Create your account",
      subtitle: "Start managing EU AI Act compliance in minutes.",
      submit: "Create account",
      submitting: "Creating account…",
      haveAccount: "Already have an account?",
      signInLink: "Sign in",
      terms:
        "By creating an account, you agree to our [Terms](/terms) and [Privacy Policy](/privacy).",
    },
    forgot: {
      title: "Reset your password",
      subtitle: "We'll email you a link to set a new password.",
      submit: "Send reset link",
      submitting: "Sending…",
      sent: "If an account exists for {email}, a reset link is on its way.",
      backToSignIn: "Back to sign in",
    },
    reset: {
      title: "Set a new password",
      subtitle: "Choose a strong password you don't use elsewhere.",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      submit: "Update password",
      submitting: "Updating…",
      mismatch: "Passwords do not match.",
      success: "Password updated. You're all set.",
      invalidLink: "This reset link is invalid or has expired. Request a new one.",
    },
    verify: {
      title: "Check your inbox",
      subtitle:
        "We sent a verification link to {email}. Click it to activate your account.",
      resend: "Resend email",
      resent: "Sent again — check your inbox.",
      backToSignIn: "Back to sign in",
    },
    onboarding: {
      title: "Create your organization",
      subtitle: "Your workspace — where AI systems, reports and teammates live.",
      submit: "Create organization",
      submitting: "Creating…",
      slugHint: "This becomes your workspace URL.",
    },
    errors: {
      invalidCredentials: "Wrong email or password.",
      emailInUse: "An account with this email already exists.",
      weakPassword: "Password must be at least 8 characters.",
      emailNotConfirmed: "Please verify your email before signing in.",
      rateLimited: "Too many attempts. Please wait a moment and try again.",
      generic: "Something went wrong. Please try again.",
    },
  },

  /* ----------------------------------------------------------------- billing */
  billing: {
    title: "Billing & plan",
    desc: "Your subscription, usage and payment details.",
    currentPlan: "Current plan",
    plan: { free: "Free", pro: "Pro", team: "Team" },
    usage: "AI systems",
    usageCount: "{used} of {limit}",
    unlimited: "Unlimited",
    renews: "Renews {date}",
    cancels: "Cancels {date}",
    upgradePro: "Upgrade to Pro",
    upgradeTeam: "Upgrade to Team",
    manage: "Manage billing",
    memberNote: "Only owners and admins can change billing.",
    disabled: "Billing isn't configured for this workspace.",
    pastDue: "Payment past due",
    canceled: "Subscription canceled",
  },

  /* -------------------------------------------------------------------- team */
  team: {
    title: "Team",
    subtitle: "Manage members, invitations and workspace settings.",
    usageTitle: "Usage",
    nav: "Team",
    orgName: "Workspace name",
    save: "Save",
    saved: "Saved",
    members: "Members",
    you: "You",
    remove: "Remove",
    role: "Role",
    roles: { owner: "Owner", admin: "Admin", member: "Member" },
    invite: "Invite by email",
    emailPlaceholder: "teammate@company.com",
    sendInvite: "Send invite",
    sending: "Sending…",
    inviteCreated: "Invitation created — share this link:",
    copy: "Copy",
    copied: "Copied",
    pendingInvites: "Pending invitations",
    noPendingInvites: "No pending invitations.",
    revoke: "Revoke",
    expires: "Expires {date}",
    activity: "Activity",
    noActivity: "No activity yet.",
    memberNote: "Only owners and admins can manage the team.",
    acceptTitle: "Accept your invitation",
    acceptBody: "You've been invited to join a workspace on Conforma.",
    acceptButton: "Accept invitation",
    acceptSignedOut: "Sign in or create an account with your invited email to accept.",
    actions: {
      invited: "invited a teammate",
      joined: "joined the workspace",
      removed: "removed a member",
      roleChanged: "changed a member's role",
      inviteRevoked: "revoked an invitation",
      orgRenamed: "renamed the workspace",
      apiKeyCreated: "created an API key",
      apiKeyRevoked: "revoked an API key",
      generic: "{action}",
    },
    errors: {
      forbidden: "You don't have permission for that.",
      invalidEmail: "Enter a valid email address.",
      alreadyInvited: "That email already has a pending invitation.",
      notAllowed: "That change isn't allowed.",
      invalidInvite: "This invitation is invalid, expired, or for a different email.",
      generic: "Something went wrong.",
    },
  },

  /* ---------------------------------------------------------------- apiKeys */
  apiKeys: {
    title: "API keys",
    desc: "Programmatic access to your workspace via the REST API.",
    nameLabel: "Key name",
    namePlaceholder: "Production integration",
    create: "Create key",
    creating: "Creating…",
    created: "Copy your new key now — it won't be shown again:",
    copy: "Copy",
    copied: "Copied",
    none: "No API keys yet.",
    revoke: "Revoke",
    revoked: "Revoked",
    createdOn: "Created {date}",
    lastUsed: "Last used {date}",
    neverUsed: "Never used",
  },

  /* -------------------------------------------------------------- documents */
  documents: {
    title: "Documents",
    subtitle: "Compliance documents generated for your organization.",
    nav: "Documents",
    empty: "No documents yet — generate one from a system's report.",
    view: "View",
    close: "Close",
    generated: "Generated {date}",
  },
};

export default en;
