---
name: Julian Dower Portfolio
description: A dark geometric portfolio with sunset color and direct project evidence.
colors:
  page: "#191717"
  ink: "#f4eee7"
  muted: "#b8ada9"
  accent: "#f19abd"
  orange: "#ffb45b"
  coral: "#f78070"
  line: "#48403d"
  contact-stroke: "#683a33"
typography:
  display:
    fontFamily: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(4rem, 8.5vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.25rem)"
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(2rem, 3.8vw, 3.75rem)"
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Manrope, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 550
rounded:
  square: "0"
  circle: "50%"
spacing:
  gutter: "clamp(1.25rem, 5.5vw, 6rem)"
  small: "1rem"
  medium: "2rem"
  large: "3rem"
  section-bottom: "6.5rem"
components:
  text-button:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0.7rem 0"
    rounded: "{rounded.square}"
  text-button-hover:
    textColor: "{colors.accent}"
  project-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0.9rem 0"
  project-link-hover:
    textColor: "{colors.accent}"
  navigation:
    textColor: "{colors.muted}"
  navigation-active:
    textColor: "{colors.ink}"
  contact-route:
    textColor: "{colors.ink}"
    padding: "2rem 0"
  quiz-visual:
    backgroundColor: "{colors.page}"
    rounded: "{rounded.square}"
---

# Design System: Julian Dower Portfolio

## Overview

**Creative North Star: "The Sunset Bauhaus Poster"**

Warm charcoal, off-white type and sunset pink-orange geometry create a minimal, composed portfolio. A single geometric sans carries both the large name and concise project evidence. The system gives hiring teams clear reading paths and direct links while circles, open arches and curved connections provide its visual identity.

Flat rectangular planes support the content; expressive curves belong to illustrations and brand geometry. Color occupies deliberate fields rather than ambient glow. Motion is confined to a small shift of the hero arch and respects reduced-motion preferences.

**Key Characteristics:**
- Dark warm surfaces and restrained off-white typography.
- Sunset gradients, solid circles, open arches and curved paths.
- One self-hosted geometric sans with tight large-type spacing.
- Flat, square content surfaces and fine dividing lines.
- Concise factual copy and direct underlined actions.

## Colors

The palette pairs warm dark neutrals with pink, coral and orange, using the frontmatter values as the normative primitives.

### Primary
- **Sunset Pink** (`accent`): punctuation, arrows, focus outlines, selected illustrative answers and the brand mark.

### Secondary
- **Sunset Orange** (`orange`): the second brand shape and the warm end of gradient fields.
- **Sunset Coral** (`coral`): the middle of the sunset gradient.

### Neutral
- **Warm Charcoal** (`page`): page and illustrative-interface backgrounds, plus dark text on sunset fields.
- **Warm Off-white** (`ink`): main text, open arches and action underlines.
- **Warm Muted Gray** (`muted`): secondary copy, labels and inactive navigation.
- **Charcoal Divider** (`line`): section, project, navigation and illustrative-interface separators.
- **Warm Sunset Stroke** (`contact-stroke`): thin rings and separators over the contact gradient.

**The Color Field Rule.** Apply the sunset gradient to bounded geometric or content fields; retain solid charcoal behind primary reading surfaces.

The CSS gradient runs at 125 degrees with pink, coral and orange stops at 0%, 52% and 100%. The hero SVG has its own directional gradient with a slightly different pink stop; preserve that illustration rather than treating it as a second global accent.

## Typography

**Display Font:** Manrope, with the system sans stack recorded in the frontmatter.
**Body Font:** Manrope, using the same stack.

The variable Latin font is self-hosted in `src/fonts/manrope-latin.woff2`, loaded with swap and a supported weight range of 400–800. Geometric letterforms and compact heading tracking give the work a poster-like rhythm without a separate display face.

### Hierarchy
- **Display:** the hero name uses the display token; mobile switches to `clamp(4rem, 18vw, 6rem)`. Contact headings use related large scales with more open line heights (1.05–1.1).
- **Headline:** section headings use the headline token; the selected-work heading becomes 2rem at the mobile breakpoint.
- **Title:** project headings use the title token; tablet and mobile use 2.5rem.
- **Body:** project descriptions use the body token with a desktop measure of 34ch; mobile permits 44ch. Supporting paragraphs use 1rem and the same generous line height.
- **Label:** action links use the label token. Navigation uses 0.9rem, while project formats, captions and footer copy use smaller secondary roles.

