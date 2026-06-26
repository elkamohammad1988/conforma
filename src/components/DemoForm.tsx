"use client";

import { useState } from "react";
import Link from "next/link";

export function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "Compliance / Legal",
    systems: "1–10",
    message: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (submitted) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
          ✓
        </div>
        <h2 className="mt-5 text-2xl font-bold">Thanks, {form.name || "there"}!</h2>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          A member of our team will reach out to{" "}
          <span className="font-medium text-slate-800">
            {form.email || "your email"}
          </span>{" "}
          within one business day to schedule your walkthrough.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Can&apos;t wait? You can{" "}
          <Link href="/classify" className="font-medium text-brand-700 hover:underline">
            classify a system right now
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <L label="Full name">
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={input}
            placeholder="Jane Doe"
          />
        </L>
        <L label="Work email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={input}
            placeholder="jane@company.com"
          />
        </L>
        <L label="Company">
          <input
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className={input}
            placeholder="Company Ltd"
          />
        </L>
        <L label="Your role">
          <select
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            className={input}
          >
            {[
              "Compliance / Legal",
              "AI / Product",
              "Security / IT",
              "Executive",
              "Other",
            ].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </L>
        <L label="AI systems in scope">
          <select
            value={form.systems}
            onChange={(e) => set("systems", e.target.value)}
            className={input}
          >
            {["1–10", "11–50", "51–200", "200+"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </L>
        <div className="sm:col-span-2">
          <L label="Anything we should know?" optional>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className={`${input} resize-none`}
              placeholder="Your timeline, the systems you're worried about, etc."
            />
          </L>
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Request a demo
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">
        We&apos;ll never share your details. By submitting you agree to be
        contacted about Conforma.
      </p>
    </form>
  );
}

const input =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

function L({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 text-slate-400">(optional)</span>}
      </span>
      {children}
    </label>
  );
}
