---
name: srm-asset-design
description: Use this skill to generate well-branded interfaces and assets for SRM Asset, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the SRM web platform — a Brazilian FIDC and antecipação-de-recebíveis product.
user-invocable: true
---

Read the `README.md` file within this skill to load the brand foundations — content tone (pt-BR, institutional, no emoji), visual rules (white as primary surface, blue `#2461AF` and orange `#D45200` as accents only), iconography (Lucide), and tabular-numeral requirements for any financial data.

Then explore:

- `colors_and_type.css` — all design tokens (CSS vars: `--srm-blue-*`, `--srm-orange-*`, `--fg-*`, `--bg-*`, `--space-*`, `--radius-*`, `--shadow-*`). **Include this stylesheet in any HTML output.**
- `assets/` — `logo-icon.png` (hexagon mark) and `logo-full.png` (lockup). Reference these for any branding moment.
- `preview/` — small specimen cards demonstrating tokens in use (type, colors, spacing, components, brand).
- `ui_kits/srm-platform/` — high-fidelity React JSX recreation of the SRM web platform (Login, Dashboard, Nova Antecipação 3-step flow, Operações table, Investidor view). Read `ui.jsx` for component primitives (`Button`, `Card`, `Badge`, `Input`, `KPI`, `Eyebrow`, `Avatar`, `Icon`) and copy them into new prototypes.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out into the artifact's folder and create static HTML files for the user to view. If working on production code, copy the tokens from `colors_and_type.css` and reuse the JSX components as references.

If the user invokes this skill without any other guidance, ask them what they want to build or design (a marketing page, a new screen for the platform, a pitch slide for investors, etc.), ask 3–5 clarifying questions (audience, surface, content sources, variations), and act as an expert designer who outputs HTML artifacts or production code, depending on the need.

**Hard rules**:

- pt-BR copy by default; never use emoji in product or institutional surfaces.
- White is always the dominant surface. Blue and orange are accent-only — never fill a page or hero with them.
- All numbers use tabular-numeral formatting and pt-BR locale (`R$ 1.234,56`, `28 abr 2026`, `1,49% a.m.`).
- All color pairs must meet WCAG AA contrast.
- Icons come from Lucide; never substitute with emoji or unicode glyphs.
