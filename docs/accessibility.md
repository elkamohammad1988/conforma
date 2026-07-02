# Accessibility statement

Conforma aims to conform to **WCAG 2.1 Level AA**. Accessibility is treated as part
of "done", not a later pass. This statement records what is implemented, what is
known to fall short, and how to report an issue.

## What's implemented

- **Semantic structure** — landmark elements (`header`, `nav`, `main`, `footer`),
  a single `h1` per page, and ordered headings.
- **Keyboard operable** — every interactive control is reachable and operable by
  keyboard. A **skip-to-content** link is the first focusable element on the page.
- **Visible focus** — a consistent `:focus-visible` outline on links, buttons,
  switches and `tabindex` targets ([`globals.css`](../src/app/globals.css)).
- **Dialogs done right** — the confirm dialog and the mobile navigation are
  `role="dialog"` / `aria-modal`, **trap focus**, close on `Escape` and
  backdrop-click, restore focus to the trigger, and lock body scroll while open.
- **Reduced motion** — all animation and smooth scrolling collapse under
  `prefers-reduced-motion: reduce`.
- **Colour contrast** — text colours are tokenised to clear AA (≥ 4.5:1) on both
  the dark and light themes, including small muted labels.
- **Two themes** — a light theme for users who need a brighter, higher-contrast
  ground; the choice is remembered per device.
- **Internationalised & RTL** — five locales with full right-to-left mirroring for
  Arabic, built on CSS logical properties.
- **Labels & status** — icon-only controls carry `aria-label`s; transient feedback
  is announced through polite/assertive live regions (toasts); loading states use
  skeletons rather than empty flashes.
- **Non-colour cues** — risk tiers pair colour with text labels and distinct
  shapes, so meaning never depends on colour alone.

## Known limitations

- Contrast and screen-reader behaviour are verified manually and with automated
  tooling; a formal third-party audit has not been commissioned.
- Some dense data tables scroll horizontally on very small viewports rather than
  reflowing into cards.
- The cinematic background is decorative (`aria-hidden`) and softened in the light
  theme; it is not exposed to assistive technology.

## Reporting

Found a barrier? Please
[open an issue](https://github.com/elkamohammad1988/conforma/issues) describing the
page, your assistive technology, and what you expected. Accessibility bugs are
triaged with the same priority as functional bugs.
