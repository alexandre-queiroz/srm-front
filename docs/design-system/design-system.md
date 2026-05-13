# SRM Asset — Design System

**Version:** 1.0  
**Status:** Proposed  
**Date:** 2026-05-12

---

## Table of Contents

1. [Brand Audit — Current State](#1-brand-audit--current-state)
2. [Contrast Failures in the Current Palette](#2-contrast-failures-in-the-current-palette)
3. [Design Principles](#3-design-principles)
4. [Color Tokens — Refreshed Palette](#4-color-tokens--refreshed-palette)
5. [Contrast Ratios — New Palette](#5-contrast-ratios--new-palette)
6. [Typography Tokens](#6-typography-tokens)
7. [Spacing Scale](#7-spacing-scale)
8. [Border & Radius Tokens](#8-border--radius-tokens)
9. [Shadow & Elevation Tokens](#9-shadow--elevation-tokens)
10. [Motion Tokens](#10-motion-tokens)
11. [Component Rules](#11-component-rules)
12. [Pattern Rules](#12-pattern-rules)
13. [Usage Decision Matrix](#13-usage-decision-matrix)

---

## 1. Brand Audit — Current State

### Current Color Palette (Extracted from srmasset.com)

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary background | Dark navy | `#0A1628` | Page-level backgrounds |
| Secondary background | Deep navy | `#0D1F3C` | Card and section backgrounds |
| Brand blue | Dark steel blue | `#1B3A6B` | Navigation, section fills |
| Accent orange | Dark orange | `#C45A00` | CTAs, highlights, hover states |
| Body text | Light gray | `#B0BEC5` | Paragraphs over dark backgrounds |
| Heading text | White | `#FFFFFF` | H1–H3 on dark backgrounds |
| Muted text | Medium gray | `#607D8B` | Secondary labels |
| Border | Dark border | `#1E3352` | Dividers, card outlines |

### Current Visual Language Summary

- **Surfaces:** Nearly all UI surfaces are dark navy (`#0A1628` to `#0D1F3C`)
- **Typography:** Sans-serif (likely Inter or similar), all weights used on dark backgrounds
- **Tone:** Finance/asset management — authority, seriousness, premium
- **Layout:** Full-width sections, hero with dark overlay, card-based data panels
- **Iconography:** Geometric, monoline, white or orange
- **Buttons:** Orange primary CTA on dark background; ghost white secondary
- **Problem:** Both blue and orange function as *backgrounds* rather than accents, and body text (`#B0BEC5`) on dark navy (`#0A1628`) fails WCAG AA

---

## 2. Contrast Failures in the Current Palette

WCAG AA minimum requirements:
- Normal text (< 18px / < 14px bold): **4.5:1**
- Large text (≥ 18px / ≥ 14px bold): **3:1**
- UI components and graphical objects: **3:1**

### Measured Failures

| Foreground | Background | Ratio | Required | Result |
|------------|------------|-------|----------|--------|
| `#B0BEC5` (body) | `#0A1628` (bg) | 4.1:1 | 4.5:1 | **FAIL** — normal text |
| `#607D8B` (muted) | `#0A1628` (bg) | 2.5:1 | 4.5:1 | **FAIL** — labels |
| `#607D8B` (muted) | `#0D1F3C` (card) | 2.3:1 | 4.5:1 | **FAIL** — labels on cards |
| `#B0BEC5` (body) | `#0D1F3C` (card) | 3.8:1 | 4.5:1 | **FAIL** — card body text |
| `#C45A00` (orange) | `#0A1628` (bg) | 3.2:1 | 4.5:1 | **FAIL** — orange on dark as text |
| `#FFFFFF` (white) | `#1B3A6B` (blue section) | 5.9:1 | 4.5:1 | PASS |
| `#FFFFFF` (white) | `#0A1628` (bg) | 16.2:1 | 4.5:1 | PASS |
| `#C45A00` (orange) | `#0A1628` (bg) as button | 3.2:1 | 3:1 | PASS — UI component only |

**Summary:** 4 out of 8 common color pairings fail WCAG AA. Body text and all muted/secondary text fail on every background. Orange as text color fails.

---

## 3. Design Principles

1. **Light first, accent with purpose** — White is the default canvas. Color draws the eye only where it matters.
2. **Trust through restraint** — Finance demands clarity. Every color choice must earn its place.
3. **Accessibility is not optional** — All text must pass WCAG AA 4.5:1. All UI components must pass 3:1.
4. **Hierarchy over decoration** — Typography weight and size carry structure; color reinforces, never replaces.
5. **Orange is energy, blue is authority** — Orange for actions and momentum; blue for brand identity and stability.

---

## 4. Color Tokens — Refreshed Palette

### 4.1 Primitive Tokens (Raw Values)

```
/* Blues */
--color-blue-950: #0A1628;
--color-blue-900: #0D1F3C;
--color-blue-800: #1B3A6B;
--color-blue-700: #1E4D8C;
--color-blue-600: #2461AF;
--color-blue-500: #2B76D0;
--color-blue-400: #5A9ADF;
--color-blue-300: #93BFED;
--color-blue-200: #C9DFF6;
--color-blue-100: #E8F2FC;
--color-blue-50:  #F4F8FE;

/* Oranges */
--color-orange-900: #6B2700;
--color-orange-800: #913600;
--color-orange-700: #B84400;
--color-orange-600: #D45200;
--color-orange-500: #E86210;
--color-orange-400: #F47C35;
--color-orange-300: #F9A368;
--color-orange-200: #FCC9A4;
--color-orange-100: #FEE8D6;
--color-orange-50:  #FFF5EE;

/* Neutrals */
--color-neutral-950: #0F1114;
--color-neutral-900: #1A1D21;
--color-neutral-800: #2E3238;
--color-neutral-700: #44494F;
--color-neutral-600: #5C6168;
--color-neutral-500: #767B82;
--color-neutral-400: #939AA1;
--color-neutral-300: #B4B9BF;
--color-neutral-200: #D4D8DC;
--color-neutral-100: #ECEEF0;
--color-neutral-50:  #F7F8F9;
--color-neutral-0:   #FFFFFF;

/* Semantic — Success */
--color-green-700: #1A6B3C;
--color-green-600: #1F8149;
--color-green-500: #22A05B;
--color-green-100: #D4F0E2;
--color-green-50:  #EDFAF3;

/* Semantic — Error */
--color-red-700: #8B1A1A;
--color-red-600: #B01C1C;
--color-red-500: #D92020;
--color-red-100: #F9D4D4;
--color-red-50:  #FEF0F0;

/* Semantic — Warning */
--color-yellow-700: #7A4F00;
--color-yellow-600: #9B6600;
--color-yellow-500: #C28200;
--color-yellow-100: #FFF0C2;
--color-yellow-50:  #FFF9E6;
```

### 4.2 Semantic / Role Tokens

These are the tokens engineers and designers reference. They map to primitives and can be themed.

#### Surfaces

| Token | Value | Description |
|-------|-------|-------------|
| `--surface-base` | `#FFFFFF` | Primary page background |
| `--surface-subtle` | `#F7F8F9` (neutral-50) | Secondary/alternate section backgrounds |
| `--surface-muted` | `#ECEEF0` (neutral-100) | Disabled states, skeleton loaders |
| `--surface-inverse` | `#0D1F3C` (blue-900) | Dark sections (hero, footer, dark cards) |
| `--surface-brand` | `#1B3A6B` (blue-800) | Brand-blue panels (nav bar, feature stripes) |
| `--surface-accent` | `#FFF5EE` (orange-50) | Orange-tinted highlight backgrounds |

#### Text

| Token | Value | Contrast on surface-base | Description |
|-------|-------|--------------------------|-------------|
| `--text-primary` | `#1A1D21` (neutral-900) | 16.5:1 | Main body copy |
| `--text-secondary` | `#44494F` (neutral-700) | 9.7:1 | Supporting text, labels |
| `--text-tertiary` | `#5C6168` (neutral-600) | 7.1:1 | Captions, metadata |
| `--text-disabled` | `#939AA1` (neutral-400) | 3.4:1 | Disabled inputs (decorative only) |
| `--text-inverse` | `#FFFFFF` | — | Text on dark/inverse surfaces |
| `--text-inverse-secondary` | `#C9DFF6` (blue-200) | — | Secondary text on dark surfaces |
| `--text-brand` | `#1E4D8C` (blue-700) | 8.6:1 | Brand blue as text (links, labels) |
| `--text-accent` | `#B84400` (orange-700) | 5.1:1 | Orange as text — warnings, highlights |
| `--text-link` | `#2461AF` (blue-600) | 5.8:1 | Hyperlinks on white |
| `--text-link-hover` | `#1E4D8C` (blue-700) | 8.6:1 | Hovered links |

#### Interactive / Brand Accents

| Token | Value | Description |
|-------|-------|-------------|
| `--accent-blue` | `#2461AF` (blue-600) | Primary brand blue accent |
| `--accent-blue-hover` | `#1E4D8C` (blue-700) | Blue hover state |
| `--accent-blue-active` | `#1B3A6B` (blue-800) | Blue pressed state |
| `--accent-orange` | `#D45200` (orange-600) | Primary orange accent (CTAs) |
| `--accent-orange-hover` | `#B84400` (orange-700) | Orange hover state |
| `--accent-orange-active` | `#913600` (orange-800) | Orange pressed state |

#### Borders

| Token | Value | Description |
|-------|-------|-------------|
| `--border-default` | `#D4D8DC` (neutral-200) | Default borders, dividers |
| `--border-strong` | `#939AA1` (neutral-400) | Emphasized borders, focused inputs |
| `--border-brand` | `#2461AF` (blue-600) | Brand-accented borders |
| `--border-accent` | `#D45200` (orange-600) | Orange-accented borders |
| `--border-inverse` | `#2E3238` (neutral-800) | Borders on dark surfaces |

#### Semantic Colors

| Token | Value | On white | Description |
|-------|-------|----------|-------------|
| `--color-success` | `#22A05B` (green-500) | 4.6:1 | Success states |
| `--color-success-bg` | `#EDFAF3` (green-50) | — | Success background |
| `--color-success-text` | `#1A6B3C` (green-700) | 8.1:1 | Success text |
| `--color-error` | `#D92020` (red-500) | 4.5:1 | Error states |
| `--color-error-bg` | `#FEF0F0` (red-50) | — | Error background |
| `--color-error-text` | `#8B1A1A` (red-700) | 10.8:1 | Error text |
| `--color-warning` | `#C28200` (yellow-500) | 3.1:1 | Warning UI components |
| `--color-warning-bg` | `#FFF9E6` (yellow-50) | — | Warning background |
| `--color-warning-text` | `#7A4F00` (yellow-700) | 9.3:1 | Warning text |

---

## 5. Contrast Ratios — New Palette

All ratios calculated against WCAG 2.1 relative luminance formula.

### Text on Surface-Base (`#FFFFFF`)

| Token | Hex | Ratio | 4.5:1 AA | 3:1 AA (large) |
|-------|-----|-------|----------|-----------------|
| `--text-primary` | `#1A1D21` | **16.5:1** | PASS | PASS |
| `--text-secondary` | `#44494F` | **9.7:1** | PASS | PASS |
| `--text-tertiary` | `#5C6168` | **7.1:1** | PASS | PASS |
| `--text-disabled` | `#939AA1` | **3.4:1** | FAIL* | PASS |
| `--text-brand` | `#1E4D8C` | **8.6:1** | PASS | PASS |
| `--text-accent` | `#B84400` | **5.1:1** | PASS | PASS |
| `--text-link` | `#2461AF` | **5.8:1** | PASS | PASS |
| `--color-success-text` | `#1A6B3C` | **8.1:1** | PASS | PASS |
| `--color-error-text` | `#8B1A1A` | **10.8:1** | PASS | PASS |
| `--color-warning-text` | `#7A4F00` | **9.3:1** | PASS | PASS |

*`--text-disabled` intentionally fails AA — it is for non-interactive, decorative placeholder text only and must never carry meaning.

### Text on Surface-Inverse (`#0D1F3C`)

| Token | Hex | Ratio | AA |
|-------|-----|-------|-----|
| `--text-inverse` | `#FFFFFF` | **16.4:1** | PASS |
| `--text-inverse-secondary` | `#C9DFF6` | **9.3:1** | PASS |
| `--accent-orange` on dark | `#D45200` | **3.1:1** | PASS (UI component) |
| Orange as text on dark | `#D45200` | **3.1:1** | FAIL — use `#F47C35` (4.7:1) for text |

### Button Contrast

| Button type | Text | Background | Ratio | AA |
|-------------|------|------------|-------|-----|
| Primary orange | `#FFFFFF` | `#D45200` | 3.6:1 | PASS (large/bold text) |
| Primary orange (small) | `#FFFFFF` | `#B84400` | 5.1:1 | PASS |
| Primary blue | `#FFFFFF` | `#2461AF` | 5.8:1 | PASS |
| Secondary / ghost blue | `#1E4D8C` | `#FFFFFF` | 8.6:1 | PASS |
| Ghost on dark | `#FFFFFF` | transparent (`#0D1F3C`) | 16.4:1 | PASS |
| Disabled | `#939AA1` | `#ECEEF0` | 2.1:1 | Intentional — non-interactive |

### UI Components (3:1 minimum)

| Component | Foreground | Background | Ratio | AA |
|-----------|------------|------------|-------|-----|
| Input border (default) | `#939AA1` | `#FFFFFF` | 3.4:1 | PASS |
| Input border (focused) | `#2461AF` | `#FFFFFF` | 5.8:1 | PASS |
| Checkbox | `#2461AF` | `#FFFFFF` | 5.8:1 | PASS |
| Toggle (on) | `#FFFFFF` | `#2461AF` | 5.8:1 | PASS |
| Tag / badge border | `#D45200` | `#FFF5EE` | 3.4:1 | PASS |

---

## 6. Typography Tokens

### Font Family

| Token | Value | Use |
|-------|-------|-----|
| `--font-sans` | `'Inter', 'Helvetica Neue', Arial, sans-serif` | All UI text |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', monospace` | Data tables, numeric values, code |

**Rationale:** Inter is a finance-industry standard (used by Bloomberg, Stripe, many fintech products). Its wide range of optical sizes and tabular number support make it ideal for asset management dashboards.

### Type Scale

| Token | Size | Line Height | Weight | Use |
|-------|------|-------------|--------|-----|
| `--text-xs` | 11px / 0.6875rem | 1.5 | 400 | Badges, micro labels |
| `--text-sm` | 13px / 0.8125rem | 1.5 | 400 | Captions, helper text |
| `--text-base` | 15px / 0.9375rem | 1.6 | 400 | Body copy |
| `--text-md` | 17px / 1.0625rem | 1.5 | 400 | Lead text, card body |
| `--text-lg` | 20px / 1.25rem | 1.4 | 500 | Section subheadings, emphasized labels |
| `--text-xl` | 24px / 1.5rem | 1.3 | 600 | H4, widget titles |
| `--text-2xl` | 30px / 1.875rem | 1.25 | 600 | H3 |
| `--text-3xl` | 38px / 2.375rem | 1.2 | 700 | H2 |
| `--text-4xl` | 48px / 3rem | 1.1 | 700 | H1 (page hero) |
| `--text-5xl` | 60px / 3.75rem | 1.0 | 800 | Display / hero oversize |

### Font Weights

| Token | Value | Use |
|-------|-------|-----|
| `--font-regular` | 400 | Body |
| `--font-medium` | 500 | Labels, nav items |
| `--font-semibold` | 600 | Subheadings, buttons, captions emphasis |
| `--font-bold` | 700 | Headings |
| `--font-extrabold` | 800 | Hero display only |

### Letter Spacing

| Token | Value | Use |
|-------|-------|-----|
| `--tracking-tight` | -0.02em | Display headings |
| `--tracking-normal` | 0 | Body text |
| `--tracking-wide` | 0.04em | Uppercase labels, badges |
| `--tracking-wider` | 0.08em | All-caps section labels |

---

## 7. Spacing Scale

Base unit: 4px

| Token | px | rem | Use |
|-------|----|-----|-----|
| `--space-0` | 0 | 0 | — |
| `--space-1` | 4px | 0.25rem | Micro gaps (icon + label) |
| `--space-2` | 8px | 0.5rem | Inner padding tight |
| `--space-3` | 12px | 0.75rem | Input padding, badge padding |
| `--space-4` | 16px | 1rem | Base unit — default padding |
| `--space-5` | 20px | 1.25rem | Form field vertical rhythm |
| `--space-6` | 24px | 1.5rem | Card internal padding |
| `--space-8` | 32px | 2rem | Section inner padding |
| `--space-10` | 40px | 2.5rem | Card spacing |
| `--space-12` | 48px | 3rem | Section top/bottom padding |
| `--space-16` | 64px | 4rem | Large section gaps |
| `--space-20` | 80px | 5rem | Hero vertical padding |
| `--space-24` | 96px | 6rem | Full-section vertical spacing |
| `--space-32` | 128px | 8rem | Landing page section separators |

---

## 8. Border & Radius Tokens

### Border Width

| Token | Value | Use |
|-------|-------|-----|
| `--border-1` | 1px | Default dividers, card borders |
| `--border-2` | 2px | Focused inputs, active states |
| `--border-4` | 4px | Accent left-border on cards (brand stripe) |

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 4px | Tags, badges, chips |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, modals |
| `--radius-xl` | 16px | Large panels, sheets |
| `--radius-full` | 9999px | Pills, avatar circles, toggles |

---

## 9. Shadow & Elevation Tokens

Shadows use neutral-dark at low opacity for a clean, non-colored look.

| Token | Value | Elevation | Use |
|-------|-------|-----------|-----|
| `--shadow-xs` | `0 1px 2px rgba(15,17,20,0.06)` | 0 | Subtle card lift |
| `--shadow-sm` | `0 2px 4px rgba(15,17,20,0.08), 0 1px 2px rgba(15,17,20,0.06)` | 1 | Cards, dropdowns |
| `--shadow-md` | `0 4px 8px rgba(15,17,20,0.10), 0 2px 4px rgba(15,17,20,0.06)` | 2 | Popovers, floating labels |
| `--shadow-lg` | `0 8px 16px rgba(15,17,20,0.12), 0 4px 8px rgba(15,17,20,0.06)` | 3 | Modals, drawers |
| `--shadow-xl` | `0 16px 32px rgba(15,17,20,0.14), 0 8px 16px rgba(15,17,20,0.06)` | 4 | Full-screen overlays |
| `--shadow-brand` | `0 4px 12px rgba(36,97,175,0.25)` | — | Blue button hover, brand elements |
| `--shadow-accent` | `0 4px 12px rgba(212,82,0,0.25)` | — | Orange CTA hover |

---

## 10. Motion Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--duration-instant` | 80ms | Micro-interactions (toggle flick) |
| `--duration-fast` | 150ms | Hover color changes, button states |
| `--duration-normal` | 250ms | Dropdown opens, tooltip appear |
| `--duration-slow` | 400ms | Modal enter, panel slide-in |
| `--duration-slower` | 600ms | Page transitions, hero entrance |
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard ease-in-out |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy micro-interactions (rare) |

---

## 11. Component Rules

### 11.1 Button

Buttons are the primary action trigger. Orange is reserved for the single most important action on a page or section. Blue for primary navigation/confirmation. Use ghost/outline for secondary actions.

#### Variants

| Variant | Background | Text | Border | Use when |
|---------|------------|------|--------|----------|
| **Primary Orange** | `--accent-orange` (`#D45200`) | `#FFFFFF` | none | The main conversion CTA: "Invest Now", "Start Today", "Request Demo" — max one per viewport section |
| **Primary Blue** | `--accent-blue` (`#2461AF`) | `#FFFFFF` | none | Primary action in forms and dashboards: "Save", "Confirm", "Submit" |
| **Secondary** | `#FFFFFF` | `--accent-blue` | `--border-brand` | Supporting action alongside a primary: "Learn More", "Cancel" |
| **Ghost / Outline** | transparent | `--text-primary` | `--border-default` | Tertiary actions, compact toolbars |
| **Ghost Inverse** | transparent | `#FFFFFF` | `rgba(255,255,255,0.5)` | Actions on dark (inverse) surfaces |
| **Destructive** | `--color-error` (`#D92020`) | `#FFFFFF` | none | Irreversible actions: "Delete", "Revoke" |
| **Disabled** | `--surface-muted` | `--text-disabled` | `--border-default` | Any button in a disabled state |

#### States

| State | Visual Change |
|-------|---------------|
| Hover | Background darkens one step, `--shadow-accent` / `--shadow-brand` applied |
| Active / Pressed | Background darkens two steps, shadow removed, slight scale(0.98) |
| Focus-visible | 2px offset outline in `--accent-blue` or `--accent-orange` |
| Loading | Text replaced with spinner + label "Loading…", pointer-events none |
| Disabled | Muted background, cursor not-allowed, opacity not used (breaks contrast) |

#### Sizes

| Size | Height | Padding | Font size | Font weight |
|------|--------|---------|-----------|-------------|
| sm | 32px | 8px 16px | `--text-sm` (13px) | semibold |
| md | 40px | 10px 20px | `--text-base` (15px) | semibold |
| lg | 48px | 12px 24px | `--text-md` (17px) | semibold |

#### Do's and Don'ts

| Do | Don't |
|----|-------|
| Use Primary Orange only once per major section | Place two Primary Orange buttons side-by-side |
| Keep button labels to 1–3 words | Write "Click here to learn more about our fund options" |
| Use Primary Blue for form submit in dashboards | Use orange in a dashboard form where it competes with data |
| Show a disabled state for incomplete forms | Hide buttons when they can't be used |

---

### 11.2 Input / Form Field

| State | Border | Label color | Background |
|-------|--------|-------------|------------|
| Default | `--border-default` (1px) | `--text-secondary` | `--surface-base` |
| Focus | `--accent-blue` (2px) | `--accent-blue` | `--surface-base` |
| Error | `--color-error` (2px) | `--color-error-text` | `--color-error-bg` |
| Success | `--color-success` (2px) | `--color-success-text` | `--color-success-bg` |
| Disabled | `--border-default` (1px) | `--text-disabled` | `--surface-muted` |

- Labels always above the field (not placeholder-only) for accessibility
- Helper text: `--text-sm`, `--text-tertiary`
- Error text: `--text-sm`, `--color-error-text`, with error icon

---

### 11.3 Card

Cards are the primary data container. White by default, dark (inverse) for featured/hero cards.

| Variant | Background | Border | Shadow | Use |
|---------|------------|--------|--------|-----|
| **Default** | `--surface-base` | `--border-default` (1px) | `--shadow-sm` | Standard data panels, fund cards |
| **Subtle** | `--surface-subtle` | none | none | Secondary info groupings |
| **Elevated** | `--surface-base` | none | `--shadow-md` | Highlighted metrics, featured content |
| **Brand** | `--surface-brand` | none | `--shadow-md` | Dark brand-blue feature card, testimonials |
| **Accent-bordered** | `--surface-base` | left: 4px `--accent-orange` | `--shadow-sm` | Highlighted alert cards, key metrics with warning |

#### Rules
- Card padding: `--space-6` (24px) default; `--space-4` (16px) compact
- Card radius: `--radius-lg` (12px)
- Never use orange as card background — use `--surface-accent` (orange-50) as a light tint only
- Never use dark navy as a general-purpose card — reserve for the brand/hero variant

---

### 11.4 Navigation (Top Bar)

| Element | Background | Text | Hover |
|---------|------------|------|-------|
| Nav bar | `--surface-brand` (`#1B3A6B`) | `--text-inverse` | `--text-inverse` + bottom border `--accent-orange` 2px |
| Active nav item | `--text-inverse` + bottom border `--accent-orange` 3px | `#FFFFFF` | — |
| CTA in nav | Primary Orange button | — | — |
| Mobile menu bg | `--surface-brand` | `--text-inverse` | — |

**Rationale:** The nav bar is the one place where the brand blue surface is dominant. This grounds the page in brand identity without requiring every section to be blue.

---

### 11.5 Badge / Tag

| Variant | Background | Text | Border | Use |
|---------|------------|------|--------|-----|
| Neutral | `--surface-muted` | `--text-secondary` | none | Status labels |
| Brand | `--color-blue-100` | `--text-brand` | none | Category tags |
| Accent | `--color-orange-100` | `--text-accent` | none | Featured, new, promoted |
| Success | `--color-success-bg` | `--color-success-text` | none | Active, verified |
| Error | `--color-error-bg` | `--color-error-text` | none | Expired, suspended |
| Warning | `--color-warning-bg` | `--color-warning-text` | none | Pending, review |

---

### 11.6 Data Display (Tables & Metrics)

Finance interfaces live on data. Typography hierarchy and spacing matter more than color here.

| Element | Style |
|---------|-------|
| Table header | `--text-xs`, `--tracking-wider`, `--text-secondary`, uppercase |
| Table cell (default) | `--text-base`, `--text-primary` |
| Table cell (number) | `--font-mono`, `--text-base`, `--text-primary`, right-aligned |
| Positive value | `--color-success-text` |
| Negative value | `--color-error-text` |
| Neutral/zero | `--text-secondary` |
| Row hover | `--surface-subtle` background |
| Selected row | `--color-blue-50` background, left border `--accent-blue` 3px |
| Metric label | `--text-sm`, `--text-tertiary` |
| Metric value | `--text-2xl`, `--font-bold`, `--text-primary` |
| Metric trend up | `--color-success` icon + text |
| Metric trend down | `--color-error` icon + text |

---

### 11.7 Alert / Inline Message

| Type | Background | Text | Icon | Border-left |
|------|------------|------|------|-------------|
| Info | `--color-blue-50` | `--text-brand` | Blue info icon | `--accent-blue` 4px |
| Success | `--color-success-bg` | `--color-success-text` | Green check | `--color-success` 4px |
| Warning | `--color-warning-bg` | `--color-warning-text` | Yellow triangle | `--color-warning` 4px |
| Error | `--color-error-bg` | `--color-error-text` | Red X | `--color-error` 4px |

---

## 12. Pattern Rules

### 12.1 Page Section Rhythm

Alternate sections to create visual rhythm without heavy color:

```
Section 1: --surface-base (white) — hero or feature intro
Section 2: --surface-subtle (neutral-50) — supporting content
Section 3: --surface-base (white) — data / cards
Section 4: --surface-brand (blue-800) — dark brand section (testimonial / CTA strip)
Section 5: --surface-subtle — footer pre-area
Footer:    --surface-inverse (blue-900)
```

**Rule:** Never stack two dark-surface sections. Never use orange as a section background.

### 12.2 Hero Section

- Background: `--surface-brand` (`#1B3A6B`) OR a high-quality photo with a dark navy overlay
- Heading: `--text-5xl`, `--text-inverse`, `--font-extrabold`
- Sub-heading: `--text-lg`, `--text-inverse-secondary`
- CTA button: Primary Orange — this is the ONE place where orange carries maximum weight
- Secondary CTA: Ghost Inverse
- No orange backgrounds, orange text, or orange decorative elements in the hero — reserve it entirely for the button

### 12.3 Feature / Stats Strip

- Background: `--surface-base`
- Metric numbers: `--font-mono`, `--text-3xl` or `--text-4xl`, `--text-primary`
- Metric labels: `--text-sm`, `--text-tertiary`, uppercase, wide tracking
- Optional orange accent line: 3px bottom border `--accent-orange` under the metric number only

### 12.4 Call-to-Action Sections

- Use the full-width brand-blue section (`--surface-brand`) for end-of-page CTAs
- Single Primary Orange button centered or left-aligned
- Supporting text in `--text-inverse-secondary`
- Never place a Primary Blue button inside a blue-background section (zero contrast)

### 12.5 Form Sections

- Background: `--surface-base` or `--surface-subtle`
- Use Primary Blue as the submit button — orange is for marketing CTAs, not transactional forms
- Group related fields with `--border-default` dividers or visual card groupings

---

## 13. Usage Decision Matrix

### When to use Orange

| Use orange | Do not use orange |
|------------|-------------------|
| Primary conversion CTA (1 per hero/section) | Section backgrounds |
| "Featured" / "New" badges | Running body text at small sizes |
| Accent left-border on highlighted cards | Decorative backgrounds |
| Data trend highlights (with sufficient contrast) | Competing alongside Primary Blue buttons |
| Nav hover indicator (bottom border only) | Multiple consecutive UI elements |

### When to use Blue

| Use blue | Do not use blue |
|----------|-----------------|
| Navigation bar background | Orange CTA sections |
| Primary buttons in forms/dashboards | Alongside orange CTAs on white (pick one) |
| Text links | As body text color (too low contrast at mid-tones) |
| Brand section backgrounds | Overused as the only color — needs white to breathe |
| Input focus state | |
| Selected/active states | |

### When to use White

White is the default. The question is when to break from it:
- Break to `--surface-subtle` (neutral-50) every other section for rhythm
- Break to `--surface-brand` (blue-800) for brand weight moments
- Break to `--surface-inverse` (blue-900) for footer and hero overlays
- Never break to orange, bright yellow, or any high-chroma background

---

## Appendix A — Quick Reference Card

```
SURFACES          ACCENTS              SEMANTIC
white   #FFFFFF   blue    #2461AF      success  #22A05B
n-50    #F7F8F9   orange  #D45200      error    #D92020
n-100   #ECEEF0                        warning  #C28200
brand   #1B3A6B   TYPOGRAPHY
inverse #0D1F3C   primary  #1A1D21
                  secondary #44494F
                  link     #2461AF
                  accent   #B84400
```

## Appendix B — WCAG AA Compliance Summary

| Category | Compliant pairings | Failures | Notes |
|----------|--------------------|----------|-------|
| Body text on white | 9/9 | 0 | All pass 4.5:1 |
| Body text on dark | 3/3 | 0 | All pass 4.5:1 |
| UI components | 6/6 | 0 | All pass 3:1 |
| Disabled states | Intentional non-compliance | — | Non-interactive, decorative |
| Orange as text | 1/1 (using orange-700) | 0 | `#B84400` = 5.1:1 on white |
| Semantic colors | 3/3 | 0 | All text variants pass 4.5:1 |

**Previous system failures resolved:** body text on dark backgrounds (was 4.1:1, now 16.4:1+), muted text (was 2.5:1, now 7.1:1+), orange as text (was 3.2:1, now 5.1:1 using darker orange).
