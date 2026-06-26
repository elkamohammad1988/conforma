import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI system",
  robots: { index: false, follow: false },
};

export default function SystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
