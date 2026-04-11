# Hero Redesign — Liquid Blob Voice Orb
**Date:** 2026-04-12
**Status:** Approved

---

## Context

The current Direction E hero (post Tasks 1–10) changed colors and font but kept the same two-column layout as the old site. The sphere is decorative-only and the voice assistant lives separately at the bottom of the page. The user wants the hero to feel genuinely different: the AI orb IS the voice assistant, the photo is back, and there's no excessive lateral whitespace.

---

## Approved Design

### Layout (Option B — Centered, Orb Protagonist)

Full-width centered column. No two-column split. No `max-width: 680px` constraint on hero content.

```
┌─────────────────────────────────────────────────────┐
│  NAV: aubergine backdrop, teal links               │
├─────────────────────────────────────────────────────┤
│                                                     │
│         [LIQUID BLOB ORB — 200px, cliccabile]       │
│         ● Click to talk to Pedro                    │
│                                                     │
│    [avatar 48px]  AI DELIVERY MANAGER · REMOTE EU   │
│                                                     │
│              Pedro                                  │
│              Pizarro.  ← chromatic aberration       │
│                                                     │
│       I ship software. Teams actually deliver.      │
│                                                     │
│   14 years managing delivery across banking…        │
│                                                     │
│        [Get in touch ↗]    [LinkedIn →]             │
│                                                     │
├─────────────────────────────────────────────────────┤
│  STATS STRIP: 14 · +85% · −50% · 40+ · +40%        │
└─────────────────────────────────────────────────────┘
```

### Animation (Option C — Liquid Blob Morphing)

Not a rigid rotating sphere. A liquid form that breathes:

- **CSS `border-radius` morph** — keyframe animation cycling through 6 different ellipsoidal border-radius values
- **SVG `feTurbulence` displacement** — organic surface distortion layered on top
- **Dual glow pulse** — alternates between teal (`rgba(0,229,204,...)`) and pink (`rgba(255,97,210,...)`) box-shadow
- **Specular highlight** — fixed white radial-gradient pseudo-element at 33% 28% simulating light source
- **Two ambient rings** — teal (inset -20px) and pink (inset -36px) pulsing with `ringPulse` keyframe
- **Gradient fill** — `linear-gradient(135deg, #00E5CC → #7B2FFF → #FF61D2)`

Animation duration: morph 5s alternate, glow 3s normal — never perfectly repeating.

### Orb as Voice Assistant Trigger

The orb **replaces** the mic button as the primary voice trigger.

**States:**
| State | CSS classes | Visual |
|-------|------------|--------|
| Idle | `.orb-idle` | slow morph, teal↔pink glow pulse |
| Loading | `.orb-loading` | slower morph, muted glow, spinner ring |
| Recording | `.orb-recording` | faster morph (2s), intense pink glow, ring pulses fast |
| Speaking | `.orb-speaking` | medium morph (3.5s), intense teal glow |

**Wiring:**
- Orb `<button>` click → calls existing `connect()` / `cleanup()` JS functions
- `setState(s)` function in existing voice JS → also adds `.orb-{state}` class to orb element
- The existing `voice-btn` in the "Ask Pedro" section stays as secondary control (not hidden)
- Transcript / wave bars / response card remain in Ask Pedro section — the orb provides visual state feedback (glow changes), no auto-scroll on connect

### Photo Treatment

The photo (`assets/pedro-pizarro.jpg`) appears as a **48px circular avatar** next to the eyebrow text.

**CSS adaptation to dark aubergine background:**
```css
.hero-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top center;
  border: 2px solid rgba(0, 229, 204, 0.35);
  box-shadow:
    0 0 0 4px rgba(0, 229, 204, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.5);
  /* Blend with dark bg: slight contrast boost */
  filter: brightness(1.05) contrast(1.05) saturate(1.1);
}
```

The teal border + outer glow ring creates visual continuity between the photo and the orb above it. The `filter` subtly boosts the photo against the dark background without altering its subject.

### Padding / Spacing Fix

- Remove `max-width: 680px` from `.hero-content`
- Hero padding: `clamp(48px, 7vh, 80px) 0 clamp(40px, 6vh, 64px)` — vertical only, no horizontal (container handles that)
- Container horizontal padding: `clamp(16px, 4vw, 48px)` — unchanged
- `.hero-description` max-width stays `560px` but `margin: 0 auto` centers it

### Responsive Behaviour

| Breakpoint | Orb | Avatar | Name | CTA |
|-----------|-----|--------|------|-----|
| Desktop (>768) | 200px | 48px | clamp(56px, 9vw, 96px) | row, centered |
| Tablet (≤768) | 150px | 44px | clamp(44px, 10vw, 64px) | row, centered |
| Mobile (≤480) | 120px | 36px | 40px | column, centered |

### SEO / Accessibility Preservation

- `<h1 class="hero-name">` text unchanged
- All JSON-LD schema: untouched
- Meta tags: untouched
- GA4: untouched
- Deepgram + Anthropic voice pipeline: untouched
- Photo stays in DOM with `alt="Pedro Pizarro, AI Delivery Manager"` — just moves from hidden div to visible avatar `<img>`

---

## What Does NOT Change

- All text content (verbatim from index-old.html)
- SEO meta tags and JSON-LD @graph
- GA4 tracking tag
- Voice assistant JS (connect/cleanup/setState functions)
- "Ask Pedro" section layout and transcript UI
- All sections below hero (About, Work, Experience, Skills, Certs, Writing, Contact, Footer)

---

## Implementation Scope

**Files touched:** `index.html` only (single-file site, no build tools)

**Changes:**
1. `.hero-sphere-wrap` / `.hero-sphere` CSS → replace with `.orb-blob-wrap` / `.orb-blob` liquid blob CSS
2. `.hero-layout` → remove, hero is now just a centered flex column inside `<section class="hero">`
3. `.hero-content` max-width → remove
4. Hero HTML → add orb blob divs, "Click to talk" label, avatar `<img>`
5. JS → wire orb click to `connect()`/`cleanup()`, sync orb state classes from `setState()`
6. `.hero-photo-scroll` → remains `display:none` (SEO alt text preserved)

**Not in scope:** WebGL, canvas, new dependencies, changes to any other section.
