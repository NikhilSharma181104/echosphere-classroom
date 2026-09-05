---
version: alpha
name: Multilingo
description: A modern, editorial SaaS-marketing template built in Framer, pairing a deep forest-green dark palette with a punchy lime-green accent for calls to action; large Manrope display type carries the hero and section headers while Inter Display and system sans handle body copy and micro-labels, all wrapped in soft, generously rounded surfaces and pill-shaped buttons.
colors:
  primary: "#D0FFA2"
  ink: "#000000"
  ink-secondary: "#707070"
  ink-muted: "#B2B2B2"
  on-primary: "#031A10"
  link: "#0000EE"
  surface: "#FFFFFF"
  surface-muted: "#F5F5F5"
  surface-dark: "#031A10"
  surface-dark-alt: "#052329"
  surface-dark-elevated: "#102C32"
  border-dark: "#264348"
typography:
  hero-display:
    fontFamily: Manrope
    fontSize: 80px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: -1.52px
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -1.488px
  title-lg:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.504px
  title-md:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: -0.506px
  title-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.324px
  body-strong:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: -0.16px
  body:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  body-inter:
    fontFamily: Inter Display
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: normal
  label:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: normal
  caption:
    fontFamily: Inter Display
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.7px
  button-label:
    fontFamily: Inter Display
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.7px
  nav-link:
    fontFamily: sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  pill: 30px
  xl: 32px
  xl-2: 40px
  xl-3: 48px
  xxl: 96px
  full: 9999px
spacing:
  xs-4: 4px
  sm-8: 8px
  sm-10: 10px
  md-12: 12px
  md-16: 16px
  lg-20: 20px
  lg-24: 24px
  xl-32: 32px
  xl-40: 40px
  section-72: 72px
  section-80: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
    typography: "{typography.body-strong}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.border-dark}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    typography: "{typography.button-label}"
  card:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-elevated:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: 32px
  input:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    borderColor: "{colors.ink-muted}"
    padding: 10px 16px
    typography: "{typography.body-sm}"
  badge:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: 4px 12px
    typography: "{typography.label}"
  link:
    textColor: "{colors.link}"
    typography: "{typography.body}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
---

# Multilingo

## Overview

