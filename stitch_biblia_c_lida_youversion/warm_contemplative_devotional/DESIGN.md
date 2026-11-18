---
name: Warm Contemplative Devotional
colors:
  surface: '#fff8f5'
  surface-dim: '#e2d8d3'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2ec'
  surface-container: '#f6ece7'
  surface-container-high: '#f0e6e1'
  surface-container-highest: '#ebe0dc'
  on-surface: '#1f1b18'
  on-surface-variant: '#55433c'
  inverse-surface: '#352f2c'
  inverse-on-surface: '#f9efea'
  outline: '#88726b'
  outline-variant: '#dbc1b8'
  surface-tint: '#9a4522'
  primary: '#974320'
  on-primary: '#ffffff'
  primary-container: '#b65b35'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59a'
  secondary: '#795918'
  on-secondary: '#ffffff'
  secondary-container: '#fdd184'
  on-secondary-container: '#785817'
  tertiary: '#984221'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75a37'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb59a'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#7b2f0c'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#ebc075'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#7c2e0e'
  background: '#fff8f5'
  on-background: '#1f1b18'
  surface-variant: '#ebe0dc'
typography:
  headline-xl:
    fontFamily: Merriweather
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Merriweather
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Merriweather
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Merriweather
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Merriweather
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 26px
  scripture-body:
    fontFamily: Merriweather
    fontSize: 19px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0.01em
  scripture-verse-num:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system establishes a quiet, intentional sanctuary for daily reading, study, and prayer. Designed around deep reverence and sustained focus, the aesthetic balances the timeless presence of illuminated manuscripts with the effortless utility of a modern editorial reading application. 

The emotional signature is grounded, peaceful, and warm—trading sterile utility for tactile parchment tones, organic geometry, and unhurried typographic rhythm. The design movement blends **Warm Editorial Minimalism** with soft physical presence: comfortable tactile cards, unhurried white space, and purposeful brass-and-terracotta accents that prioritize distraction-free immersion.

## Colors

The palette is rooted in sun-cured linen, kiln-baked earthenware, and aged ink, creating an organic reading canvas that minimizes eye fatigue during extended study.

- **Primary (`#C2643E` / Terracotta):** Represents devotional focus and spiritual grounding. Used for primary actions, current verse callouts, active chapter selections, and streak counters.
- **Secondary (`#8C6A28` / Antique Brass):** Carries quiet reverence. Reserved for bookmarking, saved verse ribbons, highlighted passages, and prayer tags.
- **Tertiary (`#D9744F` / Soft Rust):** A vibrant warmth used sparingly for micro-rewards, completion states, and active audio player controls.
- **Neutrals & Surfaces:**
  - Base Background: Canvas Ivory (`#FAF7F2`)
  - Elevated Container / Card Surface: Soft Linen (`#F4EFE6`)
  - Floating Sheet / Dialog Surface: Pure Alabaster (`#FFFFFF`)
  - Primary Text: Deep Umber Charcoal (`#2D2825`) for maximum contrast and legibility without harsh absolute black.
  - Secondary Text / Verse Numbers: Soft Umber (`#5A524D`).
  - Subtle Dividing Line: Warm Faint Sand (`#E8DFD3`).

## Typography

Typography governs the heart of the experience. The system creates clear delineation between the sacred word and application functional UI:

- **Sacred & Scripture Typography:** Rendered strictly in **Merriweather**. The generous x-height, sturdy serifs, and soft terminals ensure fluid readability over long reading sessions. `scripture-body` uses an expansive 32px line height for spacious line tracking, allowing individual verses room to breathe.
- **Interface & Operational Typography:** Rendered in **Inter**. Clean, non-distracting, and highly structured, it brings crystalline clarity to chapter indexes, audio scrubbers, devotional tags, study notes, and navigation elements.
- **Verse Indicators (`scripture-verse-num`):** Set in superscripted Inter Sans (`#8C6A28`) nestled slightly ahead of the verse text, avoiding visual clutter while aiding precise scripture reference lookup.

## Layout & Spacing

The layout embraces mobile-first ergonomics with generous sanctuary breathing room.

