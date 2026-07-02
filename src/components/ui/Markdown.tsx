import React, { useMemo } from "react";

/**
 * Minimal, dependency-free Markdown renderer for Conforma's own generated
 * documents.
 *
 * It renders to React elements rather than HTML strings, so every piece of text
 * becomes a text node that React escapes automatically — there is no XSS surface
 * even though user-supplied system names and descriptions are interpolated into
 * the source upstream. It deliberately supports only the subset the document
 * templates emit: headings, bold / italic / inline-code, bullet · ordered · task
 * lists, blockquotes, GitHub tables, horizontal rules and paragraphs.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g;

function renderInline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(<strong key={`${key}-b${i}`}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      out.push(<code key={`${key}-c${i}`}>{tok.slice(1, -1)}</code>);
    } else {
      out.push(<em key={`${key}-i${i}`}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const isTableRow = (line: string) => /^\s*\|.*\|\s*$/.test(line);
const isTableDivider = (line: string) =>
  /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(line) && line.includes("-");
const splitCells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

function parseBlocks(src: string): React.ReactNode[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  // A *genuine* table starts a header row immediately followed by a divider.
  // Only this halts paragraph accumulation — a lone pipe-shaped line (which
  // Claude can emit) is then treated as prose, guaranteeing `i` always advances.
  const isTableStart = (idx: number) =>
    idx + 1 < lines.length &&
    isTableRow(lines[idx]) &&
    isTableDivider(lines[idx + 1]);

  while (i < lines.length) {
    const line = lines[i];

    // Blank line — skip.
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Horizontal rule.
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      blocks.push(<hr key={`hr${key++}`} />);
      i++;
      continue;
    }

    // Heading.
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const content = renderInline(heading[2], `h${key}`);
      const Tag = (["h1", "h2", "h3", "h4"] as const)[level - 1];
      blocks.push(<Tag key={`h${key++}`}>{content}</Tag>);
      i++;
      continue;
    }

    // Blockquote (consecutive `>` lines).
    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote key={`q${key++}`}>
          {renderInline(quote.join(" "), `q${key}`)}
        </blockquote>,
      );
      continue;
    }

    // Table (header row, divider, body rows).
    if (isTableStart(i)) {
      const header = splitCells(line);
      i += 2; // skip header + divider
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitCells(lines[i]));
        i++;
      }
      blocks.push(
        <div key={`t${key++}`} className="overflow-x-auto scrollbar-thin">
          <table>
            <thead>
            <tr>
              {header.map((c, ci) => (
                <th key={ci}>{renderInline(c, `th${key}-${ci}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => (
                  <td key={ci}>{renderInline(c, `td${key}-${ri}-${ci}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // Ordered list.
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={`ol${key++}`}>
          {items.map((it, ii) => (
            <li key={ii}>{renderInline(it, `ol${key}-${ii}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Bullet / task list.
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul${key++}`}>
          {items.map((raw, ii) => {
            const task = /^\[([ xX])\]\s+(.*)$/.exec(raw);
            if (task) {
              return (
                <li key={ii} className="list-none -ml-5 flex items-start gap-2">
                  <span
                    aria-hidden
                    className={
                      task[1].toLowerCase() === "x"
                        ? "text-ok-400"
                        : "text-ink-3"
                    }
                  >
                    {task[1].toLowerCase() === "x" ? "☑" : "☐"}
                  </span>
                  <span>{renderInline(task[2], `task${key}-${ii}`)}</span>
                </li>
              );
            }
            return <li key={ii}>{renderInline(raw, `ul${key}-${ii}`)}</li>;
          })}
        </ul>,
      );
      continue;
    }

    // Paragraph (consecutive plain lines). Because the current line reached this
    // branch it is neither blank nor the start of any other block (incl. a real
    // table), so the loop always consumes at least this line — `i` advances and
    // the outer `while` can never spin.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,4}\s|>\s?|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i]) &&
      !/^\s*([-*_])\1{2,}\s*$/.test(lines[i]) &&
      !isTableStart(i)
    ) {
      para.push(lines[i]);
      i++;
    }
    if (para.length) {
      blocks.push(
        <p key={`p${key++}`}>{renderInline(para.join(" "), `p${key}`)}</p>,
      );
    }
  }

  return blocks;
}

export function Markdown({
  source,
  className = "",
}: {
  source: string;
  className?: string;
}) {
  // Parsing is pure in `source`; memoize so the preview/raw view toggle doesn't
  // re-parse a multi-hundred-line document on every render.
  const blocks = useMemo(() => parseBlocks(source), [source]);
  return <div className={`prose-rendered ${className}`}>{blocks}</div>;
}
