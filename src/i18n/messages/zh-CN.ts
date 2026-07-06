import type { Messages } from "./index";
import { plural } from "./_types";

const zhCN: Messages = {
  /* ------------------------------------------------------------------ common */
  common: {
    brand: "Conforma",
    euAiAct: "EU AI Act",
    regulation: "Regulation (EU) 2024/1689",
    startFree: "免费开始",
    bookDemo: "预约演示",
    talkToSales: "联系销售",
    exploreDemo: "探索实时仪表板",
    back: "返回",
    continue: "继续",
    optional: "（可选）",
    yes: "是",
    no: "否",
    thinking: "思考中……",
    loading: "加载中……",
    dash: "—",
    daysLeft: plural({
      other: "剩余 {count} 天",
    }),
    deadlinePassed: "截止日期已过",
    cancel: "取消",
    delete: "删除",
    notLegalAdvice:
      "面向 Regulation (EU) 2024/1689 的决策支持工具——不构成法律意见。请与具备资质的法律顾问确认分类结果。",
  },

  /* ------------------------------------------------------------ languageSwitcher */
  languageSwitcher: {
    label: "语言",
    change: "切换语言",
    selected: "已选语言：{language}",
  },

  /* -------------------------------------------------------------- themeToggle */
  themeToggle: {
    label: "切换主题",
    toLight: "切换到浅色模式",
    toDark: "切换到深色模式",
  },

  /* --------------------------------------------------------------------- nav */
  nav: {
    howItWorks: "工作原理",
    security: "安全",
    pricing: "定价",
    dashboard: "控制台",
    bookDemo: "预约演示",
    startFree: "免费开始",
    menu: "菜单",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    skipToContent: "跳至正文",
  },

  /* ------------------------------------------------------------------ footer */
  footer: {
    tagline:
      "面向 EU AI Act 的合规平台。无需组建合规团队，即可完成分类、弥合差距并证明符合性。",
    columns: {
      product: {
        title: "产品",
        riskClassifier: "风险分类器",
        aiRegistry: "AI 系统登记册",
        pricing: "定价",
        bookDemo: "预约演示",
      },
      trust: {
        title: "信任",
        security: "安全",
        dataResidency: "数据驻留",
        subprocessors: "次级处理者",
      },
      company: {
        title: "公司",
        howItWorks: "工作原理",
        faq: "常见问题",
        contactSales: "联系销售",
      },
      legal: {
        title: "法律",
        terms: "服务条款",
        privacy: "隐私政策",
        dataProcessing: "数据处理",
      },
    },
    rights: "© {year} Conforma. 保留所有权利。",
    disclaimer:
      "面向 Regulation (EU) 2024/1689 的决策支持工具——不构成法律意见。请与具备资质的法律顾问确认分类结果。",
    builtBy: "设计与构建者",
    portfolioNote: "一个独立的作品集项目，展示生产级全栈工程能力。",
    caseStudy: "案例研究",
    hireCta: "可承接工作",
  },

  /* ------------------------------------------------------------ announcement */
  announcement: {
    prefix: "高风险义务已适用",
    cta: "评估您的合规敞口",
    dismiss: "关闭",
  },

  /* -------------------------------------------------------------------- home */
  home: {
    hero: {
      badge: "高风险义务已适用",
      titleLine1: "EU AI Act 合规，",
      titleAccent: "全程自动",
      subtitle:
        "Conforma 为您的 AI 系统建立清单，依据具体条款自动判定其风险等级，弥合每一项义务差距，并生成监管机构所期望的文档——无需聘请合规团队。",
      fineprint:
        "无需信用卡 · 30 秒完成分类 · 数分钟内满足审计要求",
      trustEyebrow: "对齐审计方所期望的各项框架",
    },
    showcase: {
      url: "app.conforma.eu/dashboard",
      registryTitle: "AI 系统登记册",
      registrySub: "3 个系统 · 1 个高风险",
      classify: "分类",
      stats: {
        systems: "系统",
        compliance: "合规度",
        nearest: "最近期限",
      },
      table: {
        system: "系统",
        risk: "风险",
        owner: "负责人",
        compliance: "合规度",
      },
      owners: {
        peopleOps: "人力运营",
        support: "客户支持",
        supplyChain: "供应链",
      },
    },
    stats: {
      fine: { value: "€35M", label: "违禁 AI 的最高罚款", sub: "或营业额的 7%" },
      areas: { value: "8", label: "个高风险应用领域", sub: "Annex III" },
      deadline: { value: "2026 年 8 月", label: "多数主体面临的期限", sub: "Art. 113" },
      states: { value: "27", label: "个欧盟成员国", sub: "同一部法规" },
    },
    interactiveDemo: {
      eyebrow: "交互式演示",
      title: "立即对一个系统进行分类",
      subtitle:
        "无需注册。在下方选择一个系统，实时观看确定性引擎判定其风险等级、引用相关条款并统计义务数量。",
    },
    problem: {
      eyebrow: "问题所在",
      title: "如今每家公司都在交付 AI，却几乎无人能证明其合规。",
      p1: "EU AI Act 是全球首部全面的人工智能法律，其适用范围覆盖任何 AI 触及欧盟市场的组织——无论其总部位于何处。然而，如今的合规工作意味着一名律师、一份电子表格，以及数周时间去交叉比对一部长达百页的法规。",
      p2: "Conforma 将这一切转化为引导式工作流：为每个系统回答几个问题，即可获得有据可依的分类结果，并带着所需的证据与文档离开。",
      code: {
        comment: "# 对一个系统进行分类",
        result: "→ 高风险",
        obligations: "11 项提供者义务 · Art. 9–49",
        deadlineLabel: "截止日期：",
        drafted: "✓ 文档已起草",
      },
    },
    personas: {
      eyebrow: "为每个团队打造",
      title: "为每一位负有责任的人提供统一的事实依据",
      subtitle:
        "AI Act 的责任并不只落在某一个团队身上。Conforma 为每一位利益相关方提供同一份有据可依的记录。",
      items: {
        legal: {
          role: "法务与合规",
          desc: "无需手动研读法规，即可获得有据可依、附引用的分类结果与可审计的记录链。",
        },
        product: {
          role: "AI 与产品团队",
          desc: "在发布前即了解每个模型的合规要求，让合规不再成为阻碍产品路线图的瓶颈。",
        },
        security: {
          role: "安全与 IT 负责人",
          desc: "将组织内每一个 AI 系统、其风险等级及证据统一汇集于单一登记册。",
        },
      },
    },
    tiers: {
      title: "四个风险等级，一个明确答案。",
      subtitle:
        "本法将每个 AI 系统归入相应的风险等级——而等级决定了您必须履行的义务。Conforma 为您判定所属等级，并附上引用依据。",
    },
    how: {
      title: "四步走，从一无所知到满足审计要求",
      steps: {
        register: {
          title: "登记",
          desc: "将每个 AI 系统加入您的登记册——无论是自建、采购，还是嵌入于产品之中。",
        },
        classify: {
          title: "分类",
          desc: "引导式问卷将系统映射至相应的风险等级，并附上引用条款。无需律师参与。",
        },
        closeGaps: {
          title: "弥合差距",
          desc: "以可追踪的清单逐项落实该等级对应的具体义务，明确负责人与状态。",
        },
        generate: {
          title: "生成文档",
          desc: "一键起草技术文档、透明度声明与合格声明。",
        },
      },
    },
    timeline: {
      eyebrow: "时间紧迫",
      title: "EU AI Act 适用时间表",
      subtitle:
        "根据 Art. 113，各项义务分阶段生效。Conforma 跟踪每一个里程碑，确保万无一失。",
      inForce: "已生效",
    },
    features: {
      title: "证明符合性所需的一切",
      subtitle:
        "一套完整的工具——从附引用的分类，到满足审计要求的文档。",
      items: {
        cited: {
          title: "有据可依，而非凭感觉",
          desc: "每一项分类与义务都链接至 Regulation (EU) 2024/1689 的具体条款或附件——在审计中经得起推敲。",
        },
        annexIII: {
          title: "覆盖 Annex III",
          desc: "已编码全部 {count} 个高风险领域——从就业、信用评分到生物识别与执法。",
        },
        drafted: {
          title: "AI 起草的文档",
          desc: "Claude 为每个系统量身起草 Annex IV 技术文件、Art. 50 透明度声明及欧盟合格声明。",
        },
        deadlines: {
          title: "期限跟踪",
          desc: "对每个分阶段适用日期进行实时倒计时，确保不错过 2026 年 8 月 2 日或 2027 年的任何节点。",
        },
        roles: {
          title: "提供者与部署者",
          desc: "义务按您的角色划分——无论您是构建系统者，还是仅部署他人系统者。",
        },
        gpai: {
          title: "GPAI 感知",
          desc: "在系统层级风险等级之外，额外标记通用人工智能模型义务（Art. 53+）。",
        },
      },
    },
    comparison: {
      title: "成本仅为其他方案的零头",
      conforma: "Conforma",
      lawFirm: "律师事务所",
      spreadsheet: "电子表格",
      rows: {
        cited: "附引用的风险分类",
        continuous: "持续进行，而非一次性",
        drafted: "AI 起草的文档",
        registry: "覆盖全组合的登记册",
        cost: "成本",
      },
      values: {
        manual: "手动",
        conformaCost: "€149/月",
        lawFirmCost: "€10k+/次审计",
        spreadsheetCost: "€0 + 风险",
      },
    },
    testimonials: {
      title: "为负有责任的团队而打造",
      note: "此为早期访问阶段目标客户的示意性描述。",
      items: {
        one: {
          quote:
            "我们从一个 40 个标签页的电子表格，转向了一个让审计方真正信赖的统一登记册。附引用的分类结果，正是打动我们总法律顾问的关键。",
          name: "合规负责人",
          company: "B2B SaaS · 200 名员工",
        },
        two: {
          quote:
            "我们的产品团队终于可以在发布前自助获取风险判定，而不必等待法务两周。仅凭这一点就物有所值。",
          name: "产品副总裁",
          company: "金融科技高速成长企业",
        },
        three: {
          quote:
            "生成的 Annex IV 草稿为我们的外部法律顾问节省了数天工作量。我们将 Conforma 作为 AI 治理的权威记录系统。",
          name: "数据保护官（DPO）",
          company: "医疗健康平台",
        },
      },
    },
    penalty: {
      title: "做错的代价",
      subtitle:
        "根据 Art. 99，罚款取固定上限与全球年营业额一定比例两者中的较高者。",
      orTurnover: "或营业额的 {pct}%",
      labels: {
        prohibited: "违禁用途",
        highRisk: "高风险违规",
        misleadingInfo: "提供误导信息",
      },
    },
    security: {
      eyebrow: "面向企业",
      title: "内建安全与治理",
      body: "欧盟数据驻留、传输中与静态加密、SSO/SAML、基于角色的访问控制、审计日志以及定制 DPA。您的合规工具自身也理应合规。",
      cta: "了解我们的安全措施",
      badges: {
        residency: "欧盟数据驻留",
        encryption: "静态与传输加密",
        sso: "SSO / SAML",
        rbac: "基于角色的访问控制",
        audit: "审计日志",
        dpa: "定制 DPA",
      },
    },
    pricing: {
      title: "比合规顾问聘用费更划算的定价",
      subtitle:
        "律师事务所一次高风险审计的费用，便超过 Conforma 一整年。免费开始，规模扩大时再升级。",
    },
    faq: {
      title: "常见问题",
      items: {
        scope: {
          q: "如果我们不在欧盟，EU AI Act 是否适用于我们？",
          a: "只要您的 AI 系统投放于欧盟市场，或其输出在欧盟境内被使用，无论贵公司总部位于何处，本法都适用——这与 GDPR 颇为相似。Conforma 可帮助任何全球团队厘清其合规敞口。",
        },
        advice: {
          q: "Conforma 是否构成法律意见？",
          a: "不构成。Conforma 是一款决策支持工具，将法规编码为带引用的结构化工作流。它能大幅减少工作量，但您仍应与具备资质的法律顾问确认分类结果。",
        },
        deadline: {
          q: "2026 年 8 月的截止日期是什么？",
          a: "根据 Art. 113，高风险系统（Annex III）的核心义务以及 Art. 50 的透明度义务将于 2026 年 8 月 2 日开始适用——这是多数组织正争分夺秒赶赴的期限。",
        },
        accuracy: {
          q: "分类的准确性如何？",
          a: "分类基于一套直接映射至法规条文的确定性决策树运行，因此每一项结果都可追溯至具体条款。AI 仅用于起草文档与解释说明，绝不会推翻附引用的判定逻辑。",
        },
        data: {
          q: "我们的数据存储在何处？",
          a: "企业版方案在欧盟数据驻留环境中运行，并提供传输中与静态加密。完整细节请参阅我们的安全页面，包括 SSO、审计日志及我们的 DPA。",
        },
      },
    },
    finalCta: {
      title: "30 秒看清您的合规处境",
      subtitle:
        "无需账户，无需信用卡。对您的首个 AI 系统进行分类，准确了解 EU AI Act 对它的要求。",
    },
  },

  /* ----------------------------------------------------------------- pricing */
  pricing: {
    hero: {
      title: "比合规顾问聘用费更划算的定价",
      subtitle:
        "律师事务所一次高风险审计的费用，便超过 Conforma 一整年。免费开始——无需信用卡。",
    },
    comparePlans: "比较各版本",
    table: {
      feature: "功能",
      starter: "Starter",
      team: "Team",
      business: "Business",
      enterprise: "Enterprise",
      rows: {
        systems: "AI 系统",
        classification: "风险分类",
        checklists: "义务清单",
        drafted: "AI 起草的文档",
        exports: "满足审计要求的导出",
        users: "用户与角色",
        auditLog: "审计日志",
        api: "API 访问",
        sso: "SSO / SAML",
        residency: "欧盟数据驻留",
        dpa: "定制 DPA",
        successManager: "专属客户成功经理",
      },
      unlimited: "无限制",
    },
    custom: {
      text: "需要定制方案？",
      cta: "联系销售",
    },
  },

  /* ------------------------------------------------------------- pricingTable */
  pricingTable: {
    monthly: "按月",
    annual: "按年",
    save: "立省 20%",
    mostPopular: "最受欢迎",
    perMonth: "/月",
    billedAnnually: "按年计费",
    billedMonthly: "按月计费",
    freeForever: "永久免费",
    tiers: {
      starter: {
        name: "Starter",
        tagline: "梳理您的第一个系统",
        cta: "免费开始",
        features: {
          oneSystem: "1 个 AI 系统",
          classification: "附引用条款的风险分类",
          checklist: "义务清单",
          deadlines: "期限跟踪",
        },
      },
      team: {
        name: "Team",
        tagline: "面向交付 AI 的团队",
        cta: "开始 14 天试用",
        features: {
          systems: "最多 25 个 AI 系统",
          drafted: "AI 起草的文档",
          annexIV: "Annex IV 技术文件",
          exports: "满足审计要求的导出",
          email: "邮件支持",
        },
      },
      business: {
        name: "Business",
        tagline: "面向规模化的 AI 组合",
        cta: "开始 14 天试用",
        features: {
          systems: "最多 100 个 AI 系统",
          users: "多用户与角色",
          auditLog: "审计日志与变更历史",
          api: "API 访问",
          priority: "优先支持",
        },
      },
    },
    enterprise: {
      name: "Enterprise",
      badge: "SSO · RBAC · DPA",
      desc: "无限系统、SSO/SAML、基于角色的访问控制、欧盟数据驻留、审计日志、定制 DPA，以及专属合规客户成功经理。",
      cta: "联系销售",
    },
  },

  /* ---------------------------------------------------------------- security */
  security: {
    eyebrow: "安全与信任",
    title: "您的合规工具自身也理应合规",
    subtitle:
      "Conforma 掌握着您 AI 资产最敏感的全景图。我们以企业级控制措施保护它，并对您的数据如何被处理保持充分透明。",
    badges: {
      gdpr: "符合 GDPR",
      iso: "对齐 ISO/IEC 42001",
      nist: "NIST AI RMF",
      dpa: "定制 DPA",
    },
    principles: {
      encryption: {
        title: "处处加密",
        desc: "所有数据在传输中以 TLS 1.2+ 加密，静态存储时以 AES-256 加密。密钥由专用的密钥管理服务统一管理。",
      },
      residency: {
        title: "欧盟数据驻留",
        desc: "企业数据在欧盟区域内存储与处理，确保您的合规记录绝不离开其所覆盖的司法管辖区。",
      },
      leastPrivilege: {
        title: "最小权限访问",
        desc: "基于角色的访问控制、SSO/SAML 与强制 MFA，确保每个人只能看到其角色所需的内容——并且您可以证明这一点。",
      },
      audit: {
        title: "完整审计记录",
        desc: "对分类、义务或文档的每一次变更都会记录操作者与时间戳——这是您应对审计的证据。",
      },
      isolation: {
        title: "租户隔离",
        desc: "客户数据按组织进行逻辑隔离，并在应用层与数据层强制实施严格的访问边界。",
      },
      resilient: {
        title: "稳健的架构设计",
        desc: "自动化备份、受监控的基础设施以及经过测试的恢复流程，确保您的登记册始终可用且完整无损。",
      },
    },
    privacy: {
      title: "数据保护与隐私",
      body: "您的数据归您所有。我们仅为提供服务而处理这些数据，绝不用于训练第三方模型，并支持您随时导出。企业客户将获得一份定制的数据处理协议（DPA），涵盖 GDPR 下的角色分工、次级处理者及安全承诺。",
      cards: {
        residency: { title: "数据驻留", value: "欧盟区域（企业版）" },
        retention: { title: "保留期", value: "由您掌控；可按需删除" },
        portability: { title: "可移植性", value: "随时完整导出" },
      },
    },
    subprocessors: {
      title: "次级处理者",
      intro:
        "我们使用一小批经过审查的次级处理者来交付服务。每一方均受与我们对您的承诺相一致的数据保护条款约束。",
      table: { category: "类别", purpose: "用途", region: "区域" },
      rows: {
        hosting: {
          category: "云托管",
          purpose: "欧盟区域的应用与数据库托管",
          region: "欧盟",
        },
        ai: {
          category: "AI 文档起草",
          purpose: "按需生成合规文档草稿",
          region: "欧盟 / 美国",
        },
        monitoring: {
          category: "错误监控",
          purpose: "经聚合与脱敏处理的应用遥测数据",
          region: "欧盟",
        },
        email: {
          category: "邮件投递",
          purpose: "事务性与通知类邮件",
          region: "欧盟",
        },
      },
      note: "此为当前产品阶段的代表性清单；具有约束力的清单以您的 DPA 为准。",
    },
    disclosure: {
      title: "负责任的漏洞披露",
      bodyBefore: "发现了漏洞？我们期待您的反馈。请将其报告至 ",
      email: "security@conforma.eu",
      bodyAfter: "，我们将在一个工作日内予以确认。",
      cta: "索取我们的安全资料包",
    },
  },

  /* -------------------------------------------------------------------- demo */
  demo: {
    eyebrow: "预约演示",
    title: "30 分钟看清您的 AI Act 合规敞口",
    subtitle:
      "合规专家将带领您的团队完成 AI 系统分类、弥合义务差距，并生成审计方所期望的文档。",
    bullets: {
      riskRead: {
        title: "实时风险判定",
        desc: "我们将在通话中对您的一个真实系统进行分类，并附上引用条款。",
      },
      gaps: {
        title: "您的义务差距",
        desc: "准确了解尚未完成的事项及适用的截止日期。",
      },
      rollout: {
        title: "企业级部署",
        desc: "SSO、角色、欧盟数据驻留，以及团队如何落地采用 Conforma。",
      },
    },
  },

  /* ---------------------------------------------------------------- demoForm */
  demoForm: {
    fullName: "全名",
    workEmail: "工作邮箱",
    company: "公司",
    role: "您的职位",
    systemsInScope: "纳入范围的 AI 系统",
    anythingElse: "还有什么需要我们了解的？",
    placeholders: {
      name: "张三",
      email: "zhangsan@company.com",
      company: "某某有限公司",
      message: "您的时间安排、您担心的系统等。",
    },
    roles: {
      compliance: "合规 / 法务",
      product: "AI / 产品",
      security: "安全 / IT",
      executive: "高管",
      other: "其他",
    },
    submit: "申请演示",
    consent:
      "我们绝不会分享您的信息。提交即表示您同意就 Conforma 相关事宜接受联系。",
    success: {
      title: "{name}，感谢您！",
      nameFallback: "您好",
      body: "我们的团队成员将在一个工作日内通过 {email} 与您联系，安排您的演示讲解。",
      emailFallback: "您的邮箱",
      impatient: "等不及了？您可以 ",
      impatientLink: "立即对一个系统进行分类",
    },
  },

  /* ------------------------------------------------------------------- legal */
  terms: {
    eyebrow: "法律",
    title: "服务条款",
    effective: "生效日期 {date}",
    effectiveDate: "2026-06-24",
    sections: {
      agreement: {
        title: "1. 协议",
        body: "本条款规范您对 Conforma（“本服务”）的访问与使用。使用本服务即表示您同意本条款。若您代表某一组织使用本服务，即表示您声明已获授权使其受本条款约束。",
      },
      service: {
        title: "2. 本服务",
        body: "Conforma 提供软件，帮助组织评估并记录其对 EU AI Act 的合规情况。我们可能会随时更新、改进或修改各项功能。",
      },
      notAdvice: {
        title: "3. 不构成法律意见",
        body: "Conforma 是一款决策支持工具。其分类结果、清单及生成的文档仅供参考，**不**构成法律意见。您仍须对自身合规负责，并应与具备资质的法律顾问确认分类结果。",
      },
      accounts: {
        title: "4. 账户与可接受使用",
        body: "您有责任保护好自己的账户，并对账户下的活动负责。您同意不滥用本服务、不试图干扰其运行，亦不将其用于违反任何法律或第三方权利。",
      },
      content: {
        title: "5. 您的内容",
        body: "您保留对所提交数据的全部权利。您授予我们一项有限许可，仅为提供本服务而处理这些数据，具体如我们的[隐私政策](/privacy)所述。",
      },
      ip: {
        title: "6. 知识产权",
        body: "本服务，包括其软件、设计及内容（您的数据除外），归 Conforma 所有，并受适用法律保护。本条款不授予您对我们商标或品牌标识的任何权利。",
      },
      disclaimers: {
        title: "7. 免责声明",
        body: "在适用法律允许的最大范围内，本服务按“现状”提供，不附带任何形式的保证。我们不保证本服务不会中断、毫无差错，亦不保证其输出对您的具体情形而言完整无缺或在法律上充分。",
      },
      liability: {
        title: "8. 责任限制",
        body: "在法律允许的最大范围内，对于因您使用本服务而产生的任何间接、附带或后果性损害，或任何监管处罚，Conforma 概不承担责任。",
      },
      law: {
        title: "9. 适用法律",
        body: "本条款受爱尔兰法律管辖，不考虑其法律冲突原则；爱尔兰法院拥有专属管辖权，除非您所在地的强制性消费者法律另有规定。",
      },
      changes: {
        title: "10. 变更与联系",
        body: "我们可能会更新本条款；重大变更将提前通知。有疑问？请发送邮件至 [legal@conforma.eu](mailto:legal@conforma.eu)。",
      },
    },
  },

  privacy: {
    eyebrow: "法律",
    title: "隐私政策",
    effective: "生效日期 {date}",
    effectiveDate: "2026-06-24",
    sections: {
      overview: {
        title: "概述",
        body: "Conforma（“我们”）提供软件，帮助组织评估并记录其对 EU AI Act（Regulation (EU) 2024/1689）的合规情况。本政策说明我们处理哪些个人数据，以及您拥有哪些选择。我们致力于依据《通用数据保护条例》（GDPR）合法处理个人数据。",
      },
      dataWeProcess: {
        title: "我们处理的数据",
        body: "- **账户与联系数据**——当您创建账户或申请演示时的姓名、工作邮箱、公司及职位。\n- **产品数据**——您在 Conforma 中创建的 AI 系统记录、分类结果及文档。这些是您的内容；我们仅为提供服务而处理。\n- **使用与技术数据**——经聚合与脱敏处理的遥测数据（例如错误事件），用于保持服务的可靠性。",
      },
      howWeUse: {
        title: "我们如何使用数据",
        body: "我们处理个人数据，以提供并保障服务安全、回应咨询，以及履行法律义务。我们**不**出售个人数据，也不会使用您的产品内容来训练第三方 AI 模型。",
      },
      legalBases: {
        title: "法律依据",
        body: "视具体情形而定，我们依据合同的履行（提供服务）、我们的正当利益（保障并改进服务）、您的同意（例如营销），以及对法律义务的遵守。",
      },
      residency: {
        title: "数据驻留与保留",
        body: "企业客户数据托管于欧盟区域。我们仅在为提供服务所需或法律要求的期限内保留个人数据，并可按请求予以删除或匿名化。技术细节请参阅我们的[安全页面](/security)。",
      },
      subprocessors: {
        title: "次级处理者",
        body: "我们使用一小批经过审查、受与本政策相一致的数据保护条款约束的次级处理者。最新清单发布于我们的[安全页面](/security#subprocessors)。",
      },
      rights: {
        title: "您的权利",
        body: "根据 GDPR，您有权访问、更正、删除、限制及移植您的个人数据，并有权反对某些处理活动。如需行使上述任何权利，请通过 [privacy@conforma.eu](mailto:privacy@conforma.eu) 与我们联系。您还有权向您当地的监管机构提出投诉。",
      },
      contact: {
        title: "联系方式",
        body: "对本政策或您的数据有疑问？请发送邮件至 [privacy@conforma.eu](mailto:privacy@conforma.eu)。",
      },
    },
    footnote:
      "本页面旨在透明说明本产品如何处理数据，不构成法律意见。",
  },

  /* ---------------------------------------------------------------- notFound */
  notFound: {
    code: "404",
    title: "页面未找到",
    body: "您要访问的页面不存在或已迁移。",
    backHome: "返回首页",
    classify: "对一个系统进行分类",
  },

  /* ---------------------------------------------------------------- appShell */
  app: {
    nav: {
      overview: "概览",
      classify: "分类",
      reports: "报告",
    },
    workspace: "工作区",
    account: "账户",
    settings: "设置",
    helpDocs: "帮助与文档",
    helpAria: "帮助与文档",
    notifications: "通知",
    accountSettings: "账户设置",
    complianceClock: "合规倒计时",
    untilHighRisk: "距高风险义务生效，截止日期为",
    highRiskDate: "2 Aug 2026",
    accountName: "Mohammad E.",
    accountPlan: "Acme AI · Pro",
    breadcrumb: {
      assessment: "评估",
      classifyTitle: "对一个系统进行分类",
      reporting: "报告",
      reportTitle: "就绪报告",
      registry: "登记册",
      systemDetail: "系统详情",
      workspace: "工作区",
      overview: "概览",
    },
  },

  /* ---------------------------------------------------------------- settings */
  settings: {
    title: "设置",
    subtitle: "管理 Conforma 在本设备上的外观与行为。",
    appearance: {
      title: "外观",
      desc: "选择界面主题。你的偏好会保存在本设备上。",
      theme: "主题",
      light: "浅色",
      dark: "深色",
    },
    language: {
      title: "语言",
      desc: "界面语言与文字方向，更改即时生效。",
      label: "界面语言",
    },
    data: {
      title: "注册表数据",
      desc: "你的 AI 系统注册表仅存在于本浏览器中，不会发送到任何服务器。可将其重置为示例数据，或完全清空。",
      count: plural({
        other: "本浏览器中有 {count} 个系统",
      }),
      reset: "重置为演示数据",
      clear: "清空所有系统",
      resetDone: "注册表已重置为演示系统。",
      clearDone: "注册表已清空。",
      confirmResetTitle: "重置为演示数据？",
      confirmResetBody:
        "这会用十个示例系统替换当前注册表。你在本浏览器中添加的条目将会丢失。",
      confirmClearTitle: "清空所有系统？",
      confirmClearBody: "这会永久删除本浏览器注册表中的所有系统，且无法撤销。",
    },
    about: {
      title: "关于",
      desc: "一个作品集级别的欧盟《人工智能法案》合规工作区。",
      version: "版本",
      mode: "文档生成",
      docs: "文档",
      source: "源代码",
      builtBy: "开发者",
    },
  },

  /* ------------------------------------------------------------------ alerts */
  alerts: {
    title: "提醒",
    subtitle: "来自注册表的信号",
    empty: "一切就绪——暂无待处理的合规信号。",
    viewAll: "前往仪表盘",
    prohibitedTitle: plural({
      other: "{count} 个存在被禁止做法的系统",
    }),
    prohibitedBody: "根据第 5 条被禁止——请立即停止使用。",
    attentionTitle: plural({
      other: "{count} 个高风险系统低于目标",
    }),
    attentionBody: "其义务完成率不足一半。",
    deadlineTitle: "高风险义务截止日期",
    deadlineBody: "第三章义务将于 {date} 生效（第 113 条）。",
  },

  /* ------------------------------------------------------------------- error */
  error: {
    title: "出现了一些问题",
    body: "意外错误中断了此页面。你保存的系统是安全的——没有丢失任何数据。",
    retry: "重试",
    home: "返回首页",
    reference: "错误编号",
  },

  /* ------------------------------------------------------------------- toast */
  toast: {
    region: "通知",
    dismiss: "关闭",
    saved: "系统已保存到你的注册表。",
    deleted: "系统已删除。",
    copied: "已复制到剪贴板。",
    copyFailed: "无法复制——请手动选择并复制。",
    exportBlocked: "弹出窗口被拦截。请允许弹出窗口以导出文档。",
  },

  /* ------------------------------------------------------------ commandPalette */
  commandPalette: {
    aria: "命令面板",
    trigger: "搜索",
    placeholder: "搜索命令和系统…",
    empty: "无结果。",
    groups: { navigate: "导航", actions: "操作", systems: "系统" },
    actions: {
      newClassification: "新建分类",
      resetDemo: "重置演示数据",
      toggleTheme: "切换主题",
      openDocs: "打开文档",
    },
  },

  /* ---------------------------------------------------------------- classify */
  classify: {
    steps: {
      basics: "基本信息",
      definition: "定义",
      prohibited: "违禁",
      highRisk: "高风险",
      transparency: "透明度",
    },
    step0: {
      title: "介绍一下该系统",
      sub: "基本信息。您可以登记自建的系统（提供者）或所使用的系统（部署者）。",
      nameLabel: "系统名称",
      namePlaceholder: "例如：简历筛选模型",
      descLabel: "它的功能是什么？",
      descPlaceholder: "简要描述其预期用途。",
      roleLabel: "您的角色",
      roleProvider: "提供者（我们构建）",
      roleDeployer: "部署者（我们使用）",
      roleBoth: "两者皆是",
      ownerLabel: "负责人 / 团队",
      ownerPlaceholder: "例如：人力运营",
    },
    step1: {
      title: "它是人工智能系统吗？",
      sub: "本法适用于以一定自主性从输入推断输出的系统（Art. 3(1)）。",
      isAi: "该系统符合人工智能系统的定义",
      isGpai: "它构建于通用人工智能模型之上（例如大语言模型 LLM）",
      isGpaiHint: "将触发额外的 GPAI 提供者义务（Art. 53+）。",
    },
    step2: {
      title: "它是否涉及以下任一情形？",
      sub: "这些做法根据 Art. 5 被直接禁止。请勾选所有适用项——或一项也不选。",
    },
    step3: {
      title: "高风险应用场景",
      sub: "高风险系统须承担本法的全部要求。请勾选与该系统预期用途相符的任一项。",
      annexI: "它是受欧盟协调法律约束产品的安全组件（Annex I）",
      annexIHint: "例如：机械、医疗器械、车辆。",
      annexIIIHeading: "Annex III 领域",
      derogation:
        "它仅执行狭窄的程序性任务，且不会对决策产生实质性影响",
      derogationHint:
        "Art. 6(3) 减损条款——可能使其脱离高风险，但您必须记录该评估。",
    },
    step4: {
      title: "透明度触发情形",
      sub: "即便不属于高风险，某些用途也会根据 Art. 50 承担披露义务。",
      interacts: "直接与人交互（例如聊天机器人）",
      synthetic: "生成合成音频、图像、视频或文本",
      deepfake: "生成深度伪造内容",
      emotion: "情绪识别或生物特征分类",
    },
    nav: {
      back: "返回",
      continue: "继续",
      seeClassification: "查看分类结果",
    },
    provisional: "初步等级：",
    result: {
      untitled: "未命名系统",
      plusGpai: "+ GPAI 义务",
      whyTier: "为何属于此等级",
      applicableDeadline: "适用截止日期",
      obligationsToSatisfy: plural({
        other: "需履行 {count} 项义务",
      }),
      moreObligations: "+ 另有 {count} 项——保存后查看完整清单。",
      explain: "用通俗语言解释",
      aiExplanation: "AI 解释",
      demoModeTag: "演示模式",
      demoModeTitle:
        "真实的预生成示例。添加 ANTHROPIC_API_KEY 即可切换为实时、针对具体系统的起草。",
      couldNotReach: "无法连接到解释服务。",
      editAnswers: "编辑回答",
      saveToRegistry: "保存至登记册",
      disclaimer:
        "仅为决策支持——不构成法律意见。请与具备资质的法律顾问确认。",
      viewDashboard: "查看控制台",
    },
  },

  /* --------------------------------------------------------------- dashboard */
  dashboard: {
    eyebrow: "AI 治理",
    title: "系统登记册",
    subtitle:
      "您构建或部署的每一个 AI 系统，及其在 Regulation (EU) 2024/1689 下的实时状态。",
    exportReport: "导出报告",
    classifySystem: "对一个系统进行分类",
    restoreDemo: "恢复示例数据",
    kpi: {
      systems: "已登记系统",
      systemsTip: "当前清单中的 AI 系统。",
      systemsSub: "{count} 个高风险或违禁",
      compliance: "组合合规度",
      complianceTip: "已标记完成的适用义务的平均占比。",
      complianceSub: "平均已关闭的义务",
      highRisk: "高风险系统",
      highRiskTip: "承担 Chapter III 全部义务的 Annex III 系统。",
      highRiskSub: "Chapter III 全部义务",
      nearest: "最近截止日期",
      nearestTip: "您整个组合中最临近的法定截止日期。",
      nearestNoSystems: "尚无系统",
    },
    emptyTitle: "尚未登记任何系统",
    emptyBody:
      "对您的首个 AI 系统进行分类，准确了解 EU AI Act 对它的要求——附引用条款及可追踪的义务清单。",
    riskDistribution: "风险分布",
    total: "共 {count} 个",
    systemsUnit: "个系统",
    needsAttention: "需要关注",
    needsAttentionSub: "风险最高且完成度最低——请优先处理这些。",
    toNearestDeadline: "距最近截止日期",
    unassigned: "未指派",
    portfolioCompliance: "组合合规度",
    viewFullReport: "查看完整报告",
    allSystems: "全部系统",
    searchPlaceholder: "搜索系统……",
    searchAria: "搜索系统",
    filterAria: "按风险等级筛选",
    all: "全部",
    sortAria: "排序系统",
    sortRecent: "最近添加",
    sortRisk: "风险最高",
    sortCompliance: "合规度最低",
    sortName: "名称（A–Z）",
    noMatches: "无匹配结果",
    noMatchesBody: "请尝试其他搜索词或清除筛选条件。",
    clearFilters: "清除筛选",
    table: {
      system: "系统",
      risk: "风险",
      owner: "负责人",
      compliance: "合规度",
      deadline: "截止日期",
      open: "打开",
    },
    showing: "显示第 {from}–{to} 项，共 {total} 项",
    prev: "上一页",
    next: "下一页",
  },

  /* ------------------------------------------------------------------ report */
  report: {
    backDashboard: "控制台",
    printSave: "打印 / 另存为 PDF",
    reportTitle: "EU AI Act 合规就绪报告",
    generated: "生成于 {date}",
    regulation: "Regulation (EU) 2024/1689",
    executiveSummary: "执行摘要",
    summary: {
      systems: "系统",
      highRiskPlus: "高风险及以上",
      avgCompliance: "平均合规度",
      tiersInUse: "在用的等级",
    },
    riskDistribution: "风险分布",
    systemRegister: "系统登记表",
    table: {
      system: "系统",
      risk: "风险",
      owner: "负责人",
      outstanding: "未完成",
      compliance: "合规度",
    },
    noSystems: "尚未登记任何系统。",
    footer:
      "本报告由 Conforma 生成，作为 Regulation (EU) 2024/1689 的决策支持。它不构成法律意见。在依赖分类结果之前，应与具备资质的法律顾问予以确认。",
  },

  /* ------------------------------------------------------------------ system */
  system: {
    backRegistry: "登记册",
    notFoundTitle: "未找到该系统",
    notFoundBody:
      "它可能已被删除，或保存在另一浏览器中。您的登记册存储在本设备本地。",
    backToDashboard: "返回控制台",
    plusGpai: "+ GPAI",
    meta: {
      tier: "等级",
      role: "角色",
      owner: "负责人",
      deadline: "截止日期",
    },
    unassigned: "未指派",
    compliance: "合规度",
    rationaleTitle: "分类依据",
    obligationsTitle: "义务清单",
    obligationsHint: "点按状态可循环切换：待办 → 进行中 → 已完成。",
    states: {
      todo: "待办",
      inProgress: "进行中",
      done: "已完成",
    },
    classifyAnother: "对另一个系统进行分类",
    deleteSystem: "删除系统",
    deleteConfirm: "从登记册中删除“{name}”？",
    docs: {
      title: "合规文档",
      hint: "生成针对该系统量身定制的法规文档初稿，然后预览并导出为 Markdown、Word 或 PDF。",
      types: {
        technical: { label: "技术文档", cite: "Annex IV / Art. 11" },
        transparency: { label: "透明度声明", cite: "Art. 50" },
        conformity: { label: "合格声明", cite: "Art. 47" },
      },
      drafting: "正在起草{label}……",
      preview: "预览",
      markdown: "Markdown",
      copy: "复制",
      copied: "已复制！",
      couldNotGenerate: "无法生成此文档。请重试。",
    },
  },

  /* -------------------------------------------------------------- landingDemo */
  landingDemo: {
    pickSystem: "选择一个系统",
    builtOnGpai: "构建于通用模型之上",
    builtOnGpaiHint: "增加 GPAI 提供者义务（Art. 53+）",
    liveClassification: "实时分类",
    plusGpai: "+ GPAI",
    obligations: "义务",
    deadline: "截止日期",
    runFull: "运行完整的 5 步分类器",
    scenarios: {
      employment: { label: "简历筛选", hint: "对求职者进行排名" },
      credit: { label: "信用评分", hint: "评估信用状况" },
      chatbot: { label: "客服聊天机器人", hint: "与客户对话" },
      deepfake: { label: "深度伪造工作室", hint: "生成合成媒体" },
      social: { label: "社会评分", hint: "按行为对公民进行排名" },
      forecast: { label: "需求预测", hint: "预测库存需求" },
    },
  },

  /* ----------------------------------------------------------------- aiSource */
  ai: {
    demoDocNote:
      "> **由 AI 起草 · 演示模式（Conforma）。** 这是一份未使用任何外部 AI 服务生成的真实英文示例，因此公开演示无需任何凭据即可运行。配置 `ANTHROPIC_API_KEY` 后，Conforma 会以你所选的语言原生起草文档。使用前请替换每一处 `[BRACKETED PLACEHOLDER]`。此为决策支持，并非法律意见。",
    demoBadge: "演示模式 · 示例 AI 输出",
    demoBadgeTitle:
      "未配置 Anthropic API 密钥，因此 AI 生成以演示模式运行——提供真实的预生成示例文档。无需付费 API。",
    draftedByClaude: "由 Claude 起草",
    aiDraftDemo: "AI 草稿 · 演示模式",
    aiDraftDemoTitle:
      "真实的预生成示例。添加 ANTHROPIC_API_KEY 即可切换为实时、针对具体系统的起草。",
    couldNotGenerate: "无法生成——请重试。",
    docLabels: {
      technical: "技术文档（Annex IV）",
      transparency: "透明度声明（Art. 50）",
      conformity: "欧盟合格声明（Art. 47）",
    },
    /** Plain-language narrative, composed from these fragments per locale. */
    narrative: {
      intro:
        "“{system}”已根据 Regulation (EU) 2024/1689 被归类为{tier}。{reasons}实际而言，这意味着{summary}{gpai}",
      gpai: " 由于该系统构建于通用人工智能模型之上，因此除上述等级对应的义务外，还需履行 Art. 53 规定的 GPAI 提供者义务——请随时备妥模型技术文档及训练数据摘要。",
      nextStep:
        "当前最紧迫的下一步是{step}。此处关键的时间节点是{deadline}——{date}——在此之后，相关义务即可强制执行。若不合规，可能面临最高达 {penalty} 或全球年营业额 {pct}% 的罚款，以两者中较高者为准（{citation}）。",
      closing:
        "请将下方的义务清单视为您的差距分析：为每一项指定负责人，留存证明您已满足该项的证据，并在截止日期之前充分提前地完成所有仍未关闭的事项。以上内容均不构成法律意见——请与具备资质的法律顾问确认最终分类结果及您的整改计划。",
      steps: {
        prohibited:
          "停止将该系统投放市场或投入使用，因为该做法已根据 Art. 5 被全面禁止",
        high: "建立 Art. 9 规定的风险管理流程并着手编制 Annex IV 技术文件，因为这些是您必须在截止日期前通过的合格评定的前置条件",
        limited:
          "落实 Art. 50 规定的透明度披露——告知用户其正在与 AI 交互，并以机器可读的方式标注任何合成内容",
        minimal:
          "将本次评估记录在您的 AI 清单中并持续复核，因为预期用途的变化可能使该系统进入更高的风险等级",
      },
    },
    /** Used to instruct Claude to write in the visitor's language (live mode). */
    promptLanguage: "简体中文",
  },

  /* ------------------------------------------------------------- classifier */
  classifier: {
    notAISystem:
      "该系统不符合“人工智能系统”的定义（Art. 3(1)），因此本法的系统层级义务并不适用。",
    prohibitedMatch: "匹配到一项违禁做法：{practice}。",
    annexIMatch:
      "该 AI 是受 Annex I 所列欧盟协调立法约束产品的安全组件，或其本身即为此类产品，需经第三方合格评定。",
    annexIIIMatch: "其预期用途落入某一高风险领域：{area}。",
    derogation:
      "您表示该系统仅执行狭窄的程序性或准备性任务，且不会对决策结果产生实质性影响。根据 Art. 6(3) 的减损条款，它可能不属于高风险——但您必须记录这一评估，并仍须登记该系统。",
    transparencyMatch: "该系统{trigger}，从而触发透明度义务。",
    transparencyTriggers: {
      interacts: "直接与人交互",
      synthetic: "生成合成音频/图像/视频/文本",
      deepfake: "生成深度伪造内容",
      emotion: "执行情绪识别或生物特征分类",
    },
    minimalDefault:
      "未发现任何违禁做法、高风险应用场景或透明度触发情形。该系统归入最小风险类别。",
    gpaiOverlay:
      "该系统构建于通用人工智能模型之上，因此除上述系统层级等级外，还需履行 GPAI 提供者义务。",
  },

  /* ------------------------------------------------------------------ domain */
  domain: {
    roles: {
      provider: "提供者",
      deployer: "部署者",
      both: "两者皆是",
    },
    riskTiers: {
      prohibited: {
        label: "不可接受风险——违禁",
        short: "违禁",
        summary:
          "该做法在欧盟境内被禁止。不得将其投放市场、投入使用或加以使用。继续使用将使您面临最高额度的处罚。",
      },
      high: {
        label: "高风险",
        short: "高风险",
        summary:
          "仅在投放市场前满足 Chapter III 全部义务时方可允许：风险管理、数据治理、技术文档、日志记录、透明度、人工监督、准确性与网络安全，外加合格评定及欧盟数据库登记。",
      },
      limited: {
        label: "有限风险——透明度",
        short: "有限",
        summary:
          "大体上允许，但适用特定的透明度义务：必须告知用户其正在与 AI 交互，且合成 / 经操纵的内容必须以机器可读的方式标注。",
      },
      minimal: {
        label: "最小风险",
        short: "最小",
        summary:
          "在 AI Act 下无强制性义务。鼓励采用自愿性行为准则。AI 素养义务（Art. 4）及一般产品法律仍然适用。",
      },
    },
    prohibited: {
      subliminal: {
        title: "潜意识或操纵性技术",
        description:
          "运用潜意识、蓄意操纵或欺骗性技术，实质性扭曲行为并造成（或可能造成）重大损害。",
      },
      vulnerability: {
        title: "利用弱势",
        description:
          "利用因年龄、残疾或特定社会 / 经济状况所致的弱势，以扭曲行为并造成重大损害。",
      },
      "social-scoring": {
        title: "社会评分",
        description:
          "基于社会行为或个人特征，对人长期进行评价或分类，从而在无关情境中导致不利对待，或造成不正当 / 不相称的对待。",
      },
      "predictive-policing": {
        title: "个人预测性警务",
        description:
          "仅基于画像或人格特征，评估某人实施犯罪的风险。",
      },
      "facial-scraping": {
        title: "无目标的人脸识别抓取",
        description:
          "通过从互联网或闭路电视（CCTV）无目标地抓取人脸图像，建立或扩充人脸识别数据库。",
      },
      "emotion-work-edu": {
        title: "工作场所 / 教育领域的情绪识别",
        description:
          "推断工作场所或教育机构中人员的情绪（出于医疗或安全原因者除外）。",
      },
      "biometric-categorization": {
        title: "敏感生物特征分类",
        description:
          "基于生物特征数据对人进行分类，以推断其种族、政治观点、工会成员身份、宗教信仰、性生活或性取向。",
      },
      rbi: {
        title: "实时远程生物特征识别",
        description:
          "在公众可进入的场所，为执法目的使用“实时”远程生物特征识别（受限于狭窄的、经授权的例外情形）。",
      },
    },
    annexIII: {
      biometrics: {
        title: "生物识别",
        examples:
          "远程生物特征识别、按敏感属性进行的生物特征分类、情绪识别（在不被禁止的情形下）。",
      },
      "critical-infrastructure": {
        title: "关键基础设施",
        examples:
          "关键数字基础设施、道路交通的管理 / 运行，或供水、供气、供暖、供电中的安全组件。",
      },
      education: {
        title: "教育与职业培训",
        examples:
          "录取决定、评估学习成果、评定适当的教育水平、监测 / 识别考试中的违禁行为。",
      },
      employment: {
        title: "就业与劳动者管理",
        examples:
          "招聘 / 甄选、定向招聘广告、筛选申请、晋升 / 解雇决定、任务分配、绩效监测。",
      },
      "essential-services": {
        title: "基本服务的获取",
        examples:
          "公共援助 / 福利的资格认定、信用评估与信用评分、人寿 / 健康保险中的风险评估与定价、紧急调度。",
      },
      "law-enforcement": {
        title: "执法",
        examples:
          "评估犯罪 / 再犯风险或成为受害者的风险、测谎、评估证据可靠性、调查过程中的画像分析。",
      },
      migration: {
        title: "移民、庇护与边境管制",
        examples:
          "测谎、对非正规移民 / 安全 / 健康风险的评估、审查庇护 / 签证申请、侦测 / 识别人员。",
      },
      justice: {
        title: "司法与民主进程",
        examples:
          "协助司法机关研究 / 解释事实与法律；影响选举 / 公投结果或投票行为。",
      },
    },
    obligations: {
      "risk-management": {
        title: "风险管理系统",
        description:
          "在系统的整个生命周期内建立、记录并维护一套持续、迭代的风险管理流程。",
      },
      "data-governance": {
        title: "数据与数据治理",
        description:
          "训练、验证与测试数据必须满足质量标准：相关、有代表性、无差错，并经过偏见审查。",
      },
      "technical-documentation": {
        title: "技术文档",
        description:
          "编制并持续更新证明符合性的技术文档（即 Annex IV 卷宗）。",
      },
      "record-keeping": {
        title: "记录留存（日志记录）",
        description:
          "在系统的整个使用期内自动记录事件（“日志”），以确保运行的可追溯性。",
      },
      "transparency-deployers": {
        title: "向部署者的透明度",
        description:
          "在设计上确保足够的透明度，并提供使用说明，使部署者能够解读输出并恰当使用。",
      },
      "human-oversight": {
        title: "人工监督",
        description:
          "在设计上确保系统可被人类有效监督，包括停止 / 否决机制以及对自动化偏见的认知。",
      },
      "accuracy-robustness": {
        title: "准确性、稳健性与网络安全",
        description:
          "达到适当的准确性、稳健性与网络安全水平，并对差错及对抗性攻击保持一致与韧性。",
      },
      qms: {
        title: "质量管理系统",
        description:
          "建立一套文档化的质量管理系统，涵盖合规所需的流程、程序与职责。",
      },
      "conformity-assessment": {
        title: "合格评定",
        description:
          "在将系统投放市场或投入使用前，完成相应的合格评定程序。",
      },
      "ce-doc": {
        title: "欧盟合格声明与 CE 标识",
        description:
          "编制欧盟合格声明，并加贴表明符合本法规的 CE 标识。",
      },
      "eu-registration": {
        title: "在欧盟数据库中登记",
        description:
          "在将高风险系统投放市场或投入使用前，于欧盟数据库中进行登记。",
      },
      "use-per-instructions": {
        title: "按说明使用并指派监督",
        description:
          "按照使用说明使用系统，指派胜任的人工监督，并确保输入数据具有相关性。",
      },
      monitoring: {
        title: "监测与报告",
        description:
          "监测运行情况，在发生严重事件或风险时暂停使用并通知提供者 / 主管机关；保存自动生成的日志。",
      },
      fria: {
        title: "基本权利影响评估",
        description:
          "公共机构及某些私营部署者（例如银行、保险）必须在使用前完成基本权利影响评估。",
      },
      "inform-affected": {
        title: "告知受影响人员",
        description:
          "若系统对人作出决定或协助决定，应告知相关人员其正受到该系统的影响。",
      },
      "disclose-chatbot": {
        title: "披露 AI 交互",
        description:
          "必须告知用户其正在与 AI 系统交互，除非从情境中可显而易见。",
      },
      "label-synthetic": {
        title: "标注合成内容",
        description:
          "AI 生成的音频、图像、视频或文本必须以机器可读的格式标注为人工生成或经操纵。",
      },
      "label-deepfake": {
        title: "披露深度伪造",
        description:
          "生成深度伪造内容的系统的部署者，必须披露该内容系人工生成或经操纵。",
      },
      "emotion-disclosure": {
        title: "披露情绪识别 / 生物特征分类",
        description:
          "情绪识别或生物特征分类系统的部署者，必须告知受其影响的人员。",
      },
      "gpai-techdoc": {
        title: "模型技术文档",
        description:
          "编制并维护模型的技术文档，包括训练与测试过程及评估结果。",
      },
      "gpai-downstream": {
        title: "向下游提供者提供信息",
        description:
          "向将该模型集成至其 AI 系统的下游提供者提供信息与文档。",
      },
      "gpai-copyright": {
        title: "版权政策与训练数据摘要",
        description:
          "建立遵守欧盟版权法的政策，并发布足够详尽的训练内容摘要。",
      },
      "gpai-systemic": {
        title: "系统性风险义务",
        description:
          "具有系统性风险的模型还必须额外执行模型评估、对抗性测试、事件跟踪及网络安全防护。",
      },
    },
    deadlines: {
      force: {
        label: "法规生效",
        description:
          "AI Act 生效；分阶段适用的计时开始。",
      },
      prohibitions: {
        label: "违禁做法与 AI 素养适用",
        description:
          "Art. 5 中的禁令开始适用，同时适用 AI 素养义务（Art. 4）。",
      },
      gpai: {
        label: "GPAI、治理与处罚适用",
        description:
          "通用人工智能模型的义务、治理框架及处罚制度开始适用。",
      },
      "high-risk-annex-iii": {
        label: "高风险（Annex III）与透明度适用",
        description:
          "Annex III 系统的核心高风险义务以及 Art. 50 透明度义务开始适用。这是多数组织正争分夺秒赶赴的期限。",
      },
      "high-risk-annex-i": {
        label: "高风险（受监管产品）适用",
        description:
          "针对作为已受欧盟协调立法（Annex I）约束产品之安全组件的 AI 的高风险义务开始适用。",
      },
    },
  },

  /* ---------------------------------------------------------------- metadata */
  metadata: {
    root: {
      titleDefault: "Conforma — EU AI Act 合规，自动化完成",
      titleTemplate: "%s · Conforma",
      description:
        "Conforma 是面向 EU AI Act 的合规平台。为您的 AI 系统建立清单，依据引用条款自动判定风险，弥合义务差距，并在 2026 年 8 月截止日期前生成满足审计要求的文档。",
      ogTitle: "Conforma — EU AI Act 合规，自动化完成",
      ogDescription:
        "自动判定您 AI 系统的风险，弥合义务差距，并在 EU AI Act 的 2026 年 8 月截止日期前生成满足审计要求的文档。",
      twitterTitle: "Conforma — EU AI Act 合规，自动化完成",
      twitterDescription:
        "面向 EU AI Act 的合规平台。在 2026 年 8 月前完成分类、弥合差距并生成文档。",
    },
    pricing: {
      title: "定价",
      description:
        "面向 EU AI Act 合规的简单、透明定价。免费开始，并可在企业版上扩展至无限系统，配备 SSO、审计日志及欧盟数据驻留。",
    },
    security: {
      title: "安全与信任",
      description:
        "Conforma 如何保护您的数据：欧盟数据驻留、传输中与静态加密、SSO/SAML、基于角色的访问控制、审计日志、次级处理者透明度以及定制 DPA。",
    },
    demo: {
      title: "预约演示",
      description:
        "了解 Conforma 如何在 EU AI Act 下对您的 AI 系统进行分类、弥合义务差距并生成满足审计要求的文档。预约一场 30 分钟的讲解。",
    },
    terms: {
      title: "服务条款",
      description:
        "规范 Conforma 使用的条款，包括服务范围、不构成法律意见的免责声明、可接受使用及责任。",
    },
    privacy: {
      title: "隐私政策",
      description:
        "Conforma 如何收集、使用并保护个人数据，您在 GDPR 下的权利、数据驻留、保留及我们的次级处理者。",
    },
    classify: {
      title: "对一个 AI 系统进行分类",
      description:
        "回答几个问题，即可在 30 秒内获得 EU AI Act 风险分类，附引用条款、适用的义务及您的合规截止日期。",
    },
    dashboard: { title: "控制台" },
    report: { title: "合规就绪报告" },
    system: { title: "AI 系统" },
  },

  /* ---------------------------------------------------------- opengraph image */
  og: {
    alt: "Conforma — EU AI Act 合规，自动化完成",
    title: "EU AI Act 合规，全程自动",
    subtitle:
      "对您的 AI 系统进行分类，弥合义务差距，并生成满足审计要求的文档。",
    badge: "高风险义务于 2026 年 8 月 2 日适用",
    regulation: "Regulation (EU) 2024/1689",
  },

  /* -------------------------------------------------------------------- auth */
  auth: {
    emailLabel: "邮箱",
    emailPlaceholder: "you@company.com",
    passwordLabel: "密码",
    fullNameLabel: "姓名",
    fullNamePlaceholder: "张三",
    orgNameLabel: "组织名称",
    orgNamePlaceholder: "Acme 公司",
    showPassword: "显示密码",
    hidePassword: "隐藏密码",
    passwordHint: "至少 8 个字符。",
    signOut: "退出登录",
    signIn: {
      title: "欢迎回来",
      subtitle: "登录你的 Conforma 工作区。",
      submit: "登录",
      submitting: "正在登录…",
      forgot: "忘记密码？",
      noAccount: "第一次使用 Conforma？",
      createAccount: "创建账户",
    },
    signUp: {
      title: "创建账户",
      subtitle: "几分钟内即可开始管理欧盟《人工智能法案》合规。",
      submit: "创建账户",
      submitting: "正在创建账户…",
      haveAccount: "已经有账户？",
      signInLink: "登录",
      terms: "创建账户即表示你同意我们的[条款](/terms)和[隐私政策](/privacy)。",
    },
    forgot: {
      title: "重置密码",
      subtitle: "我们将向你发送设置新密码的链接。",
      submit: "发送重置链接",
      submitting: "正在发送…",
      sent: "如果 {email} 存在账户，重置链接即将送达。",
      backToSignIn: "返回登录",
    },
    reset: {
      title: "设置新密码",
      subtitle: "请选择一个未在其他地方使用的强密码。",
      newPassword: "新密码",
      confirmPassword: "确认密码",
      submit: "更新密码",
      submitting: "正在更新…",
      mismatch: "两次输入的密码不一致。",
      success: "密码已更新，一切就绪。",
      invalidLink: "此重置链接无效或已过期。请重新申请。",
    },
    verify: {
      title: "请查收邮件",
      subtitle: "我们已向 {email} 发送验证链接。点击链接以激活你的账户。",
      resend: "重新发送邮件",
      resent: "已重新发送——请查收邮件。",
      backToSignIn: "返回登录",
    },
    onboarding: {
      title: "创建你的组织",
      subtitle: "你的工作区——管理 AI 系统、报告和团队成员。",
      submit: "创建组织",
      submitting: "正在创建…",
      slugHint: "这将成为你的工作区网址。",
    },
    errors: {
      invalidCredentials: "邮箱或密码错误。",
      emailInUse: "该邮箱已注册账户。",
      weakPassword: "密码至少需 8 个字符。",
      emailNotConfirmed: "登录前请先验证你的邮箱。",
      rateLimited: "尝试次数过多。请稍候再试。",
      generic: "出了点问题，请重试。",
    },
  },

  /* ----------------------------------------------------------------- billing */
  billing: {
    title: "账单与套餐",
    desc: "你的订阅、用量和付款信息。",
    currentPlan: "当前套餐",
    plan: { free: "免费", pro: "专业版", team: "团队版" },
    usage: "AI 系统",
    usageCount: "{limit} 个中的 {used} 个",
    unlimited: "无限制",
    renews: "{date} 续订",
    cancels: "{date} 取消",
    upgradePro: "升级到专业版",
    upgradeTeam: "升级到团队版",
    manage: "管理账单",
    memberNote: "只有所有者和管理员可以更改账单。",
    disabled: "此工作区尚未配置账单功能。",
    pastDue: "付款逾期",
    canceled: "订阅已取消",
  },

  /* -------------------------------------------------------------------- team */
  team: {
    title: "团队",
    subtitle: "管理成员、邀请和工作区设置。",
    usageTitle: "用量",
    nav: "团队",
    orgName: "工作区名称",
    save: "保存",
    saved: "已保存",
    members: "成员",
    you: "你",
    remove: "移除",
    role: "角色",
    roles: { owner: "所有者", admin: "管理员", member: "成员" },
    invite: "通过邮箱邀请",
    emailPlaceholder: "tongshi@company.com",
    sendInvite: "发送邀请",
    sending: "正在发送…",
    inviteCreated: "已创建邀请——分享此链接：",
    copy: "复制",
    copied: "已复制",
    pendingInvites: "待处理的邀请",
    noPendingInvites: "没有待处理的邀请。",
    revoke: "撤销",
    expires: "{date} 过期",
    activity: "活动",
    noActivity: "暂无活动。",
    memberNote: "只有所有者和管理员可以管理团队。",
    acceptTitle: "接受你的邀请",
    acceptBody: "你被邀请加入 Conforma 上的一个工作区。",
    acceptButton: "接受邀请",
    acceptSignedOut: "使用受邀邮箱登录或创建账户以接受。",
    actions: {
      invited: "邀请了一位同事",
      joined: "加入了工作区",
      removed: "移除了一名成员",
      roleChanged: "更改了成员的角色",
      inviteRevoked: "撤销了一个邀请",
      orgRenamed: "重命名了工作区",
      apiKeyCreated: "创建了一个 API 密钥",
      apiKeyRevoked: "撤销了一个 API 密钥",
      generic: "{action}",
    },
    errors: {
      forbidden: "你没有执行此操作的权限。",
      invalidEmail: "请输入有效的邮箱地址。",
      alreadyInvited: "该邮箱已有待处理的邀请。",
      memberLimit: "您已达到当前套餐的成员上限。升级即可添加更多席位。",
      notAllowed: "不允许进行该更改。",
      invalidInvite: "此邀请无效、已过期或属于其他邮箱。",
      generic: "出了点问题。",
    },
  },

  /* ---------------------------------------------------------------- apiKeys */
  apiKeys: {
    title: "API 密钥",
    desc: "通过 REST API 以编程方式访问你的工作区。",
    nameLabel: "密钥名称",
    namePlaceholder: "生产集成",
    create: "创建密钥",
    creating: "正在创建…",
    created: "请立即复制你的新密钥——它不会再次显示：",
    copy: "复制",
    copied: "已复制",
    none: "暂无 API 密钥。",
    revoke: "撤销",
    revoked: "已撤销",
    createdOn: "创建于 {date}",
    lastUsed: "上次使用 {date}",
    neverUsed: "从未使用",
  },

  /* -------------------------------------------------------------- documents */
  documents: {
    title: "文档",
    subtitle: "为你的组织生成的合规文档。",
    nav: "文档",
    empty: "暂无文档——从系统报告中生成一个。",
    view: "查看",
    close: "关闭",
    generated: "生成于 {date}",
  },
};

export default zhCN;
