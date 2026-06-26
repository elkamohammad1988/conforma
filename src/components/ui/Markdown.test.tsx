import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown } from "./Markdown";

const html = (source: string) => renderToStaticMarkup(<Markdown source={source} />);

describe("Markdown renderer", () => {
  it("renders headings, bold, italic and inline code", () => {
    const out = html("# Title\n\nSome **bold** and *italic* and `code` text.");
    expect(out).toContain("<h1>Title</h1>");
    expect(out).toContain("<strong>bold</strong>");
    expect(out).toContain("<em>italic</em>");
    expect(out).toContain("<code>code</code>");
  });

  it("renders bullet, ordered and task lists", () => {
    const out = html("- one\n- two\n\n1. first\n2. second\n\n- [ ] open\n- [x] done");
    expect(out).toContain("<ul>");
    expect(out).toContain("<ol>");
    expect(out).toContain("☐");
    expect(out).toContain("☑");
  });

  it("renders GitHub tables", () => {
    const out = html("| A | B |\n|---|---|\n| 1 | 2 |");
    expect(out).toContain("<table>");
    expect(out).toContain("<th>A</th>");
    expect(out).toContain("<td>1</td>");
  });

  it("renders blockquotes and horizontal rules", () => {
    const out = html("> note\n\n---");
    expect(out).toContain("<blockquote>");
    expect(out).toContain("<hr/>");
  });

  it("escapes embedded HTML — no XSS even with hostile input", () => {
    const out = html("# <script>alert('xss')</script>\n\nHello <img src=x onerror=alert(1)>");
    expect(out).not.toContain("<script>alert");
    expect(out).not.toContain("<img src=x");
    expect(out).toContain("&lt;script&gt;");
  });
});