- **Grid & Margins:** Built on a single-column fluid mobile layout with `1.25rem` (`20px`) outer safe margins. Reading canvases can collapse horizontal margins to `1.5rem` to maximize line length comfortable for 55–65 characters per line.
- **Vertical Cadence:** A persistent `8px` baseline grid guides paragraph margins and card stacks. Sacred paragraphs employ a `space-lg` (`1.5rem`) gap, preventing visual crowding between verses and reflections.
- **Tablet / Large Form Reflow:** On viewports wider than 768px, the interface transitions to an off-center 2-column format: a fixed 380px contextual drawer for study notes, cross-references, and translations on the right, keeping the main reading pane centered at a constrained maximum width of 680px.

## Elevation & Depth

Visual hierarchy rejects sharp artificial drop shadows in favor of warm, ambient depth simulating heavy paper and linen layers.

- **Base Canvas (Level 0):** Pure linen tint (`#FAF7F2`) with zero elevation.
- **Cards & Feed Containers (Level 1):** Elevated slightly using a warm terracotta-tinted ambient veil: `box-shadow: 0 4px 20px -2px rgba(45, 40, 37, 0.04), 0 2px 6px -1px rgba(194, 100, 62, 0.03)`. Outlines use an ultra-soft border: `1px solid rgba(232, 223, 211, 0.65)`.
- **Bottom Navigation Bar & Modals (Level 2):** Frosted ambient linen surface (`rgba(250, 247, 242, 0.92)` with `backdrop-filter: blur(12px)`) elevated with a soft vertical diffusion: `box-shadow: 0 -4px 24px rgba(45, 40, 37, 0.06)`.
- **Scripture Verse Highlighting:** Employs soft non-destructive washes behind text (`rgba(212, 175, 55, 0.18)` for gold praise; `rgba(194, 100, 62, 0.14)` for terracotta meditation) without hard bounding boxes.

## Shapes

Shapes communicate organic harmony, drawing inspiration from smooth river stones and tactile book covers.

- **Primary Geometry:** Base containers, cards, and daily verse modules utilize `0.5rem` to `1rem` corner radii (`rounded-lg`).
- **Devotional Feature Banners:** Feature large continuous `1.5rem` (`rounded-xl`) rounding for friendly, warm focus.
- **Interactive Badges & Scripture Chips:** Standardized with full pill styling (`9999px`) to visually isolate selectable references from rectangular text modules.

## Components

### Buttons
- **Primary Action (e.g., "Start Devotional", "Listen"):** Solid Terracotta (`#C2643E`) with Pure White (`#FFFFFF`) text, styled in `rounded-lg` with `0.875rem` vertical padding. Interactive states transition to `#D9744F`.
- **Secondary (e.g., "Change Translation", "Compare"):** Pale Parchment surface (`#F4EFE6`) with Umber Charcoal text (`#2D2825`) and a warm sand border (`#E8DFD3`).
- **Floating Audio / Reader Bar:** Pill-shaped floating dock positioned `1rem` above the bottom edge, featuring play/pause and narration velocity buttons.

### Scripture Verse of the Day Card
- Enclosed in an elevated ivory container with `rounded-xl` corners and `space-lg` internal padding. Features a faint gold vertical accent rule on the left edge (`3px solid #D4AF37`), displaying the scripture passage in Merriweather italic alongside quick actions for bookmarking, sharing, and note-taking.

### Chips & Filter Pills
- Used for bible books, testament switchers, and topical tags (e.g., "Peace", "Comfort", "Psalms").
- Default: `#F4EFE6` background with `#5A524D` text.
- Active: Tinted `#C2643E` fill with pure white label, accompanied by smooth haptic feedback upon selection.

### Reading Interface & Selection Handles
- Tapping a verse displays an inline terracotta underline dot. A contextual bottom sheet emerges gracefully offering color highlights, cross-references, verse reflection, and prayer list additions.

### Scripture Lists & Chapter Selectors
- Chapter numbers appear in a balanced grid of rounded squares (`rounded-md`), highlighting the active chapter in `#C2643E` fill and completed read chapters with an understated `#8C6A28` dot indicator.

### Input Fields & Prayer Journals
- Minimalist open borders featuring an active terracotta bottom focus indicator (`2px solid #C2643E`). Fields inherit the warm linen tone (`#F4EFE6`) with generous line-height for peaceful journaling.