**The Single Voice Rule.** Use Manrope throughout; express hierarchy through scale, weight, spacing and color rather than additional type families.

## Layout

Main hero, work, about and contact-page containers have a maximum width of 1600px and centered margins. A fluid shared page gutter aligns the header and content. The fixed header is 5.5rem tall; the desktop hero has a 780px minimum height and a two-column 1:1.08 composition. Projects use asymmetric 0.8:1.2 columns, with the second project reversing the order. About uses a 1.2:0.8 split and three interest columns.

Spacing is generous around large type and project evidence; fine rules separate rows. At 1000px the hero minimum height becomes 680px and previews and gaps tighten. At 700px, the header becomes 4.5rem, major grids stack, reversed project ordering returns to source order, interests become a single column, and footer links wrap. Hero artwork moves below the name, with a 420px maximum width. Contact rows place their labels on a separate line. At 360px the brand text is hidden while its symbol remains and section headings can wrap. Anchor scroll offsets account for the fixed header.

## Elevation & Depth

There are no box shadows or blur layers. Depth comes from solid contrasting fields, overlapping SVG shapes and changes between charcoal and sunset surfaces. The header remains opaque, and preview surfaces retain square edges.

**The Flat Surface Rule.** Keep content surfaces flat; use color, geometry and fine dividers to establish separation.

## Shapes

Content and action surfaces use square corners. Circles and open arches form the signature geometry, with a large solid sunset circle behind an off-white arch, a fine inner arch and a smaller pink circle. The brand mark is a pair of opposing rounded half-shapes. Contact decoration uses concentric outlined circles. Mind-map connections use curved paths and circular nodes. Fine rectangular borders belong to illustrative quiz options rather than general card framing.

## Components

### Text actions

Underlined links are the primary action style. Explore-work and project links use off-white text, pink inline SVG arrows and minimum 48px height, with distinct vertical padding recorded in the frontmatter. Hover changes text and the bottom border to pink. Global keyboard focus is a 2px pink outline offset by 6px. There are no filled button variants in the current portfolio.

### Navigation

The fixed opaque header pairs the two-shape mark with direct Work, About and Contact links. Navigation links have a minimum 44px height. Inactive links are muted; hover and the active route use off-white, with a pink 2px underline marking the active route. The mobile layout retains inline navigation.

### Project previews

These are illustrative interfaces, explicitly captioned as such, rather than live controls. The quiz has a sunset rectangular frame, charcoal interior, a fine divided top line, outlined answer rows, a filled pink selection and a pink confidence track. The mind map has a plum frame, charcoal interior, curved pink connections and circular nodes. These project-specific illustration colors are local details, not additional global surface tokens. Neither preview uses rounded cards or shadows.

### Contact routes

Contact-page rows are full-width links separated by fine rules. A muted label precedes a large off-white destination and pink arrow; hover turns the destination pink. On mobile the label occupies its own row. The home contact field uses the sunset gradient, dark text and a bordered email link with minimum 64px height; its focus outline switches to charcoal for contrast.

### Sunset composition

The decorative SVG uses a 600-square viewBox. Its thick off-white arch shifts horizontally by 10px when the hero is hovered or contains keyboard focus, using a 650ms `cubic-bezier(0.16, 1, 0.3, 1)` transition. Reduced motion removes the transition and animation; the shifted state may still apply, without movement interpolation. Smooth anchor scrolling also becomes immediate.

## Do's and Don'ts

### Do:
- **Do** align content and the fixed header to the shared fluid gutter.
- **Do** use solid geometric fields, circles, open arches and curved connections.
- **Do** preserve concise project descriptions and direct visible links.
- **Do** preserve visible keyboard focus and reduced-motion behavior.
- **Do** label project interface illustrations as illustrative.

### Don't:
- **Don't** add shadows, blur or rounded content cards to this flat system.
- **Don't** add decorative taglines or repeated promotional labels.
- **Don't** introduce another display typeface.
- **Don't** let artwork overlap reading text on mobile.
