/**
 * French (Français) — native translation catalog.
 *
 * Structurally identical to `en.ts`: same keys, nesting, order and array
 * lengths. Only string values are translated. Regulatory identifiers
 * ("Art. 5", "Annex III", "Regulation (EU) 2024/1689") are intentionally
 * NOT translated.
 */
import type { Messages } from "./index";
import { plural } from "./_types";

const fr: Messages = {
  /* ------------------------------------------------------------------ common */
  common: {
    brand: "Conforma",
    euAiAct: "EU AI Act",
    regulation: "Regulation (EU) 2024/1689",
    startFree: "Commencer gratuitement",
    bookDemo: "Réserver une démo",
    talkToSales: "Parler à un commercial",
    back: "Retour",
    continue: "Continuer",
    optional: "(facultatif)",
    yes: "Oui",
    no: "Non",
    thinking: "Analyse en cours…",
    loading: "Chargement…",
    dash: "—",
    daysLeft: plural({
      one: "{count} jour restant",
      other: "{count} jours restants",
    }),
    deadlinePassed: "échéance dépassée",
    cancel: "Annuler",
    delete: "Supprimer",
    notLegalAdvice:
      "Outil d’aide à la décision pour le Regulation (EU) 2024/1689 — ne constitue pas un avis juridique. Confirmez les classifications auprès d’un conseil qualifié.",
  },

  /* ------------------------------------------------------------ languageSwitcher */
  languageSwitcher: {
    label: "Langue",
    change: "Changer de langue",
    selected: "Langue sélectionnée : {language}",
  },

  /* -------------------------------------------------------------- themeToggle */
  themeToggle: {
    label: "Changer de thème",
    toLight: "Passer en mode clair",
    toDark: "Passer en mode sombre",
  },

  /* --------------------------------------------------------------------- nav */
  nav: {
    howItWorks: "Comment ça marche",
    security: "Sécurité",
    pricing: "Tarifs",
    dashboard: "Tableau de bord",
    bookDemo: "Réserver une démo",
    startFree: "Commencer gratuitement",
    menu: "Menu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    skipToContent: "Aller au contenu",
  },

  /* ------------------------------------------------------------------ footer */
  footer: {
    tagline:
      "La plateforme de conformité au EU AI Act. Classez vos systèmes, comblez les écarts et prouvez votre conformité — sans équipe dédiée.",
    columns: {
      product: {
        title: "Produit",
        riskClassifier: "Classificateur de risque",
        aiRegistry: "Registre IA",
        pricing: "Tarifs",
        bookDemo: "Réserver une démo",
      },
      trust: {
        title: "Confiance",
        security: "Sécurité",
        dataResidency: "Résidence des données",
        subprocessors: "Sous-traitants ultérieurs",
      },
      company: {
        title: "Entreprise",
        howItWorks: "Comment ça marche",
        faq: "FAQ",
        contactSales: "Contacter l’équipe commerciale",
      },
      legal: {
        title: "Juridique",
        terms: "Conditions d’utilisation",
        privacy: "Politique de confidentialité",
        dataProcessing: "Traitement des données",
      },
    },
    rights: "© {year} Conforma. Tous droits réservés.",
    disclaimer:
      "Outil d’aide à la décision pour le Regulation (EU) 2024/1689 — ne constitue pas un avis juridique. Confirmez les classifications auprès d’un conseil qualifié.",
  },

  /* ------------------------------------------------------------ announcement */
  announcement: {
    prefix: "Les obligations relatives au risque élevé s’appliquent",
    cta: "Évaluez votre exposition",
    dismiss: "Fermer",
  },

  /* -------------------------------------------------------------------- home */
  home: {
    hero: {
      badge: "Les obligations relatives au risque élevé s’appliquent",
      titleLine1: "La conformité au EU AI Act,",
      titleAccent: "en pilote automatique",
      subtitle:
        "Conforma recense vos systèmes d’IA, classe automatiquement leur risque avec des références aux articles précis, comble chaque écart d’obligation et génère la documentation attendue par les régulateurs — sans recruter d’équipe de conformité.",
      fineprint:
        "Sans carte bancaire · classification en 30 secondes · prêt pour l’audit en quelques minutes",
      trustEyebrow: "Aligné sur les référentiels attendus par vos auditeurs",
    },
    showcase: {
      url: "app.conforma.eu/dashboard",
      registryTitle: "Registre des systèmes d’IA",
      registrySub: "3 systèmes · 1 à risque élevé",
      classify: "Classer",
      stats: {
        systems: "Systèmes",
        compliance: "Conformité",
        nearest: "Échéance",
      },
      table: {
        system: "Système",
        risk: "Risque",
        owner: "Responsable",
        compliance: "Conformité",
      },
      owners: {
        peopleOps: "Ressources humaines",
        support: "Support",
        supplyChain: "Chaîne d’approvisionnement",
      },
    },
    stats: {
      fine: { value: "35 M€", label: "amende maximale pour une IA interdite", sub: "ou 7 % du chiffre d’affaires" },
      areas: { value: "8", label: "domaines d’usage à risque élevé", sub: "Annex III" },
      deadline: { value: "août 2026", label: "l’échéance que la plupart doivent respecter", sub: "Art. 113" },
      states: { value: "27", label: "États membres de l’UE", sub: "un seul règlement" },
    },
    interactiveDemo: {
      eyebrow: "Démo interactive",
      title: "Classez un système dès maintenant",
      subtitle:
        "Sans inscription. Choisissez un système ci-dessous et observez le moteur déterministe fixer son niveau de risque, citer les articles et dénombrer les obligations — en direct.",
    },
    problem: {
      eyebrow: "Le problème",
      title: "Toutes les entreprises déploient désormais de l’IA. Presque aucune ne peut prouver sa conformité.",
      p1: "Le EU AI Act est la première législation complète au monde sur l’IA, et il s’applique à toute organisation dont l’IA touche le marché de l’UE — où qu’elle soit établie. Pourtant, se mettre en conformité suppose aujourd’hui un avocat, un tableur et des semaines de recoupements dans un règlement de 100 pages.",
      p2: "Conforma transforme tout cela en un parcours guidé : répondez à quelques questions par système, obtenez une classification défendable et repartez avec les preuves et les documents dont vous avez besoin.",
      code: {
        comment: "# classer un système",
        result: "→ RISQUE ÉLEVÉ",
        obligations: "11 obligations du fournisseur · Art. 9–49",
        deadlineLabel: "échéance :",
        drafted: "✓ documentation rédigée",
      },
    },
    personas: {
      title: "Une source unique de vérité pour tous ceux qui sont concernés",
      subtitle:
        "Le EU AI Act ne relève pas d’une seule équipe. Conforma offre à chaque partie prenante le même dossier défendable.",
      items: {
        legal: {
          role: "Juridique & Conformité",
          desc: "Des classifications défendables et sourcées, ainsi qu’une piste d’audit — sans devoir analyser manuellement le règlement.",
        },
        product: {
          role: "Équipes IA & Produit",
          desc: "Sachez ce que chaque modèle exige avant son lancement, pour que la conformité cesse de bloquer la feuille de route.",
        },
        security: {
          role: "Responsables Sécurité & IT",
          desc: "Un registre unique de chaque système d’IA de l’organisation, son niveau de risque et ses preuves.",
        },
      },
    },
    tiers: {
      title: "Quatre niveaux de risque. Une réponse claire.",
      subtitle:
        "Le règlement classe chaque système d’IA dans un niveau de risque — et ce niveau détermine vos obligations. Conforma fixe le vôtre, avec la référence à l’appui.",
    },
    how: {
      title: "De l’inconnu à la conformité prête pour l’audit en quatre étapes",
      steps: {
        register: {
          title: "Recenser",
          desc: "Ajoutez chaque système d’IA à votre registre — développé, acheté ou intégré à un produit.",
        },
        classify: {
          title: "Classer",
          desc: "Un questionnaire guidé associe le système à un niveau de risque avec les articles cités. Sans avocat.",
        },
        closeGaps: {
          title: "Combler les écarts",
          desc: "Traitez les obligations précises de ce niveau sous forme de liste de contrôle suivie, avec responsables et statut.",
        },
        generate: {
          title: "Générer les documents",
          desc: "Rédigez la documentation technique, les notices de transparence et la déclaration de conformité en un clic.",
        },
      },
    },
    timeline: {
      eyebrow: "Le compte à rebours est lancé",
      title: "Le calendrier d’application du EU AI Act",
      subtitle:
        "Les obligations entrent en vigueur par phases au titre de l’Art. 113. Conforma suit chaque jalon pour que rien ne passe entre les mailles.",
      inForce: "En vigueur",
    },
    features: {
      title: "Tout ce qu’il faut pour prouver votre conformité",
      subtitle:
        "Une boîte à outils complète — de la classification sourcée aux documents prêts pour l’audit.",
      items: {
        cited: {
          title: "Sourcé, pas approximatif",
          desc: "Chaque classification et obligation renvoie à l’article ou à l’annexe précis du Regulation (EU) 2024/1689 — défendable lors d’un audit.",
        },
        annexIII: {
          title: "Couverture de l’Annexe III",
          desc: "L’ensemble des {count} domaines à risque élevé encodés — de l’emploi et la notation de crédit à la biométrie et aux activités répressives.",
        },
        drafted: {
          title: "Documents rédigés par l’IA",
          desc: "Claude rédige le dossier technique de l’Annexe IV, les notices de transparence de l’Art. 50 et la déclaration de conformité de l’UE, adaptés à chaque système.",
        },
        deadlines: {
          title: "Suivi des échéances",
          desc: "Des comptes à rebours en direct vers chaque date d’application échelonnée, pour ne rien laisser passer après le 2 août 2026 ou 2027.",
        },
        roles: {
          title: "Fournisseur & déployeur",
          desc: "Des obligations réparties selon votre rôle — que vous développiez le système ou que vous déployiez simplement celui d’un tiers.",
        },
        gpai: {
          title: "Prise en compte des GPAI",
          desc: "Signale les obligations des fournisseurs de modèles d’IA à usage général (Art. 53+) en plus du niveau de risque du système.",
        },
      },
    },
    comparison: {
      title: "Une fraction du coût des autres solutions",
      conforma: "Conforma",
      lawFirm: "Cabinet d’avocats",
      spreadsheet: "Tableur",
      rows: {
        cited: "Classification du risque sourcée",
        continuous: "En continu, pas ponctuelle",
        drafted: "Documentation rédigée par l’IA",
        registry: "Registre de l’ensemble du portefeuille",
        cost: "Coût",
      },
      values: {
        manual: "manuel",
        conformaCost: "149 €/mois",
        lawFirmCost: "10 k€+/audit",
        spreadsheetCost: "0 € + risque",
      },
    },
    testimonials: {
      title: "Conçu pour les équipes en première ligne",
      note: "Représentatif des clients cibles pendant l’accès anticipé.",
      items: {
        one: {
          quote:
            "Nous sommes passés d’un tableur de 40 onglets à un registre unique en lequel nos auditeurs ont réellement confiance. Ce sont les classifications sourcées qui ont convaincu notre directeur juridique.",
          name: "Responsable de la conformité",
          company: "SaaS B2B · 200 collaborateurs",
        },
        two: {
          quote:
            "Notre équipe produit peut enfin obtenir une lecture du risque en autonomie avant le lancement, au lieu d’attendre deux semaines le service juridique. Cela a suffi à rentabiliser l’outil.",
          name: "VP Produit",
          company: "Scale-up de la fintech",
        },
        three: {
          quote:
            "Le projet de dossier Annexe IV généré a fait gagner des journées de travail à notre conseil externe. Nous considérons Conforma comme le système de référence de notre gouvernance de l’IA.",
          name: "DPO",
          company: "Plateforme de santé",
        },
      },
    },
    penalty: {
      title: "Le coût d’une erreur",
      subtitle:
        "Les sanctions prévues à l’Art. 99 correspondent au montant le plus élevé entre un plafond fixe et une part du chiffre d’affaires annuel mondial.",
      orTurnover: "ou {pct} % du chiffre d’affaires",
      labels: {
        prohibited: "Usage interdit",
        highRisk: "Manquement à risque élevé",
        misleadingInfo: "Informations trompeuses",
      },
    },
    security: {
      eyebrow: "Prêt pour l’entreprise",
      title: "Sécurité et gouvernance intégrées",
      body: "Résidence des données dans l’UE, chiffrement en transit et au repos, SSO/SAML, accès basé sur les rôles, journaux d’audit et un DPA sur mesure. Votre outil de conformité doit lui aussi être conforme.",
      cta: "En savoir plus sur notre sécurité",
      badges: {
        residency: "Résidence des données dans l’UE",
        encryption: "Chiffrement au repos et en transit",
        sso: "SSO / SAML",
        rbac: "Accès basé sur les rôles",
        audit: "Journalisation d’audit",
        dpa: "DPA sur mesure",
      },
    },
    pricing: {
      title: "Une tarification plus avantageuse qu’un forfait de conformité",
      subtitle:
        "Un seul audit à risque élevé réalisé par un cabinet d’avocats coûte plus qu’une année de Conforma. Commencez gratuitement, montez en gamme à mesure que vous grandissez.",
    },
    faq: {
      title: "Questions fréquentes",
      items: {
        scope: {
          q: "Le EU AI Act s’applique-t-il à nous si nous ne sommes pas dans l’UE ?",
          a: "Si votre système d’IA est mis sur le marché ou si son résultat est utilisé dans l’UE, le règlement s’applique quel que soit le lieu d’établissement de votre entreprise — à l’image du GDPR. Conforma aide toute équipe internationale à cerner son exposition.",
        },
        advice: {
          q: "Conforma constitue-t-il un avis juridique ?",
          a: "Non. Conforma est un outil d’aide à la décision qui traduit le règlement en un parcours structuré et sourcé. Il réduit considérablement le travail, mais il vous appartient de confirmer les classifications auprès d’un conseil qualifié.",
        },
        deadline: {
          q: "Qu’est-ce que l’échéance d’août 2026 ?",
          a: "Au titre de l’Art. 113, les obligations principales applicables aux systèmes à risque élevé (Annex III) et les obligations de transparence de l’Art. 50 deviennent applicables le 2 août 2026 — l’échéance vers laquelle la plupart des organisations se précipitent.",
        },
        accuracy: {
          q: "Quelle est la fiabilité de la classification ?",
          a: "La classification repose sur un arbre de décision déterministe directement aligné sur le texte du règlement, de sorte que chaque résultat est traçable jusqu’à des articles précis. L’IA sert uniquement à rédiger la documentation et les explications, jamais à passer outre la logique citée.",
        },
        data: {
          q: "Où nos données sont-elles stockées ?",
          a: "Les offres Enterprise s’exécutent avec une résidence des données dans l’UE et un chiffrement en transit et au repos. Consultez notre page Sécurité pour le détail complet, notamment le SSO, les journaux d’audit et notre DPA.",
        },
      },
    },
    finalCta: {
      title: "Découvrez où vous en êtes en 30 secondes",
      subtitle:
        "Sans compte ni carte bancaire. Classez votre premier système d’IA et voyez exactement ce que le EU AI Act exige de lui.",
    },
  },

  /* ----------------------------------------------------------------- pricing */
  pricing: {
    hero: {
      title: "Une tarification plus avantageuse qu’un forfait de conformité",
      subtitle:
        "Un seul audit à risque élevé réalisé par un cabinet d’avocats coûte plus qu’une année de Conforma. Commencez gratuitement — sans carte bancaire.",
    },
    comparePlans: "Comparer les offres",
    table: {
      feature: "Fonctionnalité",
      starter: "Starter",
      team: "Team",
      business: "Business",
      enterprise: "Enterprise",
      rows: {
        systems: "Systèmes d’IA",
        classification: "Classification du risque",
        checklists: "Listes de contrôle des obligations",
        drafted: "Documents rédigés par l’IA",
        exports: "Exports prêts pour l’audit",
        users: "Utilisateurs & rôles",
        auditLog: "Journal d’audit",
        api: "Accès API",
        sso: "SSO / SAML",
        residency: "Résidence des données dans l’UE",
        dpa: "DPA sur mesure",
        successManager: "Responsable de la réussite client dédié",
      },
      unlimited: "Illimité",
    },
    custom: {
      text: "Besoin d’une solution sur mesure ?",
      cta: "Parler à un commercial",
    },
  },

  /* ------------------------------------------------------------- pricingTable */
  pricingTable: {
    monthly: "Mensuel",
    annual: "Annuel",
    save: "Économisez 20 %",
    mostPopular: "Le plus populaire",
    perMonth: "/mois",
    billedAnnually: "facturé annuellement",
    billedMonthly: "facturé mensuellement",
    freeForever: "gratuit à vie",
    tiers: {
      starter: {
        name: "Starter",
        tagline: "Cartographiez votre premier système",
        cta: "Commencer gratuitement",
        features: {
          oneSystem: "1 système d’IA",
          classification: "Classification du risque avec articles cités",
          checklist: "Liste de contrôle des obligations",
          deadlines: "Suivi des échéances",
        },
      },
      team: {
        name: "Team",
        tagline: "Pour les équipes qui déploient de l’IA",
        cta: "Démarrer l’essai de 14 jours",
        features: {
          systems: "Jusqu’à 25 systèmes d’IA",
          drafted: "Documentation rédigée par l’IA",
          annexIV: "Dossiers techniques Annexe IV",
          exports: "Exports prêts pour l’audit",
          email: "Assistance par e-mail",
        },
      },
      business: {
        name: "Business",
        tagline: "Pour les portefeuilles d’IA en pleine croissance",
        cta: "Démarrer l’essai de 14 jours",
        features: {
          systems: "Jusqu’à 100 systèmes d’IA",
          users: "Plusieurs utilisateurs & rôles",
          auditLog: "Journal d’audit & historique des modifications",
          api: "Accès API",
          priority: "Assistance prioritaire",
        },
      },
    },
    enterprise: {
      name: "Enterprise",
      badge: "SSO · RBAC · DPA",
      desc: "Systèmes illimités, SSO/SAML, accès basé sur les rôles, résidence des données dans l’UE, journaux d’audit, DPA sur mesure et un responsable de la réussite conformité dédié.",
      cta: "Parler à un commercial",
    },
  },

  /* ---------------------------------------------------------------- security */
  security: {
    eyebrow: "Sécurité & Confiance",
    title: "Votre outil de conformité doit lui aussi être conforme",
    subtitle:
      "Conforma détient la cartographie la plus sensible de votre parc d’IA. Nous la protégeons par des contrôles de niveau entreprise et une transparence totale sur la manière dont vos données sont traitées.",
    badges: {
      gdpr: "Aligné sur le GDPR",
      iso: "Aligné sur ISO/IEC 42001",
      nist: "NIST AI RMF",
      dpa: "DPA sur mesure",
    },
    principles: {
      encryption: {
        title: "Chiffrement partout",
        desc: "Toutes les données sont chiffrées en transit avec TLS 1.2+ et au repos avec AES-256. Les secrets sont gérés dans un service de gestion des clés dédié.",
      },
      residency: {
        title: "Résidence des données dans l’UE",
        desc: "Les données Enterprise sont stockées et traitées dans des régions de l’UE, de sorte que votre dossier de conformité ne quitte jamais la juridiction qu’il couvre.",
      },
      leastPrivilege: {
        title: "Accès au moindre privilège",
        desc: "Le contrôle d’accès basé sur les rôles, le SSO/SAML et la MFA imposée garantissent que chacun ne voit que ce que son rôle exige — et vous pouvez le prouver.",
      },
      audit: {
        title: "Piste d’audit complète",
        desc: "Chaque modification d’une classification, d’une obligation ou d’un document est journalisée avec son auteur et son horodatage — votre preuve en cas d’audit.",
      },
      isolation: {
        title: "Cloisonnement des clients",
        desc: "Les données client sont logiquement isolées par organisation, avec des frontières d’accès strictes appliquées au niveau de l’application et des données.",
      },
      resilient: {
        title: "Résilient par conception",
        desc: "Des sauvegardes automatisées, une infrastructure supervisée et un processus de reprise testé maintiennent votre registre disponible et intègre.",
      },
    },
    privacy: {
      title: "Protection des données & vie privée",
      body: "Vous êtes propriétaire de vos données. Nous les traitons uniquement pour fournir le service, jamais pour entraîner des modèles tiers, et nous les rendons exportables à tout moment. Les clients Enterprise reçoivent un accord de traitement des données (DPA) sur mesure couvrant les rôles, les sous-traitants ultérieurs et les engagements de sécurité au titre du GDPR.",
      cards: {
        residency: { title: "Résidence des données", value: "Régions de l’UE (Enterprise)" },
        retention: { title: "Conservation", value: "Sous votre contrôle ; supprimées sur demande" },
        portability: { title: "Portabilité", value: "Export complet, à tout moment" },
      },
    },
    subprocessors: {
      title: "Sous-traitants ultérieurs",
      intro:
        "Nous faisons appel à un ensemble restreint et vérifié de sous-traitants ultérieurs pour fournir le service. Chacun est lié par des clauses de protection des données conformes à nos engagements envers vous.",
      table: { category: "Catégorie", purpose: "Finalité", region: "Région" },
      rows: {
        hosting: {
          category: "Hébergement cloud",
          purpose: "Hébergement de l’application et de la base de données en région UE",
          region: "UE",
        },
        ai: {
          category: "Rédaction de documents par IA",
          purpose: "Génère des projets de documents de conformité à la demande",
          region: "UE / États-Unis",
        },
        monitoring: {
          category: "Surveillance des erreurs",
          purpose: "Télémétrie applicative agrégée et anonymisée",
          region: "UE",
        },
        email: {
          category: "Distribution d’e-mails",
          purpose: "E-mails transactionnels et de notification",
          region: "UE",
        },
      },
      note: "Liste représentative pour le stade actuel du produit ; la liste contraignante est tenue à jour dans votre DPA.",
    },
    disclosure: {
      title: "Divulgation responsable",
      bodyBefore: "Vous avez trouvé une vulnérabilité ? Nous voulons en être informés. Signalez-la à ",
      email: "security@conforma.eu",
      bodyAfter: " et nous accuserons réception sous un jour ouvré.",
      cta: "Demander notre dossier de sécurité",
    },
  },

  /* -------------------------------------------------------------------- demo */
  demo: {
    eyebrow: "Réserver une démo",
    title: "Évaluez votre exposition au EU AI Act en 30 minutes",
    subtitle:
      "Un spécialiste de la conformité accompagnera votre équipe pour classer vos systèmes d’IA, combler les écarts d’obligations et générer la documentation attendue par vos auditeurs.",
    bullets: {
      riskRead: {
        title: "Une lecture du risque en direct",
        desc: "Nous classons l’un de vos systèmes réels pendant l’appel, avec les articles cités.",
      },
      gaps: {
        title: "Vos écarts d’obligations",
        desc: "Voyez précisément ce qu’il reste à faire et l’échéance applicable.",
      },
      rollout: {
        title: "Déploiement en entreprise",
        desc: "SSO, rôles, résidence des données dans l’UE et adoption de Conforma par les équipes.",
      },
    },
  },

  /* ---------------------------------------------------------------- demoForm */
  demoForm: {
    fullName: "Nom complet",
    workEmail: "E-mail professionnel",
    company: "Entreprise",
    role: "Votre fonction",
    systemsInScope: "Systèmes d’IA concernés",
    anythingElse: "Quelque chose à nous signaler ?",
    placeholders: {
      name: "Jeanne Dupont",
      email: "jeanne@entreprise.com",
      company: "Entreprise SARL",
      message: "Votre calendrier, les systèmes qui vous préoccupent, etc.",
    },
    roles: {
      compliance: "Conformité / Juridique",
      product: "IA / Produit",
      security: "Sécurité / IT",
      executive: "Direction",
      other: "Autre",
    },
    submit: "Demander une démo",
    consent:
      "Nous ne partagerons jamais vos coordonnées. En soumettant ce formulaire, vous acceptez d’être contacté au sujet de Conforma.",
    success: {
      title: "Merci {name} !",
      nameFallback: "à vous",
      body: "Un membre de notre équipe contactera {email} sous un jour ouvré pour planifier votre démonstration.",
      emailFallback: "votre e-mail",
      impatient: "Vous ne pouvez pas attendre ? Vous pouvez ",
      impatientLink: "classer un système dès maintenant",
    },
  },

  /* ------------------------------------------------------------------- legal */
  terms: {
    eyebrow: "Juridique",
    title: "Conditions d’utilisation",
    effective: "En vigueur le {date}",
    effectiveDate: "2026-06-24",
    sections: {
      agreement: {
        title: "1. Accord",
        body: "Les présentes conditions régissent votre accès à Conforma (le « Service ») et l’utilisation que vous en faites. En utilisant le Service, vous acceptez les présentes conditions. Si vous utilisez le Service pour le compte d’une organisation, vous déclarez être autorisé à l’engager.",
      },
      service: {
        title: "2. Le Service",
        body: "Conforma fournit un logiciel destiné à aider les organisations à évaluer et documenter leur conformité au EU AI Act. Nous pouvons mettre à jour, améliorer ou modifier des fonctionnalités au fil du temps.",
      },
      notAdvice: {
        title: "3. Ne constitue pas un avis juridique",
        body: "Conforma est un outil d’aide à la décision. Ses classifications, listes de contrôle et documents générés sont fournis à titre informatif et ne constituent **pas** un avis juridique. Vous demeurez responsable de votre conformité et devez confirmer les classifications auprès d’un conseil qualifié.",
      },
      accounts: {
        title: "4. Comptes & utilisation acceptable",
        body: "Vous êtes responsable de la protection de votre compte et de l’activité qui s’y déroule. Vous vous engagez à ne pas détourner le Service, à ne pas tenter de le perturber, ni à l’utiliser pour enfreindre une loi ou porter atteinte aux droits d’un tiers.",
      },
      content: {
        title: "5. Vos contenus",
        body: "Vous conservez l’ensemble des droits sur les données que vous soumettez. Vous nous accordez une licence limitée pour les traiter uniquement aux fins de fourniture du Service, comme décrit dans notre [Politique de confidentialité](/privacy).",
      },
      ip: {
        title: "6. Propriété intellectuelle",
        body: "Le Service, y compris son logiciel, sa conception et son contenu (à l’exclusion de vos données), appartient à Conforma et est protégé par la loi applicable. Les présentes conditions ne vous confèrent aucun droit sur nos marques ou notre identité visuelle.",
      },
      disclaimers: {
        title: "7. Exclusions de garantie",
        body: "Le Service est fourni « en l’état », sans garantie d’aucune sorte, dans toute la mesure permise par la loi. Nous ne garantissons pas que le Service sera ininterrompu ou exempt d’erreurs, ni que ses résultats seront complets ou juridiquement suffisants au regard de votre situation particulière.",
      },
      liability: {
        title: "8. Limitation de responsabilité",
        body: "Dans toute la mesure permise par la loi, Conforma ne saurait être tenue responsable de tout dommage indirect, accessoire ou consécutif, ni d’aucune sanction réglementaire découlant de votre utilisation du Service.",
      },
      law: {
        title: "9. Droit applicable",
        body: "Les présentes conditions sont régies par le droit irlandais, sans égard aux principes de conflit de lois, et les tribunaux irlandais ont compétence exclusive, sauf disposition contraire impérative de votre droit local de la consommation.",
      },
      changes: {
        title: "10. Modifications & contact",
        body: "Nous pouvons mettre à jour ces conditions ; toute modification substantielle sera notifiée à l’avance. Des questions ? Écrivez à [legal@conforma.eu](mailto:legal@conforma.eu).",
      },
    },
  },

  privacy: {
    eyebrow: "Juridique",
    title: "Politique de confidentialité",
    effective: "En vigueur le {date}",
    effectiveDate: "2026-06-24",
    sections: {
      overview: {
        title: "Aperçu",
        body: "Conforma (« nous ») fournit un logiciel qui aide les organisations à évaluer et documenter leur conformité au EU AI Act (Regulation (EU) 2024/1689). La présente politique explique quelles données personnelles nous traitons et les choix qui s’offrent à vous. Nous nous engageons à traiter les données personnelles de manière licite, conformément au Règlement général sur la protection des données (GDPR).",
      },
      dataWeProcess: {
        title: "Données que nous traitons",
        body: "- **Données de compte & de contact** — nom, e-mail professionnel, entreprise et fonction, lorsque vous créez un compte ou demandez une démo.\n- **Données produit** — les fiches de systèmes d’IA, classifications et documents que vous créez dans Conforma. Il s’agit de vos contenus ; nous ne les traitons que pour fournir le service.\n- **Données d’usage & techniques** — télémétrie agrégée et anonymisée (par exemple, les événements d’erreur) utilisée pour assurer la fiabilité du service.",
      },
      howWeUse: {
        title: "Comment nous utilisons les données",
        body: "Nous traitons les données personnelles pour fournir et sécuriser le service, répondre aux demandes et respecter nos obligations légales. Nous ne vendons **pas** de données personnelles et nous n’utilisons pas vos contenus produit pour entraîner des modèles d’IA tiers.",
      },
      legalBases: {
        title: "Bases légales",
        body: "Selon le contexte, nous nous appuyons sur l’exécution d’un contrat (la fourniture du service), nos intérêts légitimes (sécuriser et améliorer le service), votre consentement (par exemple, le marketing) et le respect d’obligations légales.",
      },
      residency: {
        title: "Résidence & conservation des données",
        body: "Les données des clients Enterprise sont hébergées dans des régions de l’UE. Nous ne conservons les données personnelles que le temps nécessaire à la fourniture du service ou tel que requis par la loi, et nous les supprimons ou les anonymisons sur demande. Consultez notre [page Sécurité](/security) pour les détails techniques.",
      },
      subprocessors: {
        title: "Sous-traitants ultérieurs",
        body: "Nous faisons appel à un ensemble restreint et vérifié de sous-traitants ultérieurs liés par des clauses de protection des données conformes à la présente politique. La liste à jour est publiée sur notre [page Sécurité](/security#subprocessors).",
      },
      rights: {
        title: "Vos droits",
        body: "Au titre du GDPR, vous disposez du droit d’accéder à vos données personnelles, de les rectifier, de les effacer, d’en limiter le traitement et de les recevoir dans un format portable, ainsi que de vous opposer à certains traitements. Pour exercer l’un de ces droits, contactez-nous à [privacy@conforma.eu](mailto:privacy@conforma.eu). Vous avez également le droit d’introduire une réclamation auprès de votre autorité de contrôle locale.",
      },
      contact: {
        title: "Contact",
        body: "Des questions sur cette politique ou vos données ? Écrivez à [privacy@conforma.eu](mailto:privacy@conforma.eu).",
      },
    },
    footnote:
      "Cette page est fournie à des fins de transparence sur la manière dont le produit traite les données et ne constitue pas un avis juridique.",
  },

  /* ---------------------------------------------------------------- notFound */
  notFound: {
    code: "404",
    title: "Page introuvable",
    body: "La page que vous recherchez n’existe pas ou a été déplacée.",
    backHome: "Retour à l’accueil",
    classify: "Classer un système",
  },

  /* ---------------------------------------------------------------- appShell */
  app: {
    nav: {
      overview: "Vue d’ensemble",
      classify: "Classer",
      reports: "Rapports",
    },
    workspace: "Espace de travail",
    account: "Compte",
    settings: "Paramètres",
    helpDocs: "Aide & documentation",
    helpAria: "Aide et documentation",
    notifications: "Notifications",
    accountSettings: "Paramètres du compte",
    complianceClock: "Compte à rebours de conformité",
    untilHighRisk: "avant l’application des obligations à risque élevé —",
    highRiskDate: "2 août 2026",
    accountName: "Mohammad E.",
    accountPlan: "Acme AI · Pro",
    breadcrumb: {
      assessment: "Évaluation",
      classifyTitle: "Classer un système",
      reporting: "Rapports",
      reportTitle: "Rapport de préparation",
      registry: "Registre",
      systemDetail: "Détail du système",
      workspace: "Espace de travail",
      overview: "Vue d’ensemble",
    },
  },

  /* ---------------------------------------------------------------- settings */
  settings: {
    title: "Paramètres",
    subtitle: "Gérez l'apparence et le comportement de Conforma sur cet appareil.",
    appearance: {
      title: "Apparence",
      desc: "Choisissez le thème de l'interface. Votre préférence est enregistrée sur cet appareil.",
      theme: "Thème",
      light: "Clair",
      dark: "Sombre",
    },
    language: {
      title: "Langue",
      desc: "Langue de l'interface et sens de lecture. Les changements s'appliquent instantanément.",
      label: "Langue de l'interface",
    },
    data: {
      title: "Données du registre",
      desc: "Votre registre de systèmes d'IA n'existe que dans ce navigateur — rien n'est envoyé à un serveur. Réinitialisez-le aux exemples fournis ou videz-le entièrement.",
      count: plural({
        one: "{count} système dans ce navigateur",
        other: "{count} systèmes dans ce navigateur",
      }),
      reset: "Réinitialiser aux données de démo",
      clear: "Supprimer tous les systèmes",
      resetDone: "Registre réinitialisé aux systèmes de démonstration.",
      clearDone: "Registre vidé.",
      confirmResetTitle: "Réinitialiser aux données de démo ?",
      confirmResetBody:
        "Cela remplace le registre actuel par les dix systèmes d'exemple. Les entrées ajoutées dans ce navigateur seront perdues.",
      confirmClearTitle: "Supprimer tous les systèmes ?",
      confirmClearBody:
        "Cela supprime définitivement tous les systèmes du registre de ce navigateur. Cette action est irréversible.",
    },
    about: {
      title: "À propos",
      desc: "Un espace de conformité au règlement IA de l'UE, de qualité portfolio.",
      version: "Version",
      mode: "Génération de documents",
      docs: "Documentation",
      source: "Code source",
    },
  },

  /* ------------------------------------------------------------------ alerts */
  alerts: {
    title: "Alertes",
    subtitle: "Signaux issus de votre registre",
    empty: "Tout est à jour — aucun signal de conformité en attente.",
    viewAll: "Aller au tableau de bord",
    prohibitedTitle: plural({
      one: "{count} système à pratique interdite",
      other: "{count} systèmes à pratique interdite",
    }),
    prohibitedBody: "Interdits par l'article 5 — cessez immédiatement leur usage.",
    attentionTitle: plural({
      one: "{count} système à haut risque sous l'objectif",
      other: "{count} systèmes à haut risque sous l'objectif",
    }),
    attentionBody: "Moins de la moitié de leurs obligations sont satisfaites.",
    deadlineTitle: "Échéance des obligations à haut risque",
    deadlineBody: "Les obligations du chapitre III s'appliquent le {date} (art. 113).",
  },

  /* ------------------------------------------------------------------- error */
  error: {
    title: "Une erreur est survenue",
    body: "Une erreur inattendue a interrompu cette page. Vos systèmes enregistrés sont en sécurité — rien n'a été perdu.",
    retry: "Réessayer",
    home: "Retour à l'accueil",
    reference: "Référence de l'erreur",
  },

  /* ------------------------------------------------------------------- toast */
  toast: {
    region: "Notifications",
    dismiss: "Fermer",
    saved: "Système enregistré dans votre registre.",
    deleted: "Système supprimé.",
    copied: "Copié dans le presse-papiers.",
    copyFailed: "Impossible de copier — sélectionnez et copiez manuellement.",
    exportBlocked: "Fenêtre bloquée. Autorisez les fenêtres contextuelles pour exporter le document.",
  },

  /* ------------------------------------------------------------ commandPalette */
  commandPalette: {
    aria: "Palette de commandes",
    trigger: "Rechercher",
    placeholder: "Rechercher commandes et systèmes…",
    empty: "Aucun résultat.",
    groups: { navigate: "Naviguer", actions: "Actions", systems: "Systèmes" },
    actions: {
      newClassification: "Nouvelle classification",
      resetDemo: "Réinitialiser les données de démo",
      toggleTheme: "Changer de thème",
      openDocs: "Ouvrir la documentation",
    },
  },

  /* ---------------------------------------------------------------- classify */
  classify: {
    steps: {
      basics: "Bases",
      definition: "Définition",
      prohibited: "Interdit",
      highRisk: "Risque élevé",
      transparency: "Transparence",
    },
    step0: {
      title: "Parlez-nous du système",
      sub: "Les bases. Vous pouvez enregistrer des systèmes que vous développez (fournisseur) ou des systèmes que vous utilisez (déployeur).",
      nameLabel: "Nom du système",
      namePlaceholder: "p. ex. modèle de présélection de CV",
      descLabel: "Que fait-il ?",
      descPlaceholder: "Brève description de sa finalité prévue.",
      roleLabel: "Votre rôle",
      roleProvider: "Fournisseur (nous le développons)",
      roleDeployer: "Déployeur (nous l’utilisons)",
      roleBoth: "Les deux",
      ownerLabel: "Responsable / équipe",
      ownerPlaceholder: "p. ex. Ressources humaines",
    },
    step1: {
      title: "Est-ce un système d’IA ?",
      sub: "Le règlement s’applique aux systèmes qui infèrent des résultats à partir d’entrées avec une certaine autonomie (Art. 3(1)).",
      isAi: "Cela répond à la définition d’un système d’IA",
      isGpai: "Il repose sur un modèle d’IA à usage général (p. ex. un LLM)",
      isGpaiHint: "Déclenche des obligations supplémentaires pour les fournisseurs de GPAI (Art. 53+).",
    },
    step2: {
      title: "Fait-il l’une de ces choses ?",
      sub: "Ces pratiques sont purement et simplement interdites au titre de l’Art. 5. Sélectionnez toutes celles qui s’appliquent — ou aucune.",
    },
    step3: {
      title: "Cas d’usage à risque élevé",
      sub: "Les systèmes à risque élevé supportent tout le poids du règlement. Sélectionnez ceux qui correspondent à la finalité prévue du système.",
      annexI: "C’est un composant de sécurité d’un produit couvert par la législation d’harmonisation de l’UE (Annex I)",
      annexIHint: "p. ex. machines, dispositifs médicaux, véhicules.",
      annexIIIHeading: "Domaines de l’Annexe III",
      derogation:
        "Il n’accomplit qu’une tâche procédurale restreinte et n’influence pas matériellement les décisions",
      derogationHint:
        "La dérogation de l’Art. 6(3) — peut le faire sortir du risque élevé, mais vous devez documenter l’évaluation.",
    },
    step4: {
      title: "Déclencheurs de transparence",
      sub: "Même en dehors du risque élevé, certains usages comportent des obligations d’information au titre de l’Art. 50.",
      interacts: "Interagit directement avec des personnes (p. ex. un agent conversationnel)",
      synthetic: "Génère du contenu audio, image, vidéo ou texte de synthèse",
      deepfake: "Produit des hypertrucages (deepfakes)",
      emotion: "Reconnaissance des émotions ou catégorisation biométrique",
    },
    nav: {
      back: "Retour",
      continue: "Continuer",
      seeClassification: "Voir la classification",
    },
    provisional: "Niveau provisoire :",
    result: {
      untitled: "Système sans nom",
      plusGpai: "+ obligations GPAI",
      whyTier: "Pourquoi ce niveau",
      applicableDeadline: "Échéance applicable",
      obligationsToSatisfy: plural({
        one: "{count} obligation à satisfaire",
        other: "{count} obligations à satisfaire",
      }),
      moreObligations: "+ {count} de plus — liste de contrôle complète après l’enregistrement.",
      explain: "Expliquer en langage clair",
      aiExplanation: "Explication par l’IA",
      demoModeTag: "Mode démo",
      demoModeTitle:
        "Échantillon réaliste pré-généré. Ajoutez une ANTHROPIC_API_KEY pour passer à une rédaction en direct, propre à chaque système.",
      couldNotReach: "Impossible de joindre le service d’explication.",
      editAnswers: "Modifier les réponses",
      saveToRegistry: "Enregistrer dans le registre",
      disclaimer:
        "Aide à la décision uniquement — ne constitue pas un avis juridique. Confirmez auprès d’un conseil qualifié.",
      viewDashboard: "Voir le tableau de bord",
    },
  },

  /* --------------------------------------------------------------- dashboard */
  dashboard: {
    eyebrow: "Gouvernance de l’IA",
    title: "Registre des systèmes",
    subtitle:
      "Chaque système d’IA que vous développez ou déployez, avec son statut en direct au titre du Regulation (EU) 2024/1689.",
    exportReport: "Exporter le rapport",
    classifySystem: "Classer un système",
    kpi: {
      systems: "Systèmes enregistrés",
      systemsTip: "Systèmes d’IA actuellement dans votre inventaire.",
      systemsSub: "{count} à risque élevé ou interdits",
      compliance: "Conformité du portefeuille",
      complianceTip: "Part moyenne des obligations applicables marquées comme terminées.",
      complianceSub: "obligations closes, en moyenne",
      highRisk: "Systèmes à risque élevé",
      highRiskTip: "Systèmes de l’Annexe III soumis à l’ensemble des obligations du Chapter III.",
      highRiskSub: "obligations complètes du Chapter III",
      nearest: "Échéance la plus proche",
      nearestTip: "Échéance légale la plus proche dans votre portefeuille.",
      nearestNoSystems: "aucun système pour l’instant",
    },
    emptyTitle: "Aucun système enregistré pour l’instant",
    emptyBody:
      "Classez votre premier système d’IA pour voir exactement ce que le EU AI Act exige de lui — avec des articles cités et une liste de contrôle des obligations suivie.",
    riskDistribution: "Répartition des risques",
    total: "{count} au total",
    systemsUnit: "systèmes",
    needsAttention: "À surveiller",
    needsAttentionSub: "Risque le plus élevé et le moins avancé — à examiner en priorité.",
    toNearestDeadline: "avant la prochaine échéance",
    unassigned: "Non attribué",
    portfolioCompliance: "Conformité du portefeuille",
    viewFullReport: "Voir le rapport complet",
    allSystems: "Tous les systèmes",
    searchPlaceholder: "Rechercher des systèmes…",
    searchAria: "Rechercher des systèmes",
    filterAria: "Filtrer par niveau de risque",
    all: "Tous",
    sortAria: "Trier les systèmes",
    sortRecent: "Plus récents",
    sortRisk: "Risque le plus élevé",
    sortCompliance: "Conformité la plus faible",
    sortName: "Nom (A–Z)",
    noMatches: "Aucun résultat",
    noMatchesBody: "Essayez une autre recherche ou effacez les filtres.",
    clearFilters: "Effacer les filtres",
    table: {
      system: "Système",
      risk: "Risque",
      owner: "Responsable",
      compliance: "Conformité",
      deadline: "Échéance",
      open: "Ouvrir",
    },
    showing: "Affichage de {from}–{to} sur {total}",
    prev: "Précédent",
    next: "Suivant",
  },

  /* ------------------------------------------------------------------ report */
  report: {
    backDashboard: "Tableau de bord",
    printSave: "Imprimer / Enregistrer en PDF",
    reportTitle: "Rapport de préparation à la conformité au EU AI Act",
    generated: "Généré le {date}",
    regulation: "Regulation (EU) 2024/1689",
    executiveSummary: "Synthèse",
    summary: {
      systems: "Systèmes",
      highRiskPlus: "Risque élevé +",
      avgCompliance: "Conformité moyenne",
      tiersInUse: "Niveaux utilisés",
    },
    riskDistribution: "Répartition des risques",
    systemRegister: "Registre des systèmes",
    table: {
      system: "Système",
      risk: "Risque",
      owner: "Responsable",
      outstanding: "En attente",
      compliance: "Conformité",
    },
    noSystems: "Aucun système enregistré.",
    footer:
      "Ce rapport est généré par Conforma à titre d’aide à la décision pour le Regulation (EU) 2024/1689. Il ne constitue pas un avis juridique. Les classifications doivent être confirmées par un conseil qualifié avant toute utilisation.",
  },

  /* ------------------------------------------------------------------ system */
  system: {
    backRegistry: "Registre",
    notFoundTitle: "Système introuvable",
    notFoundBody:
      "Il a peut-être été supprimé, ou il a été enregistré dans un autre navigateur. Votre registre est stocké localement sur cet appareil.",
    backToDashboard: "Retour au tableau de bord",
    plusGpai: "+ GPAI",
    meta: {
      tier: "Niveau",
      role: "Rôle",
      owner: "Responsable",
      deadline: "Échéance",
    },
    unassigned: "Non attribué",
    compliance: "Conformité",
    rationaleTitle: "Justification de la classification",
    obligationsTitle: "Liste de contrôle des obligations",
    obligationsHint: "Touchez un statut pour le faire défiler : À faire → En cours → Terminé.",
    states: {
      todo: "À faire",
      inProgress: "En cours",
      done: "Terminé",
    },
    classifyAnother: "Classer un autre système",
    deleteSystem: "Supprimer le système",
    deleteConfirm: "Supprimer « {name} » du registre ?",
    docs: {
      title: "Documents de conformité",
      hint: "Générez des premiers projets de documents réglementaires adaptés à ce système, puis prévisualisez-les et exportez-les en Markdown, Word ou PDF.",
      types: {
        technical: { label: "Documentation technique", cite: "Annex IV / Art. 11" },
        transparency: { label: "Notice de transparence", cite: "Art. 50" },
        conformity: { label: "Déclaration de conformité", cite: "Art. 47" },
      },
      drafting: "Rédaction de {label}…",
      preview: "Aperçu",
      markdown: "Markdown",
      copy: "Copier",
      copied: "Copié !",
      couldNotGenerate: "Impossible de générer ce document. Veuillez réessayer.",
    },
  },

  /* -------------------------------------------------------------- landingDemo */
  landingDemo: {
    pickSystem: "Choisir un système",
    builtOnGpai: "Repose sur un modèle à usage général",
    builtOnGpaiHint: "Ajoute des obligations pour les fournisseurs de GPAI (Art. 53+)",
    liveClassification: "Classification en direct",
    plusGpai: "+ GPAI",
    obligations: "Obligations",
    deadline: "Échéance",
    runFull: "Lancer le classificateur complet en 5 étapes",
    scenarios: {
      employment: { label: "Présélection de CV", hint: "Classe les candidats à l’emploi" },
      credit: { label: "Notation de crédit", hint: "Évalue la solvabilité" },
      chatbot: { label: "Agent conversationnel d’assistance", hint: "Échange avec les clients" },
      deepfake: { label: "Studio d’hypertrucage", hint: "Génère des médias de synthèse" },
      social: { label: "Notation sociale", hint: "Classe les citoyens selon leur comportement" },
      forecast: { label: "Prévision de la demande", hint: "Anticipe les besoins en stock" },
    },
  },

  /* ----------------------------------------------------------------- aiSource */
  ai: {
    demoDocNote:
      "> **Rédigé par IA · Mode Démo (Conforma).** Ceci est un exemple réaliste en anglais généré sans aucun service d'IA externe, afin que la démo publique fonctionne sans identifiants. Avec une clé `ANTHROPIC_API_KEY` configurée, Conforma rédige les documents nativement dans votre langue. Remplacez chaque `[BRACKETED PLACEHOLDER]` avant utilisation. Aide à la décision, pas un avis juridique.",
    demoBadge: "Mode démo · exemple de sortie d’IA",
    demoBadgeTitle:
      "Aucune clé d’API Anthropic n’est configurée ; la génération par IA s’exécute donc en mode démo — des exemples de documents réalistes et pré-générés. Aucune API payante requise.",
    draftedByClaude: "Rédigé par Claude",
    aiDraftDemo: "Projet IA · Mode démo",
    aiDraftDemoTitle:
      "Échantillon réaliste pré-généré. Ajoutez une ANTHROPIC_API_KEY pour passer à une rédaction en direct, propre à chaque système.",
    couldNotGenerate: "Impossible de générer — veuillez réessayer.",
    docLabels: {
      technical: "Documentation technique (Annex IV)",
      transparency: "Notice de transparence (Art. 50)",
      conformity: "Déclaration de conformité de l’UE (Art. 47)",
    },
    /** Plain-language narrative, composed from these fragments per locale. */
    narrative: {
      intro:
        "« {system} » a été classé comme {tier} au titre du Regulation (EU) 2024/1689. {reasons} Concrètement, cela signifie ce qui suit : {summary}{gpai}",
      gpai: " Parce qu’il repose sur un modèle d’IA à usage général, les obligations incombant aux fournisseurs de GPAI prévues à l’Art. 53 s’appliquent en sus du niveau indiqué ci-dessus — tenez à disposition la documentation technique du modèle et un résumé des données d’entraînement.",
      nextStep:
        "L’étape suivante la plus urgente consiste à {step}. L’échéance qui compte ici est {deadline} — {date} — au-delà de laquelle les obligations deviennent exécutoires. Tout manquement peut entraîner des sanctions pouvant atteindre {penalty} ou {pct} % du chiffre d’affaires annuel mondial, le montant le plus élevé étant retenu ({citation}).",
      closing:
        "Considérez la liste de contrôle des obligations ci-dessous comme votre analyse des écarts : attribuez un responsable à chaque élément, rassemblez les preuves démontrant que vous y satisfaites et clôturez tout ce qui reste ouvert bien avant l’échéance. Rien de tout cela ne constitue un avis juridique — confirmez la classification finale et votre plan de remédiation auprès d’un conseil qualifié.",
      steps: {
        prohibited:
          "cesser de mettre le système sur le marché ou en service, car cette pratique est purement et simplement interdite au titre de l’Art. 5",
        high: "mettre en place le processus de gestion des risques de l’Art. 9 et entamer le dossier technique de l’Annexe IV, car ils conditionnent l’évaluation de la conformité que vous devez réussir avant l’échéance",
        limited:
          "mettre en œuvre les obligations de transparence de l’Art. 50 — informer les personnes qu’elles ont affaire à une IA et étiqueter, dans un format lisible par machine, tout contenu de synthèse",
        minimal:
          "consigner cette évaluation dans votre inventaire d’IA et la maintenir sous revue, car un changement de finalité prévue peut faire basculer le système dans un niveau supérieur",
      },
    },
    /** Used to instruct Claude to write in the visitor's language (live mode). */
    promptLanguage: "français",
  },

  /* ------------------------------------------------------------- classifier */
  classifier: {
    notAISystem:
      "Le système ne répond pas à la définition d’un « système d’IA » au sens de l’Art. 3(1) ; les obligations du règlement applicables au niveau du système ne s’appliquent donc pas.",
    prohibitedMatch: "Correspond à une pratique interdite : {practice}.",
    annexIMatch:
      "L’IA est un composant de sécurité d’un produit — ou constitue elle-même un produit — couvert par la législation d’harmonisation de l’UE listée à l’Annexe I, et requiert une évaluation de la conformité par un tiers.",
    annexIIIMatch: "La finalité prévue relève d’un domaine à risque élevé : {area}.",
    derogation:
      "Vous avez indiqué que le système n’accomplit qu’une tâche procédurale ou préparatoire restreinte et n’influence pas matériellement l’issue des décisions. Au titre de la dérogation de l’Art. 6(3), il peut échapper au risque élevé — mais vous devez documenter cette évaluation et tout de même enregistrer le système.",
    transparencyMatch: "Le système {trigger}, ce qui déclenche des obligations de transparence.",
    transparencyTriggers: {
      interacts: "interagit directement avec des personnes",
      synthetic: "génère du contenu audio/image/vidéo/texte de synthèse",
      deepfake: "produit des hypertrucages",
      emotion: "effectue de la reconnaissance des émotions ou de la catégorisation biométrique",
    },
    minimalDefault:
      "Aucune pratique interdite, aucun cas d’usage à risque élevé et aucun déclencheur de transparence n’ont été identifiés. Le système relève de la catégorie à risque minimal.",
    gpaiOverlay:
      "Le système repose sur un modèle d’IA à usage général ; les obligations incombant aux fournisseurs de GPAI s’appliquent donc en sus du niveau du système indiqué ci-dessus.",
  },

  /* ------------------------------------------------------------------ domain */
  domain: {
    roles: {
      provider: "Fournisseur",
      deployer: "Déployeur",
      both: "Les deux",
    },
    riskTiers: {
      prohibited: {
        label: "Risque inacceptable — Interdit",
        short: "Interdit",
        summary:
          "La pratique est interdite dans l’UE. Elle ne peut être ni mise sur le marché, ni mise en service, ni utilisée. La poursuite de son utilisation vous expose aux sanctions les plus lourdes.",
      },
      high: {
        label: "Risque élevé",
        short: "Risque élevé",
        summary:
          "Autorisé uniquement s’il satisfait à l’ensemble des obligations du Chapter III avant sa mise sur le marché : gestion des risques, gouvernance des données, documentation technique, journalisation, transparence, contrôle humain, exactitude & cybersécurité, ainsi qu’une évaluation de la conformité et l’enregistrement dans la base de données de l’UE.",
      },
      limited: {
        label: "Risque limité — Transparence",
        short: "Limité",
        summary:
          "Largement autorisé, mais des obligations de transparence spécifiques s’appliquent : les personnes doivent être informées qu’elles interagissent avec une IA, et tout contenu de synthèse ou manipulé doit être étiqueté dans un format lisible par machine.",
      },
      minimal: {
        label: "Risque minimal",
        short: "Minimal",
        summary:
          "Aucune obligation contraignante au titre du EU AI Act. Les codes de conduite volontaires sont encouragés. Les obligations de maîtrise de l’IA (Art. 4) et le droit général des produits restent applicables.",
      },
    },
    prohibited: {
      subliminal: {
        title: "Techniques subliminales ou manipulatrices",
        description:
          "Recourt à des techniques subliminales, délibérément manipulatrices ou trompeuses qui altèrent matériellement le comportement et causent (ou sont susceptibles de causer) un préjudice important.",
      },
      vulnerability: {
        title: "Exploitation des vulnérabilités",
        description:
          "Exploite les vulnérabilités liées à l’âge, au handicap ou à une situation sociale ou économique particulière afin d’altérer le comportement et de causer un préjudice important.",
      },
      "social-scoring": {
        title: "Notation sociale",
        description:
          "Évalue ou classe les personnes dans la durée en fonction de leur comportement social ou de leurs caractéristiques personnelles, entraînant un traitement préjudiciable dans des contextes sans rapport, ou injustifié ou disproportionné.",
      },
      "predictive-policing": {
        title: "Police prédictive individuelle",
        description:
          "Évalue le risque qu’une personne commette une infraction en se fondant uniquement sur le profilage ou sur des traits de personnalité.",
      },
      "facial-scraping": {
        title: "Moissonnage non ciblé d’images faciales",
        description:
          "Crée ou enrichit des bases de données de reconnaissance faciale par moissonnage non ciblé d’images faciales sur Internet ou issues de la vidéosurveillance.",
      },
      "emotion-work-edu": {
        title: "Reconnaissance des émotions au travail / dans l’éducation",
        description:
          "Déduit les émotions des personnes sur le lieu de travail ou dans les établissements d’enseignement (sauf pour des raisons médicales ou de sécurité).",
      },
      "biometric-categorization": {
        title: "Catégorisation biométrique sensible",
        description:
          "Catégorise les personnes à partir de données biométriques afin d’en déduire l’origine raciale, les opinions politiques, l’appartenance syndicale, les convictions religieuses, la vie sexuelle ou l’orientation sexuelle.",
      },
      rbi: {
        title: "Identification biométrique à distance en temps réel",
        description:
          "Utilise l’identification biométrique à distance « en temps réel » dans des espaces accessibles au public à des fins répressives (sous réserve d’exceptions étroites et autorisées).",
      },
    },
    annexIII: {
      biometrics: {
        title: "Biométrie",
        examples:
          "Identification biométrique à distance, catégorisation biométrique selon des attributs sensibles, reconnaissance des émotions (lorsqu’elle n’est pas interdite).",
      },
      "critical-infrastructure": {
        title: "Infrastructures critiques",
        examples:
          "Composants de sécurité dans la gestion ou l’exploitation des infrastructures numériques critiques, du trafic routier ou de la fourniture d’eau, de gaz, de chauffage et d’électricité.",
      },
      education: {
        title: "Éducation & formation professionnelle",
        examples:
          "Décisions d’admission, évaluation des acquis d’apprentissage, détermination du niveau d’enseignement approprié, surveillance ou détection des comportements interdits lors des examens.",
      },
      employment: {
        title: "Emploi & gestion des travailleurs",
        examples:
          "Recrutement et sélection, ciblage des offres d’emploi, examen des candidatures, décisions de promotion ou de licenciement, attribution des tâches, suivi des performances.",
      },
      "essential-services": {
        title: "Accès aux services essentiels",
        examples:
          "Éligibilité à l’aide publique ou aux prestations, solvabilité & notation de crédit, évaluation des risques et tarification en assurance vie ou santé, régulation des appels d’urgence.",
      },
      "law-enforcement": {
        title: "Activités répressives",
        examples:
          "Évaluation du risque de commettre une infraction ou de récidiver, ou d’en devenir victime, polygraphes, appréciation de la fiabilité des preuves, profilage au cours d’enquêtes.",
      },
      migration: {
        title: "Migration, asile & contrôle aux frontières",
        examples:
          "Polygraphes, évaluations des risques de migration irrégulière, de sécurité ou de santé, examen des demandes d’asile ou de visa, détection ou identification des personnes.",
      },
      justice: {
        title: "Justice & processus démocratiques",
        examples:
          "Aider les autorités judiciaires à rechercher et interpréter les faits et le droit ; influencer l’issue d’élections ou de référendums, ou le comportement électoral.",
      },
    },
    obligations: {
      "risk-management": {
        title: "Système de gestion des risques",
        description:
          "Établir, documenter et maintenir un processus de gestion des risques continu et itératif tout au long du cycle de vie du système.",
      },
      "data-governance": {
        title: "Données & gouvernance des données",
        description:
          "Les données d’entraînement, de validation et de test doivent répondre à des critères de qualité : pertinentes, représentatives, exemptes d’erreurs et examinées pour détecter les biais.",
      },
      "technical-documentation": {
        title: "Documentation technique",
        description:
          "Établir et tenir à jour la documentation technique démontrant la conformité (le dossier de l’Annexe IV).",
      },
      "record-keeping": {
        title: "Tenue de registres (journalisation)",
        description:
          "Enregistrer automatiquement les événements (« journaux ») tout au long de la vie du système afin d’assurer la traçabilité de son fonctionnement.",
      },
      "transparency-deployers": {
        title: "Transparence envers les déployeurs",
        description:
          "Concevoir le système avec une transparence suffisante et fournir une notice d’utilisation permettant aux déployeurs d’interpréter les résultats et de les utiliser de manière appropriée.",
      },
      "human-oversight": {
        title: "Contrôle humain",
        description:
          "Concevoir le système de manière à ce qu’il puisse être effectivement supervisé par des humains, y compris l’arrêt ou la neutralisation et la prise en compte du biais d’automatisation.",
      },
      "accuracy-robustness": {
        title: "Exactitude, robustesse & cybersécurité",
        description:
          "Atteindre des niveaux appropriés d’exactitude, de robustesse et de cybersécurité, cohérents et résilients face aux erreurs et aux attaques adverses.",
      },
      qms: {
        title: "Système de gestion de la qualité",
        description:
          "Mettre en place un système de gestion de la qualité documenté couvrant les processus, procédures et responsabilités en matière de conformité.",
      },
      "conformity-assessment": {
        title: "Évaluation de la conformité",
        description:
          "Se soumettre à la procédure d’évaluation de la conformité applicable avant de mettre le système sur le marché ou en service.",
      },
      "ce-doc": {
        title: "Déclaration de conformité de l’UE & marquage CE",
        description:
          "Établir la déclaration de conformité de l’UE et apposer le marquage CE attestant la conformité au règlement.",
      },
      "eu-registration": {
        title: "Enregistrement dans la base de données de l’UE",
        description:
          "Enregistrer le système à risque élevé dans la base de données de l’UE avant de le mettre sur le marché ou en service.",
      },
      "use-per-instructions": {
        title: "Utiliser conformément à la notice & assigner un contrôle",
        description:
          "Utiliser le système conformément à la notice, assigner un contrôle humain compétent et veiller à la pertinence des données d’entrée.",
      },
      monitoring: {
        title: "Surveiller & signaler",
        description:
          "Surveiller le fonctionnement, suspendre l’utilisation et informer le fournisseur ou l’autorité en cas d’incident grave ou de risque ; conserver les journaux générés automatiquement.",
      },
      fria: {
        title: "Analyse d’impact sur les droits fondamentaux",
        description:
          "Les organismes publics et certains déployeurs privés (p. ex. banque, assurance) doivent réaliser une analyse d’impact sur les droits fondamentaux avant utilisation.",
      },
      "inform-affected": {
        title: "Informer les personnes concernées",
        description:
          "Lorsque le système prend ou facilite des décisions concernant des personnes, informer ces personnes qu’elles sont soumises à son utilisation.",
      },
      "disclose-chatbot": {
        title: "Divulguer l’interaction avec l’IA",
        description:
          "Les personnes doivent être informées qu’elles interagissent avec un système d’IA, sauf si cela est évident d’après le contexte.",
      },
      "label-synthetic": {
        title: "Marquer le contenu de synthèse",
        description:
          "Le contenu audio, image, vidéo ou texte généré par l’IA doit être marqué dans un format lisible par machine comme étant généré ou manipulé artificiellement.",
      },
      "label-deepfake": {
        title: "Divulguer les hypertrucages",
        description:
          "Les déployeurs de systèmes générant des hypertrucages doivent indiquer que le contenu a été généré ou manipulé artificiellement.",
      },
      "emotion-disclosure": {
        title: "Divulguer la reconnaissance des émotions / catégorisation biométrique",
        description:
          "Les déployeurs de systèmes de reconnaissance des émotions ou de catégorisation biométrique doivent en informer les personnes qui y sont exposées.",
      },
      "gpai-techdoc": {
        title: "Documentation technique du modèle",
        description:
          "Établir et tenir à jour la documentation technique du modèle, y compris le processus d’entraînement et de test ainsi que les résultats d’évaluation.",
      },
      "gpai-downstream": {
        title: "Information aux fournisseurs en aval",
        description:
          "Fournir des informations et de la documentation aux fournisseurs en aval qui intègrent le modèle dans leurs systèmes d’IA.",
      },
      "gpai-copyright": {
        title: "Politique de droit d’auteur & résumé des données d’entraînement",
        description:
          "Mettre en place une politique de respect du droit d’auteur de l’UE et publier un résumé suffisamment détaillé du contenu d’entraînement.",
      },
      "gpai-systemic": {
        title: "Obligations liées au risque systémique",
        description:
          "Les modèles présentant un risque systémique doivent en outre réaliser des évaluations de modèles, des tests contradictoires, un suivi des incidents et une protection en matière de cybersécurité.",
      },
    },
    deadlines: {
      force: {
        label: "Entrée en vigueur du règlement",
        description:
          "Le EU AI Act entre en vigueur ; le compte à rebours d’application échelonnée démarre.",
      },
      prohibitions: {
        label: "Application des pratiques interdites & de la maîtrise de l’IA",
        description:
          "Les interdictions de l’Art. 5 deviennent applicables, de même que l’obligation de maîtrise de l’IA (Art. 4).",
      },
      gpai: {
        label: "Application des GPAI, de la gouvernance & des sanctions",
        description:
          "Les obligations relatives aux modèles d’IA à usage général, le cadre de gouvernance et le régime de sanctions deviennent applicables.",
      },
      "high-risk-annex-iii": {
        label: "Application du risque élevé (Annex III) & de la transparence",
        description:
          "Les obligations principales applicables aux systèmes à risque élevé relevant de l’Annexe III et les obligations de transparence de l’Art. 50 deviennent applicables. C’est l’échéance vers laquelle la plupart des organisations se précipitent.",
      },
      "high-risk-annex-i": {
        label: "Application du risque élevé (produits réglementés)",
        description:
          "Les obligations relatives au risque élevé pour l’IA qui constitue un composant de sécurité de produits déjà couverts par la législation d’harmonisation de l’UE (Annexe I) deviennent applicables.",
      },
    },
  },

  /* ---------------------------------------------------------------- metadata */
  metadata: {
    root: {
      titleDefault: "Conforma — conformité au EU AI Act, automatisée",
      titleTemplate: "%s · Conforma",
      description:
        "Conforma est la plateforme de conformité au EU AI Act. Recensez vos systèmes d’IA, classez automatiquement leur risque avec les articles cités, comblez les écarts d’obligations et générez une documentation prête pour l’audit avant l’échéance d’août 2026.",
      ogTitle: "Conforma — conformité au EU AI Act, automatisée",
      ogDescription:
        "Classez automatiquement vos systèmes d’IA, comblez les écarts d’obligations et générez une documentation prête pour l’audit avant l’échéance d’août 2026 du EU AI Act.",
      twitterTitle: "Conforma — conformité au EU AI Act, automatisée",
      twitterDescription:
        "La plateforme de conformité au EU AI Act. Classez vos systèmes, comblez les écarts et générez la documentation avant août 2026.",
    },
    pricing: {
      title: "Tarifs",
      description:
        "Une tarification simple et transparente pour la conformité au EU AI Act. Commencez gratuitement, passez à des systèmes illimités avec le SSO, les journaux d’audit et la résidence des données dans l’UE sur l’offre Enterprise.",
    },
    security: {
      title: "Sécurité & Confiance",
      description:
        "Comment Conforma protège vos données : résidence des données dans l’UE, chiffrement en transit et au repos, SSO/SAML, accès basé sur les rôles, journalisation d’audit, transparence sur les sous-traitants ultérieurs et un DPA sur mesure.",
    },
    demo: {
      title: "Réserver une démo",
      description:
        "Découvrez comment Conforma classe vos systèmes d’IA au titre du EU AI Act, comble les écarts d’obligations et génère une documentation prête pour l’audit. Réservez une démonstration de 30 minutes.",
    },
    terms: {
      title: "Conditions d’utilisation",
      description:
        "Les conditions régissant l’utilisation de Conforma, notamment l’étendue du service, la clause de non-conseil juridique, l’utilisation acceptable et la responsabilité.",
    },
    privacy: {
      title: "Politique de confidentialité",
      description:
        "Comment Conforma collecte, utilise et protège les données personnelles, vos droits au titre du GDPR, la résidence des données, la conservation et nos sous-traitants ultérieurs.",
    },
    classify: {
      title: "Classer un système d’IA",
      description:
        "Répondez à quelques questions et obtenez une classification du risque au titre du EU AI Act avec les articles cités, les obligations applicables et votre échéance de conformité — en 30 secondes.",
    },
    dashboard: { title: "Tableau de bord" },
    report: { title: "Rapport de préparation à la conformité" },
    system: { title: "Système d’IA" },
  },

  /* ---------------------------------------------------------- opengraph image */
  og: {
    alt: "Conforma — conformité au EU AI Act, automatisée",
    title: "La conformité au EU AI Act, en pilote automatique",
    subtitle:
      "Classez vos systèmes d’IA, comblez les écarts d’obligations et générez une documentation prête pour l’audit.",
    badge: "Obligations à risque élevé applicables le 2 août 2026",
    regulation: "Regulation (EU) 2024/1689",
  },

  /* -------------------------------------------------------------------- auth */
  auth: {
    emailLabel: "E-mail",
    emailPlaceholder: "vous@entreprise.com",
    passwordLabel: "Mot de passe",
    fullNameLabel: "Nom complet",
    fullNamePlaceholder: "Jean Dupont",
    orgNameLabel: "Nom de l'organisation",
    orgNamePlaceholder: "Acme SARL",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    passwordHint: "Au moins 8 caractères.",
    signOut: "Se déconnecter",
    signIn: {
      title: "Bon retour",
      subtitle: "Connectez-vous à votre espace Conforma.",
      submit: "Se connecter",
      submitting: "Connexion…",
      forgot: "Mot de passe oublié ?",
      noAccount: "Nouveau sur Conforma ?",
      createAccount: "Créer un compte",
    },
    signUp: {
      title: "Créer votre compte",
      subtitle: "Gérez la conformité au règlement IA en quelques minutes.",
      submit: "Créer le compte",
      submitting: "Création du compte…",
      haveAccount: "Vous avez déjà un compte ?",
      signInLink: "Se connecter",
      terms:
        "En créant un compte, vous acceptez nos [Conditions](/terms) et notre [Politique de confidentialité](/privacy).",
    },
    forgot: {
      title: "Réinitialiser le mot de passe",
      subtitle: "Nous vous enverrons un lien pour définir un nouveau mot de passe.",
      submit: "Envoyer le lien",
      submitting: "Envoi…",
      sent: "Si un compte existe pour {email}, un lien de réinitialisation est en route.",
      backToSignIn: "Retour à la connexion",
    },
    reset: {
      title: "Définir un nouveau mot de passe",
      subtitle: "Choisissez un mot de passe fort que vous n'utilisez pas ailleurs.",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      submit: "Mettre à jour",
      submitting: "Mise à jour…",
      mismatch: "Les mots de passe ne correspondent pas.",
      success: "Mot de passe mis à jour. Tout est prêt.",
      invalidLink: "Ce lien est invalide ou a expiré. Demandez-en un nouveau.",
    },
    verify: {
      title: "Vérifiez votre boîte mail",
      subtitle:
        "Nous avons envoyé un lien de vérification à {email}. Cliquez dessus pour activer votre compte.",
      resend: "Renvoyer l'e-mail",
      resent: "Renvoyé — vérifiez votre boîte mail.",
      backToSignIn: "Retour à la connexion",
    },
    onboarding: {
      title: "Créer votre organisation",
      subtitle: "Votre espace de travail — systèmes d'IA, rapports et coéquipiers.",
      submit: "Créer l'organisation",
      submitting: "Création…",
      slugHint: "Ce sera l'URL de votre espace de travail.",
    },
    errors: {
      invalidCredentials: "E-mail ou mot de passe incorrect.",
      emailInUse: "Un compte existe déjà avec cet e-mail.",
      weakPassword: "Le mot de passe doit comporter au moins 8 caractères.",
      emailNotConfirmed: "Veuillez vérifier votre e-mail avant de vous connecter.",
      rateLimited: "Trop de tentatives. Veuillez patienter un instant et réessayer.",
      generic: "Une erreur s'est produite. Veuillez réessayer.",
    },
  },

  /* ----------------------------------------------------------------- billing */
  billing: {
    title: "Facturation et forfait",
    desc: "Votre abonnement, votre utilisation et vos informations de paiement.",
    currentPlan: "Forfait actuel",
    plan: { free: "Gratuit", pro: "Pro", team: "Équipe" },
    usage: "Systèmes d'IA",
    usageCount: "{used} sur {limit}",
    unlimited: "Illimité",
    renews: "Renouvellement le {date}",
    cancels: "Résiliation le {date}",
    upgradePro: "Passer à Pro",
    upgradeTeam: "Passer à Équipe",
    manage: "Gérer la facturation",
    memberNote: "Seuls les propriétaires et administrateurs peuvent modifier la facturation.",
    disabled: "La facturation n'est pas configurée pour cet espace de travail.",
    pastDue: "Paiement en retard",
    canceled: "Abonnement résilié",
  },

  /* -------------------------------------------------------------------- team */
  team: {
    title: "Équipe",
    subtitle: "Gérez les membres, les invitations et les paramètres de l'espace.",
    usageTitle: "Utilisation",
    nav: "Équipe",
    orgName: "Nom de l'espace de travail",
    save: "Enregistrer",
    saved: "Enregistré",
    members: "Membres",
    you: "Vous",
    remove: "Retirer",
    role: "Rôle",
    roles: { owner: "Propriétaire", admin: "Administrateur", member: "Membre" },
    invite: "Inviter par e-mail",
    emailPlaceholder: "collegue@entreprise.com",
    sendInvite: "Envoyer l'invitation",
    sending: "Envoi…",
    inviteCreated: "Invitation créée — partagez ce lien :",
    copy: "Copier",
    copied: "Copié",
    pendingInvites: "Invitations en attente",
    noPendingInvites: "Aucune invitation en attente.",
    revoke: "Révoquer",
    expires: "Expire le {date}",
    activity: "Activité",
    noActivity: "Aucune activité pour le moment.",
    memberNote: "Seuls les propriétaires et administrateurs peuvent gérer l'équipe.",
    acceptTitle: "Acceptez votre invitation",
    acceptBody: "Vous avez été invité à rejoindre un espace de travail sur Conforma.",
    acceptButton: "Accepter l'invitation",
    acceptSignedOut: "Connectez-vous ou créez un compte avec l'e-mail invité pour accepter.",
    actions: {
      invited: "a invité un collègue",
      joined: "a rejoint l'espace de travail",
      removed: "a retiré un membre",
      roleChanged: "a modifié le rôle d'un membre",
      inviteRevoked: "a révoqué une invitation",
      orgRenamed: "a renommé l'espace de travail",
      apiKeyCreated: "a créé une clé API",
      apiKeyRevoked: "a révoqué une clé API",
      generic: "{action}",
    },
    errors: {
      forbidden: "Vous n'avez pas l'autorisation nécessaire.",
      invalidEmail: "Saisissez une adresse e-mail valide.",
      alreadyInvited: "Cet e-mail a déjà une invitation en attente.",
      notAllowed: "Cette modification n'est pas autorisée.",
      invalidInvite: "Cette invitation est invalide, expirée ou destinée à une autre adresse.",
      generic: "Une erreur s'est produite.",
    },
  },

  /* ---------------------------------------------------------------- apiKeys */
  apiKeys: {
    title: "Clés API",
    desc: "Accès programmatique à votre espace via l'API REST.",
    nameLabel: "Nom de la clé",
    namePlaceholder: "Intégration production",
    create: "Créer une clé",
    creating: "Création…",
    created: "Copiez votre nouvelle clé maintenant — elle ne sera plus affichée :",
    copy: "Copier",
    copied: "Copié",
    none: "Aucune clé API pour le moment.",
    revoke: "Révoquer",
    revoked: "Révoquée",
    createdOn: "Créée le {date}",
    lastUsed: "Dernière utilisation le {date}",
    neverUsed: "Jamais utilisée",
  },

  /* -------------------------------------------------------------- documents */
  documents: {
    title: "Documents",
    subtitle: "Documents de conformité générés pour votre organisation.",
    nav: "Documents",
    empty: "Aucun document — générez-en un depuis le rapport d'un système.",
    view: "Voir",
    close: "Fermer",
    generated: "Généré le {date}",
  },
};

export default fr;
