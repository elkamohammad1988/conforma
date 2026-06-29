/**
 * Spanish (Español, España) — native, professional translation catalog.
 *
 * Typed as `Messages` so missing keys are a type error. Regulatory citations
 * ("Art. 5", "Annex III", "Chapter III") are intentionally NOT translated.
 */
import type { Messages } from "./index";
import { plural } from "./_types";

const es: Messages = {
  /* ------------------------------------------------------------------ common */
  common: {
    brand: "Conforma",
    euAiAct: "EU AI Act",
    regulation: "Regulation (EU) 2024/1689",
    startFree: "Empezar gratis",
    bookDemo: "Reservar una demo",
    talkToSales: "Hablar con ventas",
    back: "Atrás",
    continue: "Continuar",
    optional: "(opcional)",
    yes: "Sí",
    no: "No",
    thinking: "Pensando…",
    dash: "—",
    daysLeft: plural({
      one: "Queda {count} día",
      other: "Quedan {count} días",
    }),
    deadlinePassed: "plazo vencido",
    notLegalAdvice:
      "Herramienta de apoyo a la decisión para el Regulation (EU) 2024/1689 — no constituye asesoramiento jurídico. Confirme las clasificaciones con asesores cualificados.",
  },

  /* ------------------------------------------------------------ languageSwitcher */
  languageSwitcher: {
    label: "Idioma",
    change: "Cambiar idioma",
    selected: "Idioma seleccionado: {language}",
  },

  /* --------------------------------------------------------------------- nav */
  nav: {
    howItWorks: "Cómo funciona",
    security: "Seguridad",
    pricing: "Precios",
    dashboard: "Panel",
    bookDemo: "Reservar una demo",
    startFree: "Empezar gratis",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    skipToContent: "Saltar al contenido",
  },

  /* ------------------------------------------------------------------ footer */
  footer: {
    tagline:
      "La plataforma de cumplimiento para el EU AI Act. Clasifique, cierre brechas y demuestre la conformidad, sin un equipo de cumplimiento.",
    columns: {
      product: {
        title: "Producto",
        riskClassifier: "Clasificador de riesgo",
        aiRegistry: "Registro de IA",
        pricing: "Precios",
        bookDemo: "Reservar una demo",
      },
      trust: {
        title: "Confianza",
        security: "Seguridad",
        dataResidency: "Residencia de datos",
        subprocessors: "Subencargados",
      },
      company: {
        title: "Empresa",
        howItWorks: "Cómo funciona",
        faq: "Preguntas frecuentes",
        contactSales: "Contactar con ventas",
      },
      legal: {
        title: "Legal",
        terms: "Condiciones del servicio",
        privacy: "Política de privacidad",
        dataProcessing: "Tratamiento de datos",
      },
    },
    rights: "© {year} Conforma. Todos los derechos reservados.",
    disclaimer:
      "Herramienta de apoyo a la decisión para el Regulation (EU) 2024/1689 — no constituye asesoramiento jurídico. Confirme las clasificaciones con asesores cualificados.",
  },

  /* ------------------------------------------------------------ announcement */
  announcement: {
    prefix: "Se aplican obligaciones de alto riesgo",
    cta: "Compruebe su exposición",
    dismiss: "Descartar",
  },

  /* -------------------------------------------------------------------- home */
  home: {
    hero: {
      badge: "Se aplican obligaciones de alto riesgo",
      titleLine1: "Cumplimiento del EU AI Act,",
      titleAccent: "en piloto automático",
      subtitle:
        "Conforma inventaría sus sistemas de IA, clasifica automáticamente su riesgo con citas a los artículos exactos, cierra cada brecha de obligaciones y genera la documentación que esperan los reguladores, sin contratar un equipo de cumplimiento.",
      fineprint:
        "Sin tarjeta de crédito · clasificación en 30 segundos · listo para auditoría en minutos",
      trustEyebrow: "Alineado con los marcos que esperan sus auditores",
    },
    showcase: {
      url: "app.conforma.eu/dashboard",
      registryTitle: "Registro de sistemas de IA",
      registrySub: "3 sistemas · 1 de alto riesgo",
      classify: "Clasificar",
      stats: {
        systems: "Sistemas",
        compliance: "Cumplimiento",
        nearest: "Más próximo",
      },
      table: {
        system: "Sistema",
        risk: "Riesgo",
        owner: "Responsable",
        compliance: "Cumplimiento",
      },
      owners: {
        peopleOps: "Recursos Humanos",
        support: "Soporte",
        supplyChain: "Cadena de suministro",
      },
    },
    stats: {
      fine: { value: "35 M€", label: "multa máxima por IA prohibida", sub: "o el 7 % del volumen de negocio" },
      areas: { value: "8", label: "áreas de casos de uso de alto riesgo", sub: "Annex III" },
      deadline: { value: "Ago 2026", label: "el plazo al que se enfrenta la mayoría", sub: "Art. 113" },
      states: { value: "27", label: "Estados miembros de la UE", sub: "un solo reglamento" },
    },
    interactiveDemo: {
      eyebrow: "Demo interactiva",
      title: "Clasifique un sistema ahora mismo",
      subtitle:
        "Sin registro. Elija un sistema abajo y observe cómo el motor determinista fija su nivel de riesgo, cita los artículos y cuenta las obligaciones, en directo.",
    },
    problem: {
      eyebrow: "El problema",
      title: "Ahora todas las empresas lanzan IA. Casi ninguna puede demostrar que cumple.",
      p1: "El EU AI Act es la primera ley integral de IA del mundo, y alcanza a cualquier organización cuya IA toque el mercado de la UE, esté donde esté. Sin embargo, hoy el cumplimiento implica un abogado, una hoja de cálculo y semanas cruzando referencias en un reglamento de 100 páginas.",
      p2: "Conforma lo convierte en un flujo de trabajo guiado: responda unas pocas preguntas por sistema, obtenga una clasificación defendible y salga con las pruebas y los documentos que necesita.",
      code: {
        comment: "# clasificar un sistema",
        result: "→ ALTO RIESGO",
        obligations: "11 obligaciones del proveedor · Art. 9–49",
        deadlineLabel: "plazo:",
        drafted: "✓ documentación redactada",
      },
    },
    personas: {
      title: "Una única fuente de verdad para todos los implicados",
      subtitle:
        "El AI Act no recae en un solo equipo. Conforma ofrece a cada parte interesada el mismo registro defendible.",
      items: {
        legal: {
          role: "Jurídico y Cumplimiento",
          desc: "Clasificaciones defendibles y citadas, con un rastro auditable, sin tener que analizar manualmente el reglamento.",
        },
        product: {
          role: "Equipos de IA y Producto",
          desc: "Sepa qué requiere cada modelo antes del lanzamiento, para que el cumplimiento deje de bloquear la hoja de ruta.",
        },
        security: {
          role: "Responsables de Seguridad y TI",
          desc: "Un único registro de cada sistema de IA de la organización, su nivel de riesgo y sus pruebas.",
        },
      },
    },
    tiers: {
      title: "Cuatro niveles de riesgo. Una respuesta clara.",
      subtitle:
        "El AI Act clasifica cada sistema de IA en un nivel de riesgo, y el nivel determina lo que debe hacer. Conforma fija el suyo, con la cita.",
    },
    how: {
      title: "De la incertidumbre a listo para auditoría en cuatro pasos",
      steps: {
        register: {
          title: "Registrar",
          desc: "Añada cada sistema de IA a su registro, ya sea propio, adquirido o integrado en un producto.",
        },
        classify: {
          title: "Clasificar",
          desc: "Un cuestionario guiado asigna el sistema a un nivel de riesgo con artículos citados. Sin necesidad de abogado.",
        },
        closeGaps: {
          title: "Cerrar brechas",
          desc: "Recorra las obligaciones exactas de ese nivel como una lista de comprobación con responsables y estado.",
        },
        generate: {
          title: "Generar documentos",
          desc: "Redacte la documentación técnica, los avisos de transparencia y la declaración de conformidad con un solo clic.",
        },
      },
    },
    timeline: {
      eyebrow: "El reloj corre",
      title: "El calendario de aplicación del EU AI Act",
      subtitle:
        "Las obligaciones se activan por fases conforme al Art. 113. Conforma sigue cada hito para que nada se escape.",
      inForce: "En vigor",
    },
    features: {
      title: "Todo lo que necesita para demostrar la conformidad",
      subtitle:
        "Un conjunto completo de herramientas, desde la clasificación citada hasta documentos listos para auditoría.",
      items: {
        cited: {
          title: "Con citas, no por intuición",
          desc: "Cada clasificación y obligación enlaza con el artículo o anexo concreto del Regulation (EU) 2024/1689, defendible en una auditoría.",
        },
        annexIII: {
          title: "Cobertura del Annex III",
          desc: "Las {count} áreas de alto riesgo codificadas, desde el empleo y la calificación crediticia hasta la biometría y la aplicación de la ley.",
        },
        drafted: {
          title: "Documentos redactados por IA",
          desc: "Claude redacta el expediente técnico del Annex IV, los avisos de transparencia del Art. 50 y la declaración de conformidad de la UE, adaptados a cada sistema.",
        },
        deadlines: {
          title: "Seguimiento de plazos",
          desc: "Cuentas atrás en directo hasta cada fecha de aplicación escalonada para que nada se escape más allá del 2 ago 2026 o 2027.",
        },
        roles: {
          title: "Proveedor y responsable del despliegue",
          desc: "Obligaciones divididas según su rol, tanto si construye el sistema como si solo despliega el de otro.",
        },
        gpai: {
          title: "Consciente de GPAI",
          desc: "Señala las obligaciones del proveedor de modelos de IA de uso general (Art. 53+) además del nivel de riesgo del sistema.",
        },
      },
    },
    comparison: {
      title: "Una fracción del coste de las alternativas",
      conforma: "Conforma",
      lawFirm: "Bufete de abogados",
      spreadsheet: "Hoja de cálculo",
      rows: {
        cited: "Clasificación de riesgo con citas",
        continuous: "Continuo, no puntual",
        drafted: "Documentación redactada por IA",
        registry: "Registro de toda la cartera",
        cost: "Coste",
      },
      values: {
        manual: "manual",
        conformaCost: "149 €/mes",
        lawFirmCost: "más de 10 000 €/auditoría",
        spreadsheetCost: "0 € + riesgo",
      },
    },
    testimonials: {
      title: "Creado para los equipos que responden",
      note: "Ilustrativo de los clientes objetivo durante el acceso anticipado.",
      items: {
        one: {
          quote:
            "Pasamos de una hoja de cálculo con 40 pestañas a un único registro en el que nuestros auditores confían de verdad. Las clasificaciones citadas fueron lo que convenció a nuestro director jurídico.",
          name: "Responsable de Cumplimiento",
          company: "SaaS B2B · 200 empleados",
        },
        two: {
          quote:
            "Nuestro equipo de producto por fin puede obtener por sí mismo una lectura del riesgo antes del lanzamiento, en lugar de esperar dos semanas al departamento jurídico. Solo eso ya lo amortizó.",
          name: "VP de Producto",
          company: "Scale-up fintech",
        },
        three: {
          quote:
            "El borrador del Annex IV generado ahorró a nuestros asesores externos días de trabajo. Tratamos Conforma como el sistema de referencia para la gobernanza de la IA.",
          name: "DPO",
          company: "Plataforma sanitaria",
        },
      },
    },
    penalty: {
      title: "El coste de equivocarse",
      subtitle:
        "Las sanciones del Art. 99 se calculan como el mayor de un importe fijo o un porcentaje del volumen de negocio anual mundial.",
      orTurnover: "o el {pct} % del volumen de negocio",
      labels: {
        prohibited: "Uso prohibido",
        highRisk: "Incumplimiento de alto riesgo",
        misleadingInfo: "Información engañosa",
      },
    },
    security: {
      eyebrow: "Listo para la empresa",
      title: "Seguridad y gobernanza de serie",
      body: "Residencia de datos en la UE, cifrado en tránsito y en reposo, SSO/SAML, acceso basado en roles, registros de auditoría y un DPA personalizado. Su herramienta de cumplimiento también debería cumplir.",
      cta: "Conozca nuestra seguridad",
      badges: {
        residency: "Residencia de datos en la UE",
        encryption: "Cifrado en reposo y en tránsito",
        sso: "SSO / SAML",
        rbac: "Acceso basado en roles",
        audit: "Registro de auditoría",
        dpa: "DPA personalizado",
      },
    },
    pricing: {
      title: "Precios que superan a una iguala de cumplimiento",
      subtitle:
        "Una sola auditoría de alto riesgo de un bufete cuesta más que un año de Conforma. Empiece gratis y mejore el plan cuando crezca.",
    },
    faq: {
      title: "Preguntas frecuentes",
      items: {
        scope: {
          q: "¿Se nos aplica el EU AI Act si no estamos en la UE?",
          a: "Si su sistema de IA se introduce en el mercado o su resultado se utiliza en la UE, el AI Act se aplica con independencia de dónde tenga su sede su empresa, igual que el GDPR. Conforma ayuda a cualquier equipo global a delimitar su exposición.",
        },
        advice: {
          q: "¿Es Conforma asesoramiento jurídico?",
          a: "No. Conforma es una herramienta de apoyo a la decisión que codifica el reglamento como un flujo de trabajo estructurado con citas. Reduce drásticamente el trabajo, pero debe confirmar las clasificaciones con asesores cualificados.",
        },
        deadline: {
          q: "¿Qué es el plazo de agosto de 2026?",
          a: "Conforme al Art. 113, las obligaciones principales para los sistemas de alto riesgo (Annex III) y los deberes de transparencia del Art. 50 son aplicables a partir del 2 de agosto de 2026, el plazo hacia el que corre la mayoría de las organizaciones.",
        },
        accuracy: {
          q: "¿Qué precisión tiene la clasificación?",
          a: "La clasificación se ejecuta sobre un árbol de decisión determinista asignado directamente al texto del AI Act, de modo que cada resultado es trazable hasta artículos concretos. La IA solo se utiliza para redactar documentación y explicaciones, nunca para anular la lógica citada.",
        },
        data: {
          q: "¿Dónde se almacenan nuestros datos?",
          a: "Los planes Enterprise se ejecutan con residencia de datos en la UE, con cifrado en tránsito y en reposo. Consulte nuestra página de Seguridad para conocer todos los detalles, incluidos SSO, registros de auditoría y nuestro DPA.",
        },
      },
    },
    finalCta: {
      title: "Descubra su situación en 30 segundos",
      subtitle:
        "Sin cuenta, sin tarjeta. Clasifique su primer sistema de IA y vea exactamente qué le exige el EU AI Act.",
    },
  },

  /* ----------------------------------------------------------------- pricing */
  pricing: {
    hero: {
      title: "Precios que superan a una iguala de cumplimiento",
      subtitle:
        "Una sola auditoría de alto riesgo de un bufete cuesta más que un año de Conforma. Empiece gratis, sin necesidad de tarjeta de crédito.",
    },
    comparePlans: "Comparar planes",
    table: {
      feature: "Función",
      starter: "Starter",
      team: "Team",
      business: "Business",
      enterprise: "Enterprise",
      rows: {
        systems: "Sistemas de IA",
        classification: "Clasificación de riesgo",
        checklists: "Listas de obligaciones",
        drafted: "Documentos redactados por IA",
        exports: "Exportaciones listas para auditoría",
        users: "Usuarios y roles",
        auditLog: "Registro de auditoría",
        api: "Acceso a la API",
        sso: "SSO / SAML",
        residency: "Residencia de datos en la UE",
        dpa: "DPA personalizado",
        successManager: "Gestor de éxito dedicado",
      },
      unlimited: "Ilimitados",
    },
    custom: {
      text: "¿Necesita algo a medida?",
      cta: "Hablar con ventas",
    },
  },

  /* ------------------------------------------------------------- pricingTable */
  pricingTable: {
    monthly: "Mensual",
    annual: "Anual",
    save: "Ahorre un 20 %",
    mostPopular: "El más popular",
    perMonth: "/mes",
    billedAnnually: "facturación anual",
    billedMonthly: "facturación mensual",
    freeForever: "gratis para siempre",
    tiers: {
      starter: {
        name: "Starter",
        tagline: "Cartografíe su primer sistema",
        cta: "Empezar gratis",
        features: {
          oneSystem: "1 sistema de IA",
          classification: "Clasificación de riesgo con artículos citados",
          checklist: "Lista de obligaciones",
          deadlines: "Seguimiento de plazos",
        },
      },
      team: {
        name: "Team",
        tagline: "Para equipos que lanzan IA",
        cta: "Iniciar prueba de 14 días",
        features: {
          systems: "Hasta 25 sistemas de IA",
          drafted: "Documentación redactada por IA",
          annexIV: "Expedientes técnicos del Annex IV",
          exports: "Exportaciones listas para auditoría",
          email: "Soporte por correo electrónico",
        },
      },
      business: {
        name: "Business",
        tagline: "Para carteras de IA en crecimiento",
        cta: "Iniciar prueba de 14 días",
        features: {
          systems: "Hasta 100 sistemas de IA",
          users: "Múltiples usuarios y roles",
          auditLog: "Registro de auditoría e historial de cambios",
          api: "Acceso a la API",
          priority: "Soporte prioritario",
        },
      },
    },
    enterprise: {
      name: "Enterprise",
      badge: "SSO · RBAC · DPA",
      desc: "Sistemas ilimitados, SSO/SAML, acceso basado en roles, residencia de datos en la UE, registros de auditoría, DPA personalizado y un gestor de éxito de cumplimiento dedicado.",
      cta: "Hablar con ventas",
    },
  },

  /* ---------------------------------------------------------------- security */
  security: {
    eyebrow: "Seguridad y confianza",
    title: "Su herramienta de cumplimiento también debería cumplir",
    subtitle:
      "Conforma alberga el mapa más sensible de su parque de IA. Lo protegemos con controles de nivel empresarial y total transparencia sobre cómo se tratan sus datos.",
    badges: {
      gdpr: "Alineado con el GDPR",
      iso: "Alineado con ISO/IEC 42001",
      nist: "NIST AI RMF",
      dpa: "DPA personalizado",
    },
    principles: {
      encryption: {
        title: "Cifrado en todas partes",
        desc: "Todos los datos se cifran en tránsito con TLS 1.2+ y en reposo con AES-256. Los secretos se gestionan en un servicio dedicado de gestión de claves.",
      },
      residency: {
        title: "Residencia de datos en la UE",
        desc: "Los datos de Enterprise se almacenan y procesan en regiones de la UE, de modo que su registro de cumplimiento nunca abandona la jurisdicción que abarca.",
      },
      leastPrivilege: {
        title: "Acceso de mínimo privilegio",
        desc: "El control de acceso basado en roles, SSO/SAML y la MFA obligatoria hacen que cada persona vea solo lo que su rol requiere, y usted puede demostrarlo.",
      },
      audit: {
        title: "Rastro de auditoría completo",
        desc: "Cada cambio en una clasificación, obligación o documento se registra con el autor y la marca de tiempo: su prueba para una auditoría.",
      },
      isolation: {
        title: "Aislamiento entre clientes",
        desc: "Los datos de cada cliente están lógicamente aislados por organización, con límites de acceso estrictos aplicados en las capas de aplicación y de datos.",
      },
      resilient: {
        title: "Resiliente por diseño",
        desc: "Las copias de seguridad automatizadas, la infraestructura monitorizada y un proceso de recuperación probado mantienen su registro disponible e íntegro.",
      },
    },
    privacy: {
      title: "Protección de datos y privacidad",
      body: "Usted es el dueño de sus datos. Los tratamos únicamente para prestar el servicio, nunca para entrenar modelos de terceros, y los hacemos exportables en cualquier momento. Los clientes Enterprise reciben un Acuerdo de Tratamiento de Datos (DPA) personalizado que cubre roles, subencargados y compromisos de seguridad conforme al GDPR.",
      cards: {
        residency: { title: "Residencia de datos", value: "Regiones de la UE (Enterprise)" },
        retention: { title: "Conservación", value: "Bajo su control; se eliminan a petición" },
        portability: { title: "Portabilidad", value: "Exportación completa, en cualquier momento" },
      },
    },
    subprocessors: {
      title: "Subencargados",
      intro:
        "Utilizamos un conjunto reducido y verificado de subencargados para prestar el servicio. Cada uno está sujeto a términos de protección de datos coherentes con nuestros compromisos con usted.",
      table: { category: "Categoría", purpose: "Finalidad", region: "Región" },
      rows: {
        hosting: {
          category: "Alojamiento en la nube",
          purpose: "Alojamiento de aplicación y base de datos en región de la UE",
          region: "UE",
        },
        ai: {
          category: "Redacción de documentos con IA",
          purpose: "Genera borradores de documentos de cumplimiento a petición",
          region: "UE / EE. UU.",
        },
        monitoring: {
          category: "Supervisión de errores",
          purpose: "Telemetría de la aplicación agregada y depurada",
          region: "UE",
        },
        email: {
          category: "Envío de correo",
          purpose: "Correo transaccional y de notificaciones",
          region: "UE",
        },
      },
      note: "Lista representativa para la fase actual del producto; la lista vinculante se mantiene en su DPA.",
    },
    disclosure: {
      title: "Divulgación responsable",
      bodyBefore: "¿Ha encontrado una vulnerabilidad? Queremos que nos lo cuente. Comuníquela a ",
      email: "security@conforma.eu",
      bodyAfter: " y le responderemos en un día hábil.",
      cta: "Solicite nuestro paquete de seguridad",
    },
  },

  /* -------------------------------------------------------------------- demo */
  demo: {
    eyebrow: "Reservar una demo",
    title: "Vea su exposición al AI Act en 30 minutos",
    subtitle:
      "Un especialista en cumplimiento guiará a su equipo en la clasificación de sus sistemas de IA, el cierre de brechas de obligaciones y la generación de la documentación que esperan sus auditores.",
    bullets: {
      riskRead: {
        title: "Una lectura del riesgo en directo",
        desc: "Clasificamos uno de sus sistemas reales durante la llamada, con artículos citados.",
      },
      gaps: {
        title: "Sus brechas de obligaciones",
        desc: "Vea exactamente qué queda pendiente y el plazo que se aplica.",
      },
      rollout: {
        title: "Implantación en la empresa",
        desc: "SSO, roles, residencia de datos en la UE y cómo adoptan los equipos Conforma.",
      },
    },
  },

  /* ---------------------------------------------------------------- demoForm */
  demoForm: {
    fullName: "Nombre completo",
    workEmail: "Correo del trabajo",
    company: "Empresa",
    role: "Su rol",
    systemsInScope: "Sistemas de IA en el alcance",
    anythingElse: "¿Algo que debamos saber?",
    placeholders: {
      name: "Ana García",
      email: "ana@empresa.com",
      company: "Empresa S.L.",
      message: "Su calendario, los sistemas que le preocupan, etc.",
    },
    roles: {
      compliance: "Cumplimiento / Jurídico",
      product: "IA / Producto",
      security: "Seguridad / TI",
      executive: "Dirección",
      other: "Otro",
    },
    submit: "Solicitar una demo",
    consent:
      "Nunca compartiremos sus datos. Al enviar el formulario, acepta que le contactemos en relación con Conforma.",
    success: {
      title: "¡Gracias, {name}!",
      nameFallback: "por su interés",
      body: "Un miembro de nuestro equipo se pondrá en contacto con {email} en un plazo de un día hábil para programar su sesión guiada.",
      emailFallback: "su correo",
      impatient: "¿No puede esperar? Puede ",
      impatientLink: "clasificar un sistema ahora mismo",
    },
  },

  /* ------------------------------------------------------------------- legal */
  terms: {
    eyebrow: "Legal",
    title: "Condiciones del servicio",
    effective: "En vigor desde el {date}",
    effectiveDate: "2026-06-24",
    sections: {
      agreement: {
        title: "1. Acuerdo",
        body: "Estas condiciones rigen su acceso y uso de Conforma (el «Servicio»). Al utilizar el Servicio, acepta estas condiciones. Si utiliza el Servicio en nombre de una organización, declara que cuenta con autorización para vincularla.",
      },
      service: {
        title: "2. El Servicio",
        body: "Conforma proporciona software para ayudar a las organizaciones a evaluar y documentar el cumplimiento del EU AI Act. Podemos actualizar, mejorar o modificar funciones con el tiempo.",
      },
      notAdvice: {
        title: "3. No es asesoramiento jurídico",
        body: "Conforma es una herramienta de apoyo a la decisión. Sus clasificaciones, listas de comprobación y documentos generados son informativos y **no** constituyen asesoramiento jurídico. Usted sigue siendo responsable de su cumplimiento y debe confirmar las clasificaciones con asesores cualificados.",
      },
      accounts: {
        title: "4. Cuentas y uso aceptable",
        body: "Usted es responsable de proteger su cuenta y de la actividad que se realice en ella. Se compromete a no hacer un uso indebido del Servicio, a no intentar interrumpirlo y a no utilizarlo para infringir ninguna ley o derecho de terceros.",
      },
      content: {
        title: "5. Su contenido",
        body: "Usted conserva todos los derechos sobre los datos que envía. Nos concede una licencia limitada para tratarlos únicamente con el fin de prestar el Servicio, tal como se describe en nuestra [Política de privacidad](/privacy).",
      },
      ip: {
        title: "6. Propiedad intelectual",
        body: "El Servicio, incluidos su software, diseño y contenido (excluidos sus datos), es propiedad de Conforma y está protegido por la legislación aplicable. Estas condiciones no le otorgan ningún derecho sobre nuestras marcas o identidad de marca.",
      },
      disclaimers: {
        title: "7. Exenciones de responsabilidad",
        body: "El Servicio se presta «tal cual», sin garantías de ningún tipo, en la máxima medida permitida por la ley. No garantizamos que el Servicio sea ininterrumpido ni que esté libre de errores, ni que sus resultados sean completos o jurídicamente suficientes para sus circunstancias específicas.",
      },
      liability: {
        title: "8. Limitación de responsabilidad",
        body: "En la máxima medida permitida por la ley, Conforma no será responsable de daños indirectos, incidentales o consecuentes, ni de sanciones regulatorias derivadas de su uso del Servicio.",
      },
      law: {
        title: "9. Legislación aplicable",
        body: "Estas condiciones se rigen por las leyes de Irlanda, sin atender a los principios de conflicto de leyes, y los tribunales de Irlanda tendrán jurisdicción exclusiva, salvo que su legislación local imperativa de consumo disponga otra cosa.",
      },
      changes: {
        title: "10. Cambios y contacto",
        body: "Podemos actualizar estas condiciones; los cambios sustanciales se notificarán con antelación. ¿Tiene preguntas? Escriba a [legal@conforma.eu](mailto:legal@conforma.eu).",
      },
    },
  },

  privacy: {
    eyebrow: "Legal",
    title: "Política de privacidad",
    effective: "En vigor desde el {date}",
    effectiveDate: "2026-06-24",
    sections: {
      overview: {
        title: "Introducción",
        body: "Conforma («nosotros») proporciona software que ayuda a las organizaciones a evaluar y documentar su cumplimiento del EU AI Act (Regulation (EU) 2024/1689). Esta política explica qué datos personales tratamos y las opciones de las que dispone. Nos comprometemos a tratar los datos personales de forma lícita conforme al Reglamento General de Protección de Datos (GDPR).",
      },
      dataWeProcess: {
        title: "Datos que tratamos",
        body: "- **Datos de cuenta y contacto**: nombre, correo del trabajo, empresa y rol, cuando crea una cuenta o solicita una demo.\n- **Datos de producto**: los registros de sistemas de IA, las clasificaciones y los documentos que crea en Conforma. Es su contenido; lo tratamos únicamente para prestar el servicio.\n- **Datos de uso y técnicos**: telemetría agregada y depurada (p. ej., eventos de error) que se utiliza para mantener la fiabilidad del servicio.",
      },
      howWeUse: {
        title: "Cómo usamos los datos",
        body: "Tratamos los datos personales para prestar y proteger el servicio, responder a consultas y cumplir nuestras obligaciones legales. **No** vendemos datos personales ni utilizamos el contenido de su producto para entrenar modelos de IA de terceros.",
      },
      legalBases: {
        title: "Bases jurídicas",
        body: "Según el contexto, nos basamos en la ejecución de un contrato (prestar el servicio), en nuestros intereses legítimos (proteger y mejorar el servicio), en su consentimiento (p. ej., marketing) y en el cumplimiento de obligaciones legales.",
      },
      residency: {
        title: "Residencia y conservación de datos",
        body: "Los datos de los clientes Enterprise se alojan en regiones de la UE. Conservamos los datos personales solo durante el tiempo necesario para prestar el servicio o según exija la ley, y los eliminamos o anonimizamos a petición. Consulte nuestra [Página de seguridad](/security) para conocer los detalles técnicos.",
      },
      subprocessors: {
        title: "Subencargados",
        body: "Utilizamos un conjunto reducido y verificado de subencargados sujetos a términos de protección de datos coherentes con esta política. La lista actual está publicada en nuestra [Página de seguridad](/security#subprocessors).",
      },
      rights: {
        title: "Sus derechos",
        body: "Conforme al GDPR, usted tiene derecho a acceder a sus datos personales, rectificarlos, suprimirlos, limitar su tratamiento y portarlos, así como a oponerse a determinados tratamientos. Para ejercer cualquiera de estos derechos, contacte con nosotros en [privacy@conforma.eu](mailto:privacy@conforma.eu). También tiene derecho a presentar una reclamación ante su autoridad de control local.",
      },
      contact: {
        title: "Contacto",
        body: "¿Tiene preguntas sobre esta política o sus datos? Escriba a [privacy@conforma.eu](mailto:privacy@conforma.eu).",
      },
    },
    footnote:
      "Esta página se ofrece con fines de transparencia sobre cómo el producto trata los datos y no constituye asesoramiento jurídico.",
  },

  /* ---------------------------------------------------------------- notFound */
  notFound: {
    code: "404",
    title: "Página no encontrada",
    body: "La página que busca no existe o se ha trasladado.",
    backHome: "Volver al inicio",
    classify: "Clasificar un sistema",
  },

  /* ---------------------------------------------------------------- appShell */
  app: {
    nav: {
      overview: "Resumen",
      classify: "Clasificar",
      reports: "Informes",
    },
    workspace: "Espacio de trabajo",
    account: "Cuenta",
    settings: "Configuración",
    helpDocs: "Ayuda y documentación",
    helpAria: "Ayuda y documentación",
    notifications: "Notificaciones",
    accountSettings: "Configuración de la cuenta",
    complianceClock: "Reloj de cumplimiento",
    untilHighRisk: "hasta que se apliquen las obligaciones de alto riesgo —",
    highRiskDate: "2 ago 2026",
    accountName: "Mohammad E.",
    accountPlan: "Acme AI · Pro",
    breadcrumb: {
      assessment: "Evaluación",
      classifyTitle: "Clasificar un sistema",
      reporting: "Informes",
      reportTitle: "Informe de preparación",
      registry: "Registro",
      systemDetail: "Detalle del sistema",
      workspace: "Espacio de trabajo",
      overview: "Resumen",
    },
  },

  /* ---------------------------------------------------------------- classify */
  classify: {
    steps: {
      basics: "Datos básicos",
      definition: "Definición",
      prohibited: "Prohibido",
      highRisk: "Alto riesgo",
      transparency: "Transparencia",
    },
    step0: {
      title: "Háblenos del sistema",
      sub: "Lo básico. Puede registrar sistemas que construye (proveedor) o sistemas que utiliza (responsable del despliegue).",
      nameLabel: "Nombre del sistema",
      namePlaceholder: "p. ej., modelo de cribado de CV",
      descLabel: "¿Qué hace?",
      descPlaceholder: "Breve descripción de su finalidad prevista.",
      roleLabel: "Su rol",
      roleProvider: "Proveedor (lo construimos)",
      roleDeployer: "Responsable del despliegue (lo usamos)",
      roleBoth: "Ambos",
      ownerLabel: "Responsable / equipo",
      ownerPlaceholder: "p. ej., Recursos Humanos",
    },
    step1: {
      title: "¿Es un sistema de IA?",
      sub: "El AI Act se aplica a los sistemas que infieren resultados a partir de entradas con cierta autonomía (Art. 3(1)).",
      isAi: "Cumple la definición de sistema de IA",
      isGpai: "Está construido sobre un modelo de IA de uso general (p. ej., un LLM)",
      isGpaiHint: "Activa obligaciones adicionales del proveedor de GPAI (Art. 53+).",
    },
    step2: {
      title: "¿Hace alguna de estas cosas?",
      sub: "Estas prácticas están prohibidas de plano conforme al Art. 5. Seleccione todas las que correspondan, o ninguna.",
    },
    step3: {
      title: "Casos de uso de alto riesgo",
      sub: "Los sistemas de alto riesgo soportan todo el peso del AI Act. Seleccione los que coincidan con la finalidad prevista del sistema.",
      annexI: "Es un componente de seguridad de un producto cubierto por la legislación armonizada de la UE (Annex I)",
      annexIHint: "p. ej., maquinaria, productos sanitarios, vehículos.",
      annexIIIHeading: "Áreas del Annex III",
      derogation:
        "Realiza únicamente una tarea procedimental limitada y no influye de forma sustancial en las decisiones",
      derogationHint:
        "La excepción del Art. 6(3): puede sacarlo del alto riesgo, pero debe documentar la evaluación.",
    },
    step4: {
      title: "Activadores de transparencia",
      sub: "Incluso fuera del alto riesgo, algunos usos conllevan deberes de información conforme al Art. 50.",
      interacts: "Interactúa directamente con personas (p. ej., un chatbot)",
      synthetic: "Genera audio, imagen, vídeo o texto sintéticos",
      deepfake: "Produce deepfakes",
      emotion: "Reconocimiento de emociones o categorización biométrica",
    },
    nav: {
      back: "Atrás",
      continue: "Continuar",
      seeClassification: "Ver clasificación",
    },
    provisional: "Nivel provisional:",
    result: {
      untitled: "Sistema sin título",
      plusGpai: "+ obligaciones de GPAI",
      whyTier: "Por qué este nivel",
      applicableDeadline: "Plazo aplicable",
      obligationsToSatisfy: plural({
        one: "{count} obligación por cumplir",
        other: "{count} obligaciones por cumplir",
      }),
      moreObligations: "+ {count} más: la lista completa tras guardar.",
      explain: "Explicar en lenguaje sencillo",
      aiExplanation: "Explicación de la IA",
      demoModeTag: "Modo Demo",
      demoModeTitle:
        "Muestra realista pregenerada. Añada una ANTHROPIC_API_KEY para cambiar a la redacción en directo y específica para cada sistema.",
      couldNotReach: "No se pudo conectar con el servicio de explicaciones.",
      editAnswers: "Editar respuestas",
      saveToRegistry: "Guardar en el registro",
      disclaimer:
        "Solo apoyo a la decisión — no constituye asesoramiento jurídico. Confirme con asesores cualificados.",
      viewDashboard: "Ver el panel",
    },
  },

  /* --------------------------------------------------------------- dashboard */
  dashboard: {
    eyebrow: "Gobernanza de la IA",
    title: "Registro de sistemas",
    subtitle:
      "Cada sistema de IA que construye o despliega, con su estado en directo conforme al Regulation (EU) 2024/1689.",
    exportReport: "Exportar informe",
    classifySystem: "Clasificar un sistema",
    kpi: {
      systems: "Sistemas registrados",
      systemsTip: "Sistemas de IA actualmente en su inventario.",
      systemsSub: "{count} de alto riesgo o prohibidos",
      compliance: "Cumplimiento de la cartera",
      complianceTip: "Proporción media de obligaciones aplicables marcadas como completadas.",
      complianceSub: "obligaciones cerradas, de media",
      highRisk: "Sistemas de alto riesgo",
      highRiskTip: "Sistemas del Annex III que soportan todos los deberes del Chapter III.",
      highRiskSub: "todas las obligaciones del Chapter III",
      nearest: "Plazo más próximo",
      nearestTip: "El plazo legal más próximo de toda su cartera.",
      nearestNoSystems: "aún no hay sistemas",
    },
    emptyTitle: "Todavía no hay sistemas registrados",
    emptyBody:
      "Clasifique su primer sistema de IA para ver exactamente qué le exige el EU AI Act, con artículos citados y una lista de obligaciones con seguimiento.",
    riskDistribution: "Distribución del riesgo",
    total: "{count} en total",
    systemsUnit: "sistemas",
    needsAttention: "Requiere atención",
    needsAttentionSub: "Mayor riesgo y menor grado de avance: revíselos primero.",
    toNearestDeadline: "hasta el plazo más próximo",
    unassigned: "Sin asignar",
    portfolioCompliance: "Cumplimiento de la cartera",
    viewFullReport: "Ver informe completo",
    allSystems: "Todos los sistemas",
    searchPlaceholder: "Buscar sistemas…",
    searchAria: "Buscar sistemas",
    filterAria: "Filtrar por nivel de riesgo",
    all: "Todos",
    sortAria: "Ordenar sistemas",
    sortRecent: "Más recientes",
    sortRisk: "Mayor riesgo",
    sortCompliance: "Menor cumplimiento",
    sortName: "Nombre (A–Z)",
    noMatches: "Sin coincidencias",
    noMatchesBody: "Pruebe otra búsqueda o borre los filtros.",
    clearFilters: "Borrar filtros",
    table: {
      system: "Sistema",
      risk: "Riesgo",
      owner: "Responsable",
      compliance: "Cumplimiento",
      deadline: "Plazo",
      open: "Abrir",
    },
    showing: "Mostrando {from}–{to} de {total}",
    prev: "Anterior",
    next: "Siguiente",
  },

  /* ------------------------------------------------------------------ report */
  report: {
    backDashboard: "Panel",
    printSave: "Imprimir / Guardar como PDF",
    reportTitle: "Informe de preparación para el cumplimiento del EU AI Act",
    generated: "Generado el {date}",
    regulation: "Regulation (EU) 2024/1689",
    executiveSummary: "Resumen ejecutivo",
    summary: {
      systems: "Sistemas",
      highRiskPlus: "Alto riesgo +",
      avgCompliance: "Cumplimiento medio",
      tiersInUse: "Niveles en uso",
    },
    riskDistribution: "Distribución del riesgo",
    systemRegister: "Registro de sistemas",
    table: {
      system: "Sistema",
      risk: "Riesgo",
      owner: "Responsable",
      outstanding: "Pendiente",
      compliance: "Cumplimiento",
    },
    noSystems: "No hay sistemas registrados.",
    footer:
      "Este informe lo genera Conforma como apoyo a la decisión para el Regulation (EU) 2024/1689. No constituye asesoramiento jurídico. Las clasificaciones deben confirmarse con asesores cualificados antes de basarse en ellas.",
  },

  /* ------------------------------------------------------------------ system */
  system: {
    backRegistry: "Registro",
    notFoundTitle: "Sistema no encontrado",
    notFoundBody:
      "Es posible que se haya eliminado o que se guardara en otro navegador. Su registro se almacena localmente en este dispositivo.",
    backToDashboard: "Volver al panel",
    plusGpai: "+ GPAI",
    meta: {
      tier: "Nivel",
      role: "Rol",
      owner: "Responsable",
      deadline: "Plazo",
    },
    unassigned: "Sin asignar",
    compliance: "Cumplimiento",
    rationaleTitle: "Fundamento de la clasificación",
    obligationsTitle: "Lista de obligaciones",
    obligationsHint: "Toque un estado para alternar: Por hacer → En curso → Hecho.",
    states: {
      todo: "Por hacer",
      inProgress: "En curso",
      done: "Hecho",
    },
    classifyAnother: "Clasificar otro sistema",
    deleteSystem: "Eliminar sistema",
    deleteConfirm: "¿Eliminar «{name}» del registro?",
    docs: {
      title: "Documentos de cumplimiento",
      hint: "Genere borradores iniciales de documentos regulatorios adaptados a este sistema, luego previsualícelos y expórtelos a Markdown, Word o PDF.",
      types: {
        technical: { label: "Documentación técnica", cite: "Annex IV / Art. 11" },
        transparency: { label: "Aviso de transparencia", cite: "Art. 50" },
        conformity: { label: "Declaración de conformidad", cite: "Art. 47" },
      },
      drafting: "Redactando {label}…",
      preview: "Vista previa",
      markdown: "Markdown",
      copy: "Copiar",
      copied: "¡Copiado!",
      couldNotGenerate: "No se pudo generar este documento. Inténtelo de nuevo.",
    },
  },

  /* -------------------------------------------------------------- landingDemo */
  landingDemo: {
    pickSystem: "Elija un sistema",
    builtOnGpai: "Construido sobre un modelo de uso general",
    builtOnGpaiHint: "Añade deberes del proveedor de GPAI (Art. 53+)",
    liveClassification: "Clasificación en directo",
    plusGpai: "+ GPAI",
    obligations: "Obligaciones",
    deadline: "Plazo",
    runFull: "Ejecutar el clasificador completo de 5 pasos",
    scenarios: {
      employment: { label: "Cribado de CV", hint: "Clasifica a los candidatos" },
      credit: { label: "Calificación crediticia", hint: "Evalúa la solvencia" },
      chatbot: { label: "Chatbot de soporte", hint: "Habla con los clientes" },
      deepfake: { label: "Estudio de deepfakes", hint: "Genera medios sintéticos" },
      social: { label: "Puntuación social", hint: "Clasifica a los ciudadanos por su conducta" },
      forecast: { label: "Previsión de demanda", hint: "Predice las necesidades de inventario" },
    },
  },

  /* ----------------------------------------------------------------- aiSource */
  ai: {
    demoBadge: "Modo Demo · salida de IA de muestra",
    demoBadgeTitle:
      "No hay configurada ninguna clave de API de Anthropic, por lo que la generación con IA se ejecuta en Modo Demo: documentos de muestra realistas y pregenerados. No se requiere ninguna API de pago.",
    draftedByClaude: "Redactado por Claude",
    aiDraftDemo: "Borrador de IA · Modo Demo",
    aiDraftDemoTitle:
      "Muestra realista pregenerada. Añada una ANTHROPIC_API_KEY para cambiar a la redacción en directo y específica para cada sistema.",
    couldNotGenerate: "No se pudo generar; inténtelo de nuevo.",
    docLabels: {
      technical: "Documentación técnica (Annex IV)",
      transparency: "Aviso de transparencia (Art. 50)",
      conformity: "Declaración de conformidad de la UE (Art. 47)",
    },
    /** Plain-language narrative, composed from these fragments per locale. */
    narrative: {
      intro:
        "«{system}» se ha clasificado como {tier} conforme al Regulation (EU) 2024/1689. {reasons} En la práctica, esto significa {summary}{gpai}",
      gpai: " Dado que está construido sobre un modelo de IA de uso general, los deberes del proveedor de GPAI del Art. 53 se aplican además del nivel anterior: mantenga lista la documentación técnica del modelo y un resumen de los datos de entrenamiento.",
      nextStep:
        "El siguiente paso más urgente es {step}. El plazo que importa aquí es {deadline} — {date} —, tras el cual las obligaciones pasan a ser exigibles. El incumplimiento puede acarrear sanciones de hasta {penalty} o el {pct} % del volumen de negocio anual mundial, la cifra que sea mayor ({citation}).",
      closing:
        "Trate la lista de obligaciones de abajo como su análisis de brechas: asigne un responsable a cada elemento, recopile las pruebas que demuestran que lo cumple y cierre todo lo que siga pendiente con suficiente antelación al plazo. Nada de esto constituye asesoramiento jurídico: confirme la clasificación final y su plan de subsanación con asesores cualificados.",
      steps: {
        prohibited:
          "dejar de introducir el sistema en el mercado o ponerlo en servicio, porque la práctica está prohibida de plano conforme al Art. 5",
        high: "poner en marcha el proceso de gestión de riesgos del Art. 9 y empezar el expediente técnico del Annex IV, ya que condicionan la evaluación de la conformidad que debe superar antes del plazo",
        limited:
          "implementar las obligaciones de información del Art. 50: informe a las personas de que están tratando con una IA y etiquete de forma legible por máquina todo contenido sintético",
        minimal:
          "registrar esta evaluación en su inventario de IA y mantenerla en revisión, ya que los cambios en la finalidad prevista pueden mover el sistema a un nivel superior",
      },
    },
    /** Used to instruct Claude to write in the visitor's language (live mode). */
    promptLanguage: "español",
  },

  /* ------------------------------------------------------------- classifier */
  classifier: {
    notAISystem:
      "El sistema no cumple la definición de «sistema de IA» del Art. 3(1), por lo que no se aplican las obligaciones del AI Act a nivel de sistema.",
    prohibitedMatch: "Coincide con una práctica prohibida: {practice}.",
    annexIMatch:
      "La IA es un componente de seguridad de un producto cubierto por la legislación armonizada de la UE enumerada en el Annex I, o es en sí misma ese producto, y requiere una evaluación de la conformidad por un tercero.",
    annexIIIMatch: "La finalidad prevista entra dentro de un área de alto riesgo: {area}.",
    derogation:
      "Ha indicado que el sistema realiza únicamente una tarea procedimental o preparatoria limitada y que no influye de forma sustancial en el resultado de las decisiones. Conforme a la excepción del Art. 6(3), podría quedar fuera del alto riesgo, pero debe documentar esta evaluación y registrar igualmente el sistema.",
    transparencyMatch: "El sistema {trigger}, lo que activa deberes de transparencia.",
    transparencyTriggers: {
      interacts: "interactúa directamente con personas",
      synthetic: "genera audio/imagen/vídeo/texto sintéticos",
      deepfake: "produce deepfakes",
      emotion: "realiza reconocimiento de emociones o categorización biométrica",
    },
    minimalDefault:
      "No se identificó ninguna práctica prohibida, caso de uso de alto riesgo ni activador de transparencia. El sistema entra en la categoría de riesgo mínimo.",
    gpaiOverlay:
      "El sistema está construido sobre un modelo de IA de uso general, por lo que las obligaciones del proveedor de GPAI se aplican además del nivel del sistema indicado arriba.",
  },

  /* ------------------------------------------------------------------ domain */
  domain: {
    roles: {
      provider: "Proveedor",
      deployer: "Responsable del despliegue",
      both: "Ambos",
    },
    riskTiers: {
      prohibited: {
        label: "Riesgo inaceptable — Prohibido",
        short: "Prohibido",
        summary:
          "La práctica está prohibida en la UE. No puede introducirse en el mercado, ponerse en servicio ni utilizarse. Seguir usándola lo expone a las sanciones más altas.",
      },
      high: {
        label: "Alto riesgo",
        short: "Alto riesgo",
        summary:
          "Solo se permite si cumple el conjunto completo de obligaciones del Chapter III antes de su introducción en el mercado: gestión de riesgos, gobernanza de datos, documentación técnica, registro de eventos, transparencia, supervisión humana, exactitud y ciberseguridad, además de una evaluación de la conformidad y la inscripción en la base de datos de la UE.",
      },
      limited: {
        label: "Riesgo limitado — Transparencia",
        short: "Limitado",
        summary:
          "Permitido en gran medida, pero se aplican deberes específicos de transparencia: debe informarse a las personas de que interactúan con una IA, y el contenido sintético o manipulado debe etiquetarse de forma legible por máquina.",
      },
      minimal: {
        label: "Riesgo mínimo",
        short: "Mínimo",
        summary:
          "Sin obligaciones obligatorias conforme al AI Act. Se fomentan los códigos de conducta voluntarios. Siguen aplicándose los deberes de alfabetización en IA (Art. 4) y la legislación general de productos.",
      },
    },
    prohibited: {
      subliminal: {
        title: "Técnicas subliminales o manipuladoras",
        description:
          "Emplea técnicas subliminales, deliberadamente manipuladoras o engañosas que distorsionan de forma sustancial el comportamiento y causan (o es probable que causen) un perjuicio significativo.",
      },
      vulnerability: {
        title: "Explotación de vulnerabilidades",
        description:
          "Explota vulnerabilidades debidas a la edad, la discapacidad o una situación social o económica concreta para distorsionar el comportamiento y causar un perjuicio significativo.",
      },
      "social-scoring": {
        title: "Puntuación social",
        description:
          "Evalúa o clasifica a las personas a lo largo del tiempo en función de su comportamiento social o de rasgos personales, dando lugar a un trato perjudicial en contextos no relacionados o que resulta injustificado o desproporcionado.",
      },
      "predictive-policing": {
        title: "Vigilancia policial predictiva individual",
        description:
          "Evalúa el riesgo de que una persona cometa un delito basándose únicamente en la elaboración de perfiles o en rasgos de personalidad.",
      },
      "facial-scraping": {
        title: "Extracción no selectiva de imágenes para reconocimiento facial",
        description:
          "Crea o amplía bases de datos de reconocimiento facial mediante la extracción no selectiva de imágenes faciales de internet o de circuitos cerrados de televisión (CCTV).",
      },
      "emotion-work-edu": {
        title: "Reconocimiento de emociones en el trabajo o en la educación",
        description:
          "Infiere las emociones de las personas en el lugar de trabajo o en centros educativos (salvo por motivos médicos o de seguridad).",
      },
      "biometric-categorization": {
        title: "Categorización biométrica sensible",
        description:
          "Clasifica a las personas en función de datos biométricos para deducir su raza, opiniones políticas, afiliación sindical, religión, vida sexual u orientación sexual.",
      },
      rbi: {
        title: "Identificación biométrica remota en tiempo real",
        description:
          "Utiliza identificación biométrica remota «en tiempo real» en espacios de acceso público con fines de aplicación de la ley (sujeta a excepciones limitadas y autorizadas).",
      },
    },
    annexIII: {
      biometrics: {
        title: "Biometría",
        examples:
          "Identificación biométrica remota, categorización biométrica por atributos sensibles, reconocimiento de emociones (cuando no esté prohibido).",
      },
      "critical-infrastructure": {
        title: "Infraestructuras críticas",
        examples:
          "Componentes de seguridad en la gestión y operación de infraestructuras digitales críticas, el tráfico rodado o el suministro de agua, gas, calefacción y electricidad.",
      },
      education: {
        title: "Educación y formación profesional",
        examples:
          "Decisiones de admisión, evaluación de los resultados del aprendizaje, valoración del nivel educativo adecuado, vigilancia y detección de conductas prohibidas durante los exámenes.",
      },
      employment: {
        title: "Empleo y gestión de los trabajadores",
        examples:
          "Contratación y selección, anuncios de empleo dirigidos, cribado de candidaturas, decisiones de promoción y despido, asignación de tareas, seguimiento del rendimiento.",
      },
      "essential-services": {
        title: "Acceso a servicios esenciales",
        examples:
          "Elegibilidad para ayudas y prestaciones públicas, solvencia y calificación crediticia, evaluación de riesgos y fijación de precios en seguros de vida y de salud, despacho de emergencias.",
      },
      "law-enforcement": {
        title: "Aplicación de la ley",
        examples:
          "Evaluación del riesgo de delinquir o reincidir o de ser víctima, polígrafos, valoración de la fiabilidad de las pruebas, elaboración de perfiles durante las investigaciones.",
      },
      migration: {
        title: "Migración, asilo y control fronterizo",
        examples:
          "Polígrafos, evaluaciones del riesgo de migración irregular, de seguridad o de salud, examen de solicitudes de asilo y de visado, detección e identificación de personas.",
      },
      justice: {
        title: "Justicia y procesos democráticos",
        examples:
          "Asistencia a las autoridades judiciales en la investigación e interpretación de los hechos y del derecho; influencia en el resultado de elecciones o referendos o en el comportamiento electoral.",
      },
    },
    obligations: {
      "risk-management": {
        title: "Sistema de gestión de riesgos",
        description:
          "Establecer, documentar y mantener un proceso de gestión de riesgos continuo e iterativo a lo largo de todo el ciclo de vida del sistema.",
      },
      "data-governance": {
        title: "Datos y gobernanza de datos",
        description:
          "Los datos de entrenamiento, validación y prueba deben cumplir criterios de calidad: pertinentes, representativos, exentos de errores y examinados en busca de sesgos.",
      },
      "technical-documentation": {
        title: "Documentación técnica",
        description:
          "Elaborar y mantener actualizada la documentación técnica que demuestra la conformidad (el expediente del Annex IV).",
      },
      "record-keeping": {
        title: "Conservación de registros (logs)",
        description:
          "Registrar automáticamente los eventos («logs») durante toda la vida del sistema para garantizar la trazabilidad de su funcionamiento.",
      },
      "transparency-deployers": {
        title: "Transparencia hacia los responsables del despliegue",
        description:
          "Diseñar el sistema con suficiente transparencia y proporcionar instrucciones de uso que permitan a los responsables del despliegue interpretar el resultado y utilizarlo adecuadamente.",
      },
      "human-oversight": {
        title: "Supervisión humana",
        description:
          "Diseñar el sistema de modo que pueda ser supervisado eficazmente por personas, incluida la capacidad de detenerlo o anularlo y la conciencia del sesgo de automatización.",
      },
      "accuracy-robustness": {
        title: "Exactitud, solidez y ciberseguridad",
        description:
          "Alcanzar niveles adecuados de exactitud, solidez y ciberseguridad, coherentes y resistentes frente a errores y ataques adversarios.",
      },
      qms: {
        title: "Sistema de gestión de la calidad",
        description:
          "Implantar un sistema de gestión de la calidad documentado que cubra los procesos, procedimientos y responsabilidades de cumplimiento.",
      },
      "conformity-assessment": {
        title: "Evaluación de la conformidad",
        description:
          "Someterse al procedimiento de evaluación de la conformidad pertinente antes de introducir el sistema en el mercado o ponerlo en servicio.",
      },
      "ce-doc": {
        title: "Declaración de conformidad de la UE y marcado CE",
        description:
          "Elaborar la declaración de conformidad de la UE y colocar el marcado CE que indica la conformidad con el Reglamento.",
      },
      "eu-registration": {
        title: "Inscripción en la base de datos de la UE",
        description:
          "Inscribir el sistema de alto riesgo en la base de datos de la UE antes de introducirlo en el mercado o ponerlo en servicio.",
      },
      "use-per-instructions": {
        title: "Uso conforme a las instrucciones y asignación de supervisión",
        description:
          "Utilizar el sistema de acuerdo con las instrucciones, asignar una supervisión humana competente y garantizar que los datos de entrada sean pertinentes.",
      },
      monitoring: {
        title: "Seguimiento y notificación",
        description:
          "Supervisar el funcionamiento, suspender el uso e informar al proveedor o a la autoridad sobre incidentes o riesgos graves; conservar los registros generados automáticamente.",
      },
      fria: {
        title: "Evaluación de impacto sobre los derechos fundamentales",
        description:
          "Los organismos públicos y determinados responsables del despliegue privados (p. ej., banca, seguros) deben completar una evaluación de impacto sobre los derechos fundamentales antes del uso.",
      },
      "inform-affected": {
        title: "Informar a las personas afectadas",
        description:
          "Cuando el sistema tome o asista en decisiones sobre personas, informe a esas personas de que están sujetas a su uso.",
      },
      "disclose-chatbot": {
        title: "Informar de la interacción con IA",
        description:
          "Debe informarse a las personas de que están interactuando con un sistema de IA, salvo que resulte evidente por el contexto.",
      },
      "label-synthetic": {
        title: "Marcar el contenido sintético",
        description:
          "El audio, la imagen, el vídeo o el texto generados por IA deben marcarse en un formato legible por máquina como generados o manipulados artificialmente.",
      },
      "label-deepfake": {
        title: "Informar de los deepfakes",
        description:
          "Los responsables del despliegue de sistemas que generan deepfakes deben revelar que el contenido se ha generado o manipulado artificialmente.",
      },
      "emotion-disclosure": {
        title: "Informar del reconocimiento de emociones o categorización biométrica",
        description:
          "Los responsables del despliegue de sistemas de reconocimiento de emociones o de categorización biométrica deben informar a las personas expuestas a ellos.",
      },
      "gpai-techdoc": {
        title: "Documentación técnica del modelo",
        description:
          "Elaborar y mantener la documentación técnica del modelo, incluido el proceso de entrenamiento y prueba y los resultados de su evaluación.",
      },
      "gpai-downstream": {
        title: "Información a los proveedores posteriores",
        description:
          "Proporcionar información y documentación a los proveedores posteriores que integran el modelo en sus sistemas de IA.",
      },
      "gpai-copyright": {
        title: "Política de derechos de autor y resumen de los datos de entrenamiento",
        description:
          "Implantar una política para cumplir la legislación de la UE en materia de derechos de autor y publicar un resumen suficientemente detallado del contenido de entrenamiento.",
      },
      "gpai-systemic": {
        title: "Obligaciones por riesgo sistémico",
        description:
          "Los modelos con riesgo sistémico deben, además, realizar evaluaciones del modelo, pruebas adversarias, seguimiento de incidentes y protección de ciberseguridad.",
      },
    },
    deadlines: {
      force: {
        label: "El Reglamento entra en vigor",
        description:
          "El AI Act entra en vigor; comienza a contar el calendario de aplicación escalonada.",
      },
      prohibitions: {
        label: "Se aplican las prácticas prohibidas y la alfabetización en IA",
        description:
          "Las prohibiciones del Art. 5 pasan a ser aplicables, junto con el deber de alfabetización en IA (Art. 4).",
      },
      gpai: {
        label: "Se aplican GPAI, gobernanza y sanciones",
        description:
          "Pasan a ser aplicables las obligaciones para los modelos de IA de uso general, el marco de gobernanza y el régimen sancionador.",
      },
      "high-risk-annex-iii": {
        label: "Se aplican alto riesgo (Annex III) y transparencia",
        description:
          "Las obligaciones principales de alto riesgo para los sistemas del Annex III y los deberes de transparencia del Art. 50 pasan a ser aplicables. Este es el plazo hacia el que corre la mayoría de las organizaciones.",
      },
      "high-risk-annex-i": {
        label: "Se aplica el alto riesgo (productos regulados)",
        description:
          "Las obligaciones de alto riesgo para la IA que es un componente de seguridad de productos ya cubiertos por la legislación armonizada de la UE (Annex I) pasan a ser aplicables.",
      },
    },
  },

  /* ---------------------------------------------------------------- metadata */
  metadata: {
    root: {
      titleDefault: "Conforma — Cumplimiento del EU AI Act, automatizado",
      titleTemplate: "%s · Conforma",
      description:
        "Conforma es la plataforma de cumplimiento para el EU AI Act. Inventaríe sus sistemas de IA, clasifique automáticamente su riesgo con artículos citados, cierre brechas de obligaciones y genere documentación lista para auditoría antes del plazo de agosto de 2026.",
      ogTitle: "Conforma — Cumplimiento del EU AI Act, automatizado",
      ogDescription:
        "Clasifique automáticamente sus sistemas de IA, cierre brechas de obligaciones y genere documentación lista para auditoría antes del plazo de agosto de 2026 del EU AI Act.",
      twitterTitle: "Conforma — Cumplimiento del EU AI Act, automatizado",
      twitterDescription:
        "La plataforma de cumplimiento para el EU AI Act. Clasifique, cierre brechas y genere documentación antes de agosto de 2026.",
    },
    pricing: {
      title: "Precios",
      description:
        "Precios sencillos y transparentes para el cumplimiento del EU AI Act. Empiece gratis y escale a sistemas ilimitados con SSO, registros de auditoría y residencia de datos en la UE en el plan Enterprise.",
    },
    security: {
      title: "Seguridad y confianza",
      description:
        "Cómo protege Conforma sus datos: residencia de datos en la UE, cifrado en tránsito y en reposo, SSO/SAML, acceso basado en roles, registro de auditoría, transparencia de subencargados y un DPA personalizado.",
    },
    demo: {
      title: "Reservar una demo",
      description:
        "Vea cómo Conforma clasifica sus sistemas de IA conforme al EU AI Act, cierra brechas de obligaciones y genera documentación lista para auditoría. Reserve una sesión guiada de 30 minutos.",
    },
    terms: {
      title: "Condiciones del servicio",
      description:
        "Las condiciones que rigen el uso de Conforma, incluidos el alcance del servicio, la exención de asesoramiento jurídico, el uso aceptable y la responsabilidad.",
    },
    privacy: {
      title: "Política de privacidad",
      description:
        "Cómo Conforma recopila, utiliza y protege los datos personales, sus derechos conforme al GDPR, la residencia de datos, la conservación y nuestros subencargados.",
    },
    classify: {
      title: "Clasificar un sistema de IA",
      description:
        "Responda unas preguntas y obtenga una clasificación de riesgo del EU AI Act con artículos citados, las obligaciones aplicables y su plazo de cumplimiento, en 30 segundos.",
    },
    dashboard: { title: "Panel" },
    report: { title: "Informe de preparación para el cumplimiento" },
    system: { title: "Sistema de IA" },
  },

  /* ---------------------------------------------------------- opengraph image */
  og: {
    alt: "Conforma — Cumplimiento del EU AI Act, automatizado",
    title: "Cumplimiento del EU AI Act, en piloto automático",
    subtitle:
      "Clasifique sus sistemas de IA, cierre brechas de obligaciones y genere documentación lista para auditoría.",
    badge: "Las obligaciones de alto riesgo se aplican el 2 ago 2026",
    regulation: "Regulation (EU) 2024/1689",
  },
};

export default es;