Multilingo is an edtech marketing template for a language-learning product, and its design system reads as confident, editorial, and slightly playful rather than corporate. The core move is a deep forest-green dark canvas (`{colors.surface-dark}` #031A10) punched through with a single, unmissable lime-green accent (`{colors.primary}` #D0FFA2) — a two-color strategy that lets every CTA and highlight pop against an otherwise low-saturation, high-contrast dark field. Density is generous: large section spacing tokens (`{spacing.section-72}`, `{spacing.section-80}`) and big display type (`{typography.hero-display}` at 80px) give the hero room to breathe, while body copy stays compact and efficient at 16px/14px.

Hierarchy is built almost entirely through type scale and color weight, not through shadow or ornament. Manrope carries every heading at heavy weights (700–800) with tightening negative letter-spacing as size increases, so the eye reads scale hierarchy instinctively; Inter Display and a system sans-serif handle the smaller, functional text (buttons, captions, nav) at looser or neutral spacing. Surfaces do the rest of the hierarchy work — a jump from `{colors.surface-dark}` to `{colors.surface-dark-elevated}` (#102C32) signals a card is 'above' its container, and a jump to `{colors.surface}` (#FFFFFF) or `{colors.surface-muted}` (#F5F5F5) signals a light, utilitarian zone (forms, secondary buttons) breaking into the dark canvas.

Shape language reinforces the brand's soft, human tone: buttons and badges use full pill rounding (`{rounded.pill}` 30px), cards use large corner radii (`{rounded.lg}`–`{rounded.xl}`), and there is no sharp-cornered UI anywhere in the token set. This is a system built for a single dark-forward brand surface with light utility insets — not a multi-theme system.

**Key Characteristics:**
- Two-color brand strategy: forest-green dark base (`{colors.surface-dark}`) + lime accent (`{colors.primary}`), used sparingly and only for emphasis/CTAs.
- Type-driven hierarchy: Manrope at 800 weight for display/headlines, dropping to 600/700/500 for titles, 400 for body — weight is the primary hierarchy signal, not color.
- Negative letter-spacing scales with size (-1.52px at 80px down to -0.16px at 16px), tightening as type gets bigger — a deliberate 'display' compression technique.
- Pill-and-round geometry throughout: no sharp corners exist in the token set; buttons, badges, and large containers all favor soft, continuous curves.
- Elevation comes from surface color change (dark → elevated dark, or dark → light utility), not from drop shadows — the shadow inventory for this site is empty.
- On-brand text on the accent color always inverts to `{colors.on-primary}` (#031A10), never black or white, keeping the lime CTA cohesive with the dark palette.
- Two-viewport layout evidence shows a left-text/right-image hero on desktop collapsing to a stacked, centered layout on mobile.

## Colors

The palette is a single dark-forward brand identity (no light/dark theme toggle observed) built around one accent color, one deep base, and a tight set of functional neutrals. There are no gradients used anywhere in the token set or evidence — every fill is a flat, single hex value.

### Brand & Accent
- **Verdant Lime** (`{colors.primary}` — #D0FFA2): the sole accent color; reserved for primary CTAs, badges, and interactive highlights against dark surfaces. Its high measured usage as an interactive/surface color (weight ~20, all in surface/interactive roles) confirms it's a UI-action color, not a body-text color.
- **On-Primary Ink** (`{colors.on-primary}` — #031A10): text color used only on top of the lime accent — deliberately matches the dark base tone rather than pure black, keeping accent buttons visually tied to the brand's dark green rather than feeling like a foreign bright color.

### Surfaces
- **Forest Base** (`{colors.surface-dark}` — #031A10): the primary dark canvas for hero and card backgrounds; the system's default 'brand' surface.
- **Deep Teal Alt** (`{colors.surface-dark-alt}` — #052329): a secondary dark surface for section variation beneath the primary base.
- **Elevated Teal** (`{colors.surface-dark-elevated}` — #102C32): the lightest of the dark surfaces, used for `card-elevated` to visually lift a panel above its parent without a shadow.
- **Paper White** (`{colors.surface}` — #FFFFFF): the light utility surface — used for `button-secondary` fills and any inverted/light content blocks; second-highest measured color weight, confirming heavy use in interactive contexts.
- **Fog** (`{colors.surface-muted}` — #F5F5F5): the input and quiet-panel background, distinguishing form fields from pure white surfaces.

### Text
- **Ink** (`{colors.ink}` — #000000): the dominant text color by measured weight (337, the single heaviest color on the page) — used for body copy on light surfaces.
- **Ink Secondary** (`{colors.ink-secondary}` — #707070): supporting/de-emphasized text on light surfaces.
- **Ink Muted** (`{colors.ink-muted}` — #B2B2B2): the lightest text tone, reserved for the least prominent labels or disabled-feeling copy, and doubles as the `input` border color.

### Hairlines & Borders
- **Border Dark** (`{colors.border-dark}` — #264348): the only dedicated border color, used on `button-secondary` outlines against dark or light surfaces — a subtle, low-contrast hairline rather than a heavy stroke.

### Links
- **Classic Link Blue** (`{colors.link}` — #0000EE): an unusually saturated, almost 'default browser blue' — used exclusively for inline text links (second-heaviest measured color, weight 159), a deliberate throwback that keeps hyperlinks unmistakably distinct from the brand's green/lime system.

There is no separate dark-mode override block in these tokens — the entire system is authored as one dark-branded palette with light utility insets, not a togglable light/dark theme.

## Typography

### Font Family
- **Manrope** — the display and heading workhorse; carries `{typography.hero-display}`, `{typography.display-lg}`, `{typography.title-lg}`, `{typography.title-md}`, `{typography.title-sm}`, and also doubles into body roles (`{typography.body}`, `{typography.body-strong}`, `{typography.body-sm}`, `{typography.label}`) — making it the dominant typeface across nearly the whole hierarchy.
- **Inter Display** — used for `{typography.body-inter}`, `{typography.caption}`, and `{typography.button-label}`; a secondary face reserved for UI chrome and alternate body copy where tighter, slightly denser rendering is wanted (note its negative letter-spacing on caption/button roles vs. Manrope's neutral tracking at the same sizes).
- **System sans-serif** — used only for `{typography.nav-link}` at 12px/400; the smallest, most utilitarian role in the ladder, deliberately left as a system stack rather than a branded face.

### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `hero-display` | 80px | 800 | 1.1 | -1.52px | Hero headline |
| `display-lg` | 48px | 800 | 1.2 | -1.488px | Section headlines |
| `title-lg` | 28px | 700 | 1.2 | -0.504px | Sub-section titles |
| `title-md` | 22px | 600 | 1.5 | -0.506px | Card/module titles |
| `title-sm` | 18px | 500 | 1.4 | -0.324px | Small titles, feature labels |
| `body-strong` | 16px | 700 | 1.5 | -0.16px | Emphasized body copy |
| `body` | 16px | 400 | 1.5 | normal | Default paragraph text (Manrope) |
| `body-inter` | 16px | 400 | 1.5 | normal | Default paragraph text (Inter Display variant) |
| `body-sm` | 14px | 400 | 1.2 | normal | Secondary/compact body text |
| `label` | 14px | 500 | 1.1 | normal | Form labels, small UI labels |
| `caption` | 14px | 500 | 1.1 | -0.7px | Captions, micro-copy |
| `button-label` | 14px | 500 | 1 | -0.7px | Button text |
| `nav-link` | 12px | 400 | 1.5 | normal | Navigation links |

### Principles
- **Weight strategy:** heavy weights (600–800) are reserved for anything that must read as a headline or title; only 400/500/700 appear in body/label roles. Weight 500 is used deliberately at small sizes (`title-sm`, `label`, `caption`, `button-label`) as the 'confident but not shouting' tier — no font in the ladder ever uses 300 or 900.
- **Letter-spacing strategy:** tracking tightens as size grows — from `normal` at 16px body down to -1.52px at 80px display — a classic large-type compression technique that keeps big headlines from feeling loose. Inter Display roles (`caption`, `button-label`) buck this trend with a flat -0.7px regardless of their small 14px size, giving UI chrome its own denser rhythm distinct from editorial copy.
- **Line-height strategy:** display and title tokens sit at loose 1.1–1.5 line-heights matching their generous vertical rhythm, while the smallest UI tokens (`label`, `caption`, `button-label`, `nav-link`) compress to 1.0–1.1 for tight, chip-like text blocks.

### Note on Font Substitutes
Manrope and Inter are both freely available open-source families (Google Fonts / Inter project) — 'Inter Display' can be substituted directly with Inter's Display optical size cut, or with Inter itself if the Display cut is unavailable, without materially changing the system's character. No substitution is needed for Manrope.

## Layout

### Spacing System
The scale is a hybrid 4px/8px rhythm rather than a strict single base unit: `{spacing.xs-4}` (4px), `{spacing.sm-8}` (8px), `{spacing.sm-10}` (10px), `{spacing.md-12}` (12px), `{spacing.md-16}` (16px), `{spacing.lg-20}` (20px), `{spacing.lg-24}` (24px), `{spacing.xl-32}` (32px), `{spacing.xl-40}` (40px), up to the section-level jumps `{spacing.section-72}` (72px) and `{spacing.section-80}` (80px). The 10px and 12px steps (both heavily measured in evidence) suggest padding is often tuned in ~2px increments around a 4px grid rather than locked to strict powers of 8 — treat `sm-10`/`md-12` as legitimate, frequently-used steps, not rounding noise.

### Grid & Container
On desktop the hero uses a two-column layout: a left-aligned text stack (headline, supporting copy, CTA) paired with a large right-side photographic image; below the fold, a two-card feature grid (e.g. 'Most Popular' / 'Business') sits with thin divider lines and small icon tiles, implying a simple 2-column card grid for feature/pricing comparisons. On mobile, the hero collapses to a single centered column with the image stacking beneath or behind the text. No explicit column-count or max-width tokens were captured in evidence, so exact container widths should be inferred from screenshots rather than assumed.

### Whitespace Philosophy
Whitespace is generous and section-level (`section-72`/`section-80`) rather than component-level — big gaps separate the hero from feature grids, while internal component padding stays compact (12px–24px, matching `button-primary`/`button-secondary`/`card` padding). This creates a rhythm of tight, efficient components inside loosely-spaced page sections — the density lives in the components, the air lives between them.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, same surface color | Default body text, inline links, nav links |
| Surface shift (base) | `{colors.surface-dark}` → `{colors.surface-dark-alt}` | Section-to-section background variation |
| Surface shift (elevated) | `{colors.surface-dark}`/`alt` → `{colors.surface-dark-elevated}` with larger radius (`{rounded.xl}`) and padding (32px) | `card-elevated` — panels meant to read as 'lifted' content |
| Light inset | Dark canvas → `{colors.surface}` / `{colors.surface-muted}` | `button-secondary`, `input` — utility surfaces breaking into the dark brand field |

**Shadow philosophy.** No shadow values were found anywhere in the captured evidence — this is not a gap, it's the strategy. Depth is communicated purely through surface-color steps (dark → darker-elevated, or dark → light) and through radius/padding changes, never through drop shadows or blur. The 'floating' feel of hero badges noted in the visual scan comes from color contrast and pill shape against the photographic background, not from a shadow token — builders should not add box-shadows to replicate this effect.

## Shapes

### Border Radius Scale
| Token | Value | Use |
|---|---|---|
| `sm` | 4px | Inputs (`{components.input}`), tightest corners |
| `md` | 8px | `button-secondary` |
| `lg` | 12px | `card` |
| `pill` | 30px | `button-primary`, `badge` — full pill CTAs and tags |
| `xl` | 32px | `card-elevated` |
| `xl-2` | 40px | Large decorative containers |
| `xl-3` | 48px | Large decorative containers |
| `xxl` | 96px | Oversized hero-image or block corners |
| `full` | 9999px | Circular elements (avatars, icon badges) |

Geometry across the system is uniformly soft — there is no sharp-cornered surface anywhere in the token set, even at the input level (4px is the tightest radius that exists). Buttons and badges commit fully to pill shape (`{rounded.pill}`), while avatars and icon badges use true circles (`{rounded.full}`), consistent with the visual scan's note of circular avatar clusters. Cards graduate from a moderate 12px (`card`) to a rounder 32px (`card-elevated`) as they gain visual weight, reinforcing the surface-based elevation strategy — bigger radius accompanies 'higher' surfaces.

## Components

### Navigation
- **`nav-link`** — text-only navigation items styled with the system sans-serif at 12px/400 (`{typography.nav-link}`), colored `{colors.ink}`. This is the smallest, least-decorated type role in the whole system, keeping the nav quiet relative to the bold display headlines. Exact bar height, sticky/blur behavior, and link count could not be measured from the captured evidence (no landmark data was returned) — treat this as a structural gap to confirm against the live screenshots rather than an assumed spec.

### Buttons
- **`button-primary`** — the hero CTA: `{colors.primary}` (#D0FFA2) fill, `{colors.on-primary}` (#031A10) text, full pill radius (`{rounded.pill}`), 12px/24px padding, set in `{typography.body-strong}` (16px/700). This is the only place the lime accent appears as a large fill, making it the unambiguous primary action everywhere it's used.
- **`button-secondary`** — a quieter alternative: `{colors.surface}` white fill, `{colors.ink}` text, `{colors.border-dark}` outline, moderate `{rounded.md}` (8px) radius, same 12px/24px padding but set in `{typography.button-label}` (Inter Display, 14px/500, -0.7px tracking). Pairing a squarer radius with a lighter, bordered surface visually demotes it beneath the pill-shaped primary button.

### Cards & Containers
- **`card`** — dark surface (`{colors.surface-dark}`) with white text, `{rounded.lg}` (12px) corners, 24px padding; the default content container against the brand backdrop.
- **`card-elevated`** — lighter dark surface (`{colors.surface-dark-elevated}`), `{rounded.xl}` (32px) corners, 32px padding; used where a panel needs to read as raised without a shadow, per the elevation strategy above.

### Inputs & Forms
- **`input`** — `{colors.surface-muted}` (#F5F5F5) background, `{colors.ink}` text, `{colors.ink-muted}` border, tight `{rounded.sm}` (4px) radius, 10px/16px padding, set in `{typography.body-sm}` (14px/400). A specific 1px border width was measured but dropped during grounding as unconfirmed — treat the border as thin/hairline-weight rather than assuming an exact pixel value.

### Badges & Chips
- **`badge`** — reuses the primary accent (`{colors.primary}` fill, `{colors.on-primary}` text), full pill radius, compact 4px/12px padding, set in `{typography.label}` (14px/500). Functions as the small-tag equivalent of the primary button — same color logic, smaller footprint — matching the visual scan's 'Buy Now' / 'Made in Framer' floating pill badges.

### Links
- **`link`** — inline text links use `{colors.link}` (#0000EE) at `{typography.body}` sizing, a deliberately saturated 'classic blue' that stands apart from the green/lime brand system for maximum inline recognizability.

### Footer
No footer-specific tokens or landmark measurements were captured in this extraction — column layout, legal-text treatment, and link grouping could not be verified and should be confirmed directly against the live site before rebuilding this region.

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` (#D0FFA2) for CTAs and small accent badges only — its measured usage is entirely in interactive/surface roles, never body text.
- Pair accent fills with `{colors.on-primary}` (#031A10) text, not black or white, to keep CTAs visually tied to the brand's dark-green base.
- Build depth with surface-color steps — `{colors.surface-dark}` → `{colors.surface-dark-elevated}` — rather than shadows; this site's shadow inventory is empty.
- Use full pill radius (`{rounded.pill}`) for every primary button and badge; reserve smaller radii (`{rounded.sm}`–`{rounded.lg}`) for inputs and secondary containers.
- Scale letter-spacing tighter as type size increases (down to -1.52px at `{typography.hero-display}`), matching the ladder's compression pattern.
- Use `{colors.link}` (#0000EE) exclusively for inline text links, keeping them distinct from brand green/lime interactive elements.

### Don't
- Don't add drop shadows — the site conveys hierarchy without them; use surface/radius changes instead.
- Don't apply `{colors.primary}` as a large background behind long-form text — it's calibrated for short CTA/badge labels, not paragraph content.
- Don't give `button-secondary` a pill radius — its `{rounded.md}` (8px) corner is what visually subordinates it to `button-primary`'s pill shape.
- Don't substitute the nav-link system sans-serif with Manrope or Inter Display — the plain 12px system font is a deliberate, quiet register beneath the branded headline type.
- Don't invent a light/dark theme toggle — this system is authored as one cohesive dark-branded palette with light utility insets, not two parallel themes.

## Responsive Behavior

This analysis is based on two captured viewports (desktop and mobile) of a single page, so breakpoint-specific pixel values cannot be confirmed and are intentionally omitted. What the two viewports do show: the hero's left-aligned text/right-image split on desktop collapses to a single, centered stacked column on mobile, with the image moving beneath or behind the headline rather than sitting beside it. The two-card feature grid observed below the hero on desktop is consistent with a system that stacks cards vertically at narrow widths, though exact stacking breakpoints weren't measurable from the evidence.

Touch-target sizing is generous by construction: `button-primary` and `button-secondary` both use 12px/24px padding at pill/8px radius, and `badge` uses 4px/12px — comfortably above common touch-target minimums when combined with their type size. Because only two viewports were captured, treat intermediate/tablet behavior as unverified.

## Iteration Guide

1. Treat `{colors.primary}` as a scarce resource — it should appear on at most one primary CTA or a small cluster of badges per view; if a screen needs a second strong accent, reuse `{colors.link}` for text-level emphasis instead of duplicating the lime fill.
2. When adding a new elevated surface, follow the existing dark-surface ladder (`{colors.surface-dark}` → `{colors.surface-dark-alt}` → `{colors.surface-dark-elevated}`) rather than introducing a shadow — shadows do not exist anywhere in this system.
3. New buttons/badges should default to `{rounded.pill}`; only form-adjacent or secondary UI (inputs, secondary buttons) should use the smaller `{rounded.sm}`–`{rounded.lg}` steps.
4. For new headline sizes, interpolate letter-spacing along the existing curve (roughly -0.16px at 16px scaling to -1.52px at 80px) rather than leaving new sizes at `normal` tracking.
5. Keep Manrope as the default family for anything above 18px; reserve Inter Display for compact UI text (captions, button labels) where its distinct -0.7px tracking is appropriate, and never use the bare `sans-serif` fallback above `{typography.nav-link}`'s 12px role.
6. Any new bordered element should use `{colors.border-dark}` (#264348) at hairline weight — this system has no heavier border color to fall back on.
7. Before rebuilding navigation or footer regions, verify structure against the live site directly — these components lack confirmed landmark measurements in this extraction and should not be assumed from the token set alone.

## Known Gaps

- No shadow values were present in the evidence at all — this is treated as the elevation strategy, but it means any subtle shadow the live site might use on hover/focus states could not be captured.
- Border widths for `{components.button-secondary}` and `{components.input}` (both apparently ~1px) were dropped during grounding because they weren't directly observed/confirmed in evidence — treat them as thin/hairline by default, not a confirmed pixel value.
- `landmarks` data (nav bar height, sticky/fixed behavior, backdrop blur, footer column structure) was empty in the evidence — header and footer structural details in this document are inferred from screenshots only and should be re-verified against the live site.
- Only one page was captured (the homepage), so component variants that may exist on other pages (pricing, blog, auth flows) are not represented in these tokens.
- Hover, focus, active, and disabled states were not observable in static screenshots — all interactive states beyond the default styling shown here are unverified.
- No animation or motion behavior could be captured from static evidence, despite Framer's typical use of scroll/entrance animations.
