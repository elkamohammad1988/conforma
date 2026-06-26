import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classify an AI system",
  description:
    "Answer a few questions and get an EU AI Act risk classification with cited Articles, the obligations that apply, and your compliance deadline — in 30 seconds.",
};

export default function ClassifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
