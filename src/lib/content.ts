/**
 * All site copy and data lives here so the template can be re-skinned for a
 * real client by editing a single file.
 */

export type Link = { label: string; href: string };

export const site = {
  name: "Lumen Metrics",
  shortName: "Lumen",
  tagline: "AI analytics that tells you why your numbers moved.",
  title: "Lumen Metrics: Know why your numbers moved",
  description:
    "Lumen watches every metric, flags what changed, and explains the cause in plain English, before your Monday meeting does.",
  url: "https://lumen-metrics-chi.vercel.app",
} as const;

/* ------------------------------------------------------------------ Nav */

export const nav: { links: Link[]; signIn: Link; cta: Link } = {
  links: [
    { label: "Product", href: "#product" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  signIn: { label: "Sign in", href: "#" },
  cta: { label: "Start free", href: "#pricing" },
};

/* ----------------------------------------------------------------- Hero */

export const hero = {
  eyebrow: { tag: "New", text: "Root-cause AI is live", href: "#how-it-works" },
  headline: { before: "Know", accent: "why", after: "your numbers moved." },
  sub: "Lumen watches every metric, flags what changed, and explains the cause in plain English, before your Monday meeting does.",
  primaryCta: { label: "Start free, no card", href: "#pricing" },
  secondaryCta: { label: "Watch 90-sec demo", href: "#how-it-works" },
  proof: ["Set up in 4 minutes", "Connects to Stripe, Postgres, Segment"],
};

/* ------------------------------------------------------ Dashboard mock */

export type Kpi = { label: string; value: string; delta: string; trend: "up" | "down"; good: boolean };

export const dashboard = {
  url: "app.lumenmetrics.io/revenue",
  title: "Weekly revenue",
  total: "$182.4k",
  range: ["7D", "14D", "30D"],
  activeRange: "14D",
  /** Daily revenue in $k for the last 14 days. Index 8 (Tue) is the dip. */
  series: [24.2, 25.1, 24.7, 25.9, 26.6, 24.1, 23.8, 26.3, 23.1, 26.9, 27.2, 27.6, 25.4, 25.0],
  expected: [24.6, 25.0, 25.3, 25.8, 26.2, 24.6, 24.3, 26.0, 26.3, 26.6, 26.9, 27.1, 25.6, 25.3],
  anomalyIndex: 8,
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  kpis: [
    { label: "MRR", value: "$184,230", delta: "6.2%", trend: "up", good: true },
    { label: "Churn", value: "2.1%", delta: "0.4%", trend: "down", good: true },
  ] satisfies Kpi[],
  insight: {
    label: "Lumen insight",
    title: "Revenue −12% on Tue.",
    cause: "checkout errors on Safari 18 after deploy #482.",
    impact: "$8.4k.",
  },
  checks: [
    { label: "Checkout conversion", status: "anomaly" },
    { label: "Trial → paid", status: "normal" },
    { label: "API latency", status: "normal" },
  ] as const,
  a11yLabel:
    "Lumen dashboard showing weekly revenue with an anomaly on Tuesday. Insight: Revenue down 12% on Tuesday, caused by checkout errors on Safari 18 after deploy 482, impact $8.4k. MRR $184,230 up 6.2%. Churn 2.1%, down 0.4%.",
};

/* ------------------------------------------------------------ Logo strip */

export const logoStrip = {
  label: "Trusted by data teams at",
  companies: ["Northwind", "Arcflow", "Quanta", "Helix Labs", "Parallel", "Corebase"],
};

/* ---------------------------------------------------------- How it works */

export const howItWorks = {
  id: "how-it-works",
  eyebrow: "How it works",
  steps: [
    { key: "detect", label: "Detect", text: "Lumen watches 100% of your metrics, 24/7." },
    { key: "explain", label: "Explain", text: "It traces the cause across your data." },
    { key: "act", label: "Act", text: "You get the answer in Slack, with the fix." },
  ],
  /** 3×3 grid of watched metrics. The `hot` one turns amber. */
  metrics: [
    { label: "Signups", value: "1,284" },
    { label: "Activation", value: "62%" },
    { label: "ARPU", value: "$48" },
    { label: "Trial → paid", value: "18.4%" },
    { label: "Sessions", value: "92k" },
    { label: "Checkout conv.", value: "3.1%", hot: true },
    { label: "Churn", value: "2.1%" },
    { label: "API latency", value: "182ms" },
    { label: "NPS", value: "54" },
  ],
  hotDelta: "−12%",
  sources: [
    { label: "Deploys", detail: "#482 · Safari 18", hot: true },
    { label: "Traffic", detail: "Normal" },
    { label: "Payments", detail: "Normal" },
  ],
  slack: {
    channel: "#revenue-alerts",
    app: "Lumen",
    time: "9:41 AM",
    title: "Revenue −12% on Tue.",
    body: "Cause: checkout errors on Safari 18 after deploy #482. Impact: $8.4k.",
    fix: "Suggested fix: roll back #482 or patch the Safari checkout handler.",
    cta: "View root cause",
  },
};
/* -------------------------------------------------------------- Features */

export const features = {
  id: "product",
  title: "Analytics that does the analysis.",
  items: [
    {
      key: "anomaly",
      title: "Anomaly detection",
      text: "Catch the spike or drop the moment it happens, not at month-end.",
    },
    {
      key: "insights",
      title: "Plain-English insights",
      text: "Every alert comes with the cause, the impact in dollars, and what to check next.",
      typed:
        "Signups fell 18% on Thursday. Cause: the “Spring-EU” ad campaign paused at 09:12 after hitting its budget cap. Impact: ~240 trials. Next: raise the cap or shift budget from “Brand-US”.",
      chips: ["Cause found", "Impact: ~240 trials", "Next step included"],
    },
    {
      key: "alerts",
      title: "Slack & email alerts",
      text: "Answers go where your team already works. No new dashboard to babysit.",
    },
  ],
};

/* ----------------------------------------------------------------- Stats */

export const stats = {
  items: [
    { value: 4, suffix: " min", label: "setup" },
    { value: 93, suffix: "%", label: "of anomalies explained automatically" },
    { value: 11, suffix: " hrs", label: "saved per analyst / week" },
  ],
  footnote: "Illustrative figures for a concept demo.",
};

/* --------------------------------------------------------------- Pricing */

export type Plan = {
  name: string;
  monthly: number | null;
  features: string[];
  cta: Link;
  highlighted?: boolean;
  badge?: string;
};

export const pricing = {
  id: "pricing",
  title: "Simple pricing. Cancel anytime.",
  yearlyNote: "2 months free",
  plans: [
    {
      name: "Starter",
      monthly: 29,
      features: ["10 metrics", "Daily checks", "Email alerts", "1 data source"],
      cta: { label: "Start free", href: "#" },
    },
    {
      name: "Growth",
      monthly: 99,
      highlighted: true,
      badge: "Most popular",
      features: ["100 metrics", "Hourly checks", "Slack + email", "Root-cause AI", "5 data sources"],
      cta: { label: "Start free", href: "#" },
    },
    {
      name: "Scale",
      monthly: null,
      features: ["Unlimited metrics", "Real-time", "SSO & audit logs", "Dedicated support"],
      cta: { label: "Contact sales", href: "#" },
    },
  ] satisfies Plan[],
};

/* ------------------------------------------------------------------- FAQ */

export const faq = {
  id: "faq",
  title: "Questions, answered.",
  items: [
    {
      q: "How long does setup take?",
      a: "Most teams connect their first source and get alerts in under 5 minutes.",
    },
    {
      q: "Which data sources do you support?",
      a: "Stripe, Postgres, BigQuery, Snowflake, Segment and Google Analytics, with more every month.",
    },
    {
      q: "Is my data secure?",
      a: "Read-only connections, encryption in transit and at rest, and SOC 2-ready controls.",
    },
    { q: "Can I cancel anytime?", a: "Yes. Monthly plans cancel in one click. No contracts." },
  ],
};

/* ------------------------------------------------------------- Final CTA */

export const finalCta = {
  title: "Stop guessing. Start knowing.",
  cta: { label: "Start free, no card", href: "#pricing" },
};

/* ---------------------------------------------------------------- Footer */

export const footer = {
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#product" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      // Placeholder targets until real pages exist.
      title: "Company",
      links: [
        { label: "About", href: "#top" },
        { label: "Customers", href: "#top" },
        { label: "Careers", href: "#top" },
        { label: "Contact", href: "mailto:joseph.prada.dev@gmail.com" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs", href: "#top" },
        { label: "Guides", href: "#top" },
        { label: "Status", href: "#top" },
        { label: "Security", href: "#faq" },
      ],
    },
  ] satisfies { title: string; links: Link[] }[],
  copyright: "© 2026 Lumen Metrics",
  credit: {
    before: "Concept demo designed & built by",
    name: "Joseph Prada",
    after: ": animated landing pages for SaaS.",
    link: { label: "Work with me →", href: "mailto:joseph.prada.dev@gmail.com" },
  },
};
