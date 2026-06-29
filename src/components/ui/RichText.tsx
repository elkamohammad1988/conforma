import React from "react";
import Link from "next/link";

/**
 * Tiny inline-markup renderer for translated legal copy. Supports paragraphs,
 * `- ` bullet lists, `**bold**`, and `[label](href)` links (internal links use
 * the Next router; `mailto:`/`http` use a plain anchor). Everything is rendered
 * as React nodes, so interpolated text is escaped automatically.
 */

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

function Anchor({ href, children }: { href: string; children: React.ReactNode }) {
  const cls = "font-medium text-brand-300 hover:underline";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(<strong key={`${keyBase}-b${i}`}>{tok.slice(2, -2)}</strong>);
    } else {
      const link = LINK.exec(tok);
      if (link) {
        out.push(
          <Anchor key={`${keyBase}-l${i}`} href={link[2]}>
            {link[1]}
          </Anchor>,
        );
      } else {
        out.push(tok);
      }
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({
  source,
  className = "",
}: {
  source: string;
  className?: string;
}) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*-\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul${key++}`} className="list-disc space-y-1.5 ps-5">
          {items.map((it, ii) => (
            <li key={ii}>{renderInline(it, `ul${key}-${ii}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    blocks.push(
      <p key={`p${key++}`} className="leading-relaxed">
        {renderInline(line, `p${key}`)}
      </p>,
    );
    i++;
  }

  return <div className={`space-y-3 ${className}`}>{blocks}</div>;
}
