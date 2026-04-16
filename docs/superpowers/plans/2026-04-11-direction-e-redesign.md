# Direction E (Sci-Fi/Aubergine) Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply Direction E visual redesign (aubergine + teal + pink, Space Grotesk, CSS 3D sphere, chromatic aberration) to index.html without touching SEO/GEO structure, voice assistant code, or any text content.

**Architecture:** Single HTML file redesign. CSS variables swap + hero section restructure + new background layers. All SEO meta, JSON-LD blocks, voice assistant JS/HTML, content sections (#about through #contact) are preserved byte-for-byte. Only visual CSS and hero markup change.

**Tech Stack:** Pure HTML/CSS/JS — no build tools, no npm. Google Fonts CDN. CSS custom properties for theming.

---

## CRITICAL: What Must NOT Change

These blocks are preserved **verbatim** in every task:

- `<head>` from `<title>` through end of second JSON-LD `</script>` — ALL meta, og:*, twitter:*, canonical, JSON-LD @graph (8 types), FAQPage schema, GA4 gtag script
- Voice assistant: HTML (`#voice` section, all IDs), JS (entire `<script>` block ~lines 2548–2869), voice CSS classes (`.voice-*`, `.wave-*`) — only color references updated via CSS variables
- All content sections: `#about`, `#voice`, `#work`, `#experience`, `#skills`, `#certifications`, `#writing`, `#contact` — text/HTML untouched
- Footer HTML with all links
- `aria-*` attributes everywhere
- `#back-to-top`, `#scroll-progress`, `#toast` elements
- Local asset `assets/pedro-pizarro.jpg` (photo stays, just moved/hidden in hero)
- Local video `assets/animazione-coste.mp4` (keep but opacity reduced)
- GA4 tracking ID `G-Z8W56KE5NY`

---

## Direction E Palette Reference

```css
/* Replace current :root variables */
--bg: #1A0A2E;                        /* aubergine/deep violet — was #0a0a0a */
--surface: #26143E;                   /* slightly lighter aubergine — was #111111 */
--surface2: #301850;                  /* mid aubergine — was #181818 */
--border: rgba(0, 229, 204, 0.15);   /* teal border — was #222222 */
--accent: #00E5CC;                    /* molten teal — was #e8ff4a */
--accent2: #FF61D2;                   /* neon pink — was #ff6b35 */
--accent3: #7B2FFF;                   /* electric purple (new variable) */
--text: #F0EBF8;                      /* lavender white — was #f0f0f0 */
--muted: #8A7AAA;                     /* muted violet — was #666666 */
--muted2: #6A5A8A;                    /* darker muted — was #666666 */
```

## New Font

Add to Google Fonts import: `Space+Grotesk:wght@300;400;500;600;700`
Keep: `DM+Mono:wght@300;400;500` and `DM+Sans:wght@300;400;500`
Remove: `Playfair+Display` (not used in Direction E)

Hero name uses `Space Grotesk` 700. Body uses `DM Sans`. Labels/mono uses `DM Mono`.

---

## File Structure

| File | Action | Notes |
|------|--------|-------|
| `index.html` | **Rename → `index-old.html`** | Backup before any change |
| `index-old.html` | Copy → new `index.html` | Start new file from this copy |
| `index.html` | **Modify** | All tasks below apply here |
| `assets/pedro-pizarro.jpg` | No change | Photo kept |
| `assets/animazione-coste.mp4` | No change | Video kept, opacity lowered |
| `docs/superpowers/plans/2026-04-11-direction-e-redesign.md` | This file | Reference only |

---

## Task 1: Backup — Rename index.html → index-old.html

**Files:**
- Rename: `index.html` → `index-old.html`

- [ ] **Step 1: Rename the file**

```bash
cd /Users/mac-pedro/Desktop/DEV/personal-website
mv index.html index-old.html
```

- [ ] **Step 2: Verify rename succeeded**

```bash
ls -la | grep index
```
Expected output: `index-old.html` present, NO `index.html`.

- [ ] **Step 3: Copy to new index.html**

```bash
cp index-old.html index.html
```

- [ ] **Step 4: Verify both files exist**

```bash
ls -la index.html index-old.html
```
Expected: both files, identical size.

- [ ] **Step 5: Commit**

```bash
git add index-old.html index.html
git commit -m "chore: backup current index.html as index-old.html before Direction E redesign"
```

---

## Task 2: Update Google Fonts Import

**Files:**
- Modify: `index.html` — the `<link rel="stylesheet">` for Google Fonts in `<head>`

Current line (approximately line 295):
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap">
```

- [ ] **Step 1: Replace the Google Fonts link**

Find the existing `fonts.googleapis.com` link and replace with:
```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap">
```

Note: `Playfair+Display` removed (not in Direction E). `Space+Grotesk` added.

- [ ] **Step 2: Verify no Playfair reference remains in the link tag**

```bash
grep "Playfair" /Users/mac-pedro/Desktop/DEV/personal-website/index.html | head -5
```

Expected: Any remaining `Playfair` references should only be in old CSS font-family declarations (handled in Task 3), not in the `<link>` tag.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(design): swap Google Fonts to Space Grotesk + DM Mono + DM Sans"
```

---

## Task 3: Update CSS Variables and Base Typography

**Files:**
- Modify: `index.html` — the `:root` block and base `body`/typography CSS

- [ ] **Step 1: Replace the `:root` CSS variables block**

Find the current `:root { ... }` block (approximately lines 302–315) and replace:

```css
:root {
  --bg: #1A0A2E;
  --surface: #26143E;
  --surface2: #301850;
  --border: rgba(0, 229, 204, 0.15);
  --accent: #00E5CC;
  --accent2: #FF61D2;
  --accent3: #7B2FFF;
  --text: #F0EBF8;
  --muted: #8A7AAA;
  --muted2: #6A5A8A;
}
```

- [ ] **Step 2: Update `body` font-family**

Find the `body { ... }` CSS rule and update the `font-family`:
```css
body {
  font-family: 'DM Sans', sans-serif;
  /* all other body properties stay unchanged */
}
```

- [ ] **Step 3: Update heading font-family declarations**

Find any CSS that references `'Playfair Display'` and replace with `'Space Grotesk'`:

```css
/* Replace all occurrences of: */
font-family: 'Playfair Display', serif;

/* With: */
font-family: 'Space Grotesk', sans-serif;
```

Specifically update these rules:
- `.hero-name` → `font-family: 'Space Grotesk', sans-serif; font-weight: 700;`
- `.section-title` → `font-family: 'Space Grotesk', sans-serif;`
- Any other `h1`, `h2`, `h3` font-family declarations that used Playfair

- [ ] **Step 4: Verify no remaining Playfair font-family references**

```bash
grep "Playfair Display" /Users/mac-pedro/Desktop/DEV/personal-website/index.html
```
Expected: 0 results.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(design): apply Direction E CSS variables — aubergine + teal + pink palette"
```

---

## Task 4: Replace Background Layers with Direction E Gradients

**Files:**
- Modify: `index.html` — CSS for `.bg-mesh`, `.bg-video`, `body::before/::after`, and any gradient overlay CSS

The current design uses `#0a0a0a` black + lime mesh with animated drift. Direction E uses aubergine base + radial violet/teal/pink gradients.

- [ ] **Step 1: Update `.bg-mesh` CSS**

Find the `.bg-mesh` CSS rule and replace the gradient content:
```css
.bg-mesh {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 15% 20%, rgba(123, 47, 255, 0.30) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 15%, rgba(0, 229, 204, 0.18) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(255, 97, 210, 0.12) 0%, transparent 55%),
    radial-gradient(ellipse at 30% 90%, rgba(123, 47, 255, 0.15) 0%, transparent 45%);
  animation: meshDrift1 22s ease-in-out infinite alternate;
  /* keep any existing opacity/filter settings */
}
```

- [ ] **Step 2: Update `@keyframes meshDrift1` and `meshDrift2`**

Find the existing keyframe declarations and replace:
```css
@keyframes meshDrift1 {
  0%   { opacity: 0.7; transform: translate(0%, 0%) scale(1); }
  50%  { opacity: 0.9; transform: translate(3%, -4%) scale(1.03); }
  100% { opacity: 0.7; transform: translate(-2%, 3%) scale(1.01); }
}
@keyframes meshDrift2 {
  0%   { opacity: 0.5; transform: translate(0%, 0%) scale(1); }
  50%  { opacity: 0.7; transform: translate(-3%, 4%) scale(1.02); }
  100% { opacity: 0.5; transform: translate(2%, -2%) scale(1.01); }
}
```

- [ ] **Step 3: Reduce background video opacity**

Find the `.bg-video` CSS and set opacity lower (Direction E background is the gradient, not video):
```css
.bg-video {
  opacity: 0.06; /* was 0.22 — dial back so gradient shows */
  /* all other properties unchanged */
}
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(design): Direction E aubergine gradient background mesh"
```

---

## Task 5: Redesign Hero Section HTML + CSS

**Files:**
- Modify: `index.html` — hero HTML (inside `<section class="hero">`) and `.hero-*` CSS rules

This is the biggest visual change. The current two-column layout (text left + photo right) becomes a centered fullscreen layout with a CSS 3D sphere above the name.

**Critical:** Keep all text content unchanged. Keep `.hero-content`, `.hero-name`, `.hero-eyebrow`, `.hero-title`, `.hero-description`, `.hero-cta` class names (voice CSS and reveal JS use class hooks). Just restructure the wrapper.

- [ ] **Step 1: Replace hero section HTML**

Find the entire `<section class="hero">...</section>` block and replace:

```html
<section class="hero">
  <!-- CSS 3D sphere — decorative, aria-hidden -->
  <div class="hero-sphere-wrap" aria-hidden="true">
    <div class="hero-sphere"></div>
    <div class="hero-sphere-ring"></div>
    <div class="hero-sphere-ring hero-sphere-ring--2"></div>
  </div>

  <div class="hero-layout">
    <div class="hero-content">
      <p class="hero-eyebrow">AI Delivery Manager · Remote EU</p>
      <h1 class="hero-name">Pedro <span>Pizarro.</span></h1>
      <p class="hero-title">I ship software. Teams actually deliver.</p>
      <p class="hero-description">
        14 years managing delivery across <strong>banking, aerospace, energy, and AI startups</strong>.
        Not theory. I've owned release pipelines, fixed broken backlogs, and embedded AI into
        sprint rituals that 40+ people now use daily.
        I work where <strong>execution matters more than slides</strong>.
      </p>
      <div class="hero-cta">
        <a href="mailto:pedropizarro@live.it" class="btn-primary copy-email">Get in touch ↗</a>
        <a href="https://linkedin.com/in/pedro-pizarro-diaz" class="btn-secondary" target="_blank" rel="me noopener noreferrer">LinkedIn profile</a>
      </div>
    </div>
  </div>

  <!-- Keep photo element for SEO alt text — hidden visually in this layout -->
  <div class="hero-photo-scroll" aria-hidden="true" style="display:none;">
    <div class="hero-photo-wrapper">
      <div class="hero-photo-inner">
        <img
          src="assets/pedro-pizarro.jpg"
          alt="Pedro Pizarro, AI Delivery Manager"
          class="hero-photo-img"
          width="400" height="400"
          loading="eager" decoding="async"
        >
      </div>
    </div>
  </div>
</section>
```

Note: Photo kept in DOM (hidden) so JSON-LD image URL stays consistent and crawlers find the alt text.

- [ ] **Step 2: Add Direction E hero CSS**

After the existing `.hero-layout` CSS block, add:

```css
/* === DIRECTION E HERO === */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 40px;
  position: relative;
}

.hero-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.hero-content {
  max-width: 760px;
  text-align: center;
}

/* CSS 3D Sphere */
.hero-sphere-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 40px;
}

.hero-sphere {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #00E5CC, #7B2FFF, #FF61D2, #00E5CC);
  animation: sphereSpin 10s linear infinite;
  position: relative;
}

.hero-sphere::after {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 32%, rgba(240, 235, 248, 0.25), var(--bg) 70%);
}

.hero-sphere-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid rgba(0, 229, 204, 0.25);
  animation: ringPulse 3s ease-in-out infinite;
  pointer-events: none;
}

.hero-sphere-ring--2 {
  width: 178px;
  height: 178px;
  border-color: rgba(255, 97, 210, 0.15);
  animation-delay: 1.2s;
}

@keyframes sphereSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes ringPulse {
  0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
  50%       { opacity: 0.8; transform: translate(-50%, -50%) scale(1.04); }
}

/* Chromatic aberration on hero name span */
.hero-name span {
  color: var(--accent);
  text-shadow: -3px 0 var(--accent2), 3px 0 var(--accent);
  transition: text-shadow 0.3s ease;
}
.hero-name span:hover {
  text-shadow: -5px 0 var(--accent2), 5px 0 var(--accent), 0 0 40px rgba(0, 229, 204, 0.4);
}

/* Hero eyebrow — teal mono */
.hero-eyebrow {
  color: var(--accent);
  font-family: 'DM Mono', monospace;
  letter-spacing: 0.2em;
}

/* CTA row centered */
.hero-cta {
  justify-content: center;
}

/* Hero description text color update */
.hero-description strong {
  color: var(--accent);
}

/* Mobile: sphere smaller */
@media (max-width: 600px) {
  .hero-sphere-wrap { width: 80px; height: 80px; }
  .hero-sphere { width: 80px; height: 80px; }
  .hero-sphere-ring { width: 104px; height: 104px; }
  .hero-sphere-ring--2 { width: 124px; height: 124px; }
}
```

- [ ] **Step 3: Update `.hero-name` CSS**

Find the existing `.hero-name` rule and update font-family (Playfair → Space Grotesk already done in Task 3). Ensure font-weight is 700 and add letter-spacing:

```css
.hero-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  /* keep existing font-size clamp and other properties */
}
```

- [ ] **Step 4: Verify hero renders correctly**

Open `http://localhost:3000` in browser and check:
- Sphere is visible, centered, rotating
- Name "Pedro Pizarro." shows with teal chromatic effect on "Pizarro."
- Two CTA buttons centered below
- No photo visible in hero

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(design): Direction E hero — CSS 3D sphere + centered layout + chromatic aberration"
```

---

## Task 6: Update Nav, Buttons, and Surface Styles

**Files:**
- Modify: `index.html` — nav CSS, `.btn-primary`, `.btn-secondary`, section borders, card styles

CSS variables from Task 3 handle most color changes automatically. This task handles specific overrides.

- [ ] **Step 1: Update nav border/background**

Find the `nav` CSS block and ensure it uses the variable correctly:
```css
nav {
  background: rgba(26, 10, 46, 0.85); /* aubergine with transparency */
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  /* keep all other nav properties */
}
```

- [ ] **Step 2: Update `.btn-primary`**

Find the `.btn-primary` CSS and update:
```css
.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: var(--bg);
  font-weight: 600;
  /* keep padding, border-radius, font-size, transition */
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--accent2), var(--accent));
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(0, 229, 204, 0.25);
}
```

- [ ] **Step 3: Update `.btn-secondary`**

```css
.btn-secondary {
  color: var(--accent);
  border-bottom-color: var(--accent);
  /* keep other properties */
}
.btn-secondary:hover {
  color: var(--accent2);
  border-bottom-color: var(--accent2);
}
```

- [ ] **Step 4: Update `.project-card` and content card borders**

Find `.project-card` CSS:
```css
.project-card {
  border: 1px solid var(--border); /* already uses variable — auto-updated */
  background: var(--surface);      /* already uses variable — auto-updated */
}
.project-card:hover {
  border-color: rgba(0, 229, 204, 0.35);
  box-shadow: 0 4px 32px rgba(0, 229, 204, 0.08);
}
```

- [ ] **Step 5: Update `.section-label` color**

```css
.section-label {
  color: var(--accent);
  /* DM Mono already applied, keep letter-spacing */
}
```

- [ ] **Step 6: Update skill tags / cert cards**

Find `.skill-tag` or equivalent skill pill CSS:
```css
.skill-tag {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text);
}
.skill-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}
```

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "feat(design): Direction E nav, buttons, cards — teal/pink accent system"
```

---

## Task 7: Update Voice Assistant CSS Color References

**Files:**
- Modify: `index.html` — ONLY the color-referencing voice CSS, NO logic changes

The voice CSS uses hardcoded `rgba(232,255,74, ...)` values (the old lime yellow accent) in glow/shadow rules. These need to map to teal `#00E5CC` = `rgb(0, 229, 204)`.

**Important:** The CSS variables (`var(--accent)`) in voice CSS are already handled by Task 3. Only hardcoded RGBA values need manual replacement.

- [ ] **Step 1: Replace hardcoded lime accent RGBA in voice CSS**

Run this search to find all hardcoded voice glow values:
```bash
grep -n "232,255,74" /Users/mac-pedro/Desktop/DEV/personal-website/index.html
```

For each occurrence, replace `rgba(232,255,74, X)` with `rgba(0, 229, 204, X)` — keeping the same alpha value.

Examples:
```css
/* OLD */
box-shadow: 0 0 8px rgba(232,255,74,0.25), 0 0 20px rgba(232,255,74,0.10);
border-color: rgba(232,255,74,0.35);

/* NEW */
box-shadow: 0 0 8px rgba(0,229,204,0.25), 0 0 20px rgba(0,229,204,0.10);
border-color: rgba(0,229,204,0.35);
```

The `@keyframes voiceNeonIdle` and `@keyframes voiceNeonActive` contain these values — update both.

- [ ] **Step 2: Replace hardcoded lime in `@keyframes voiceSpinBorder`**

```css
@keyframes voiceSpinBorder {
  0%   { border-color: rgba(0,229,204,0.2) rgba(0,229,204,0.2) rgba(0,229,204,0.2) var(--accent); }
  25%  { border-color: var(--accent) rgba(0,229,204,0.2) rgba(0,229,204,0.2) rgba(0,229,204,0.2); }
  50%  { border-color: rgba(0,229,204,0.2) var(--accent) rgba(0,229,204,0.2) rgba(0,229,204,0.2); }
  75%  { border-color: rgba(0,229,204,0.2) rgba(0,229,204,0.2) var(--accent) rgba(0,229,204,0.2); }
  100% { border-color: rgba(0,229,204,0.2) rgba(0,229,204,0.2) rgba(0,229,204,0.2) var(--accent); }
}
```

- [ ] **Step 3: Verify voice assistant still works**

Open `http://localhost:3000`, scroll to "Ask Pedro" section:
- Mic button visible with teal glow (not lime)
- Button border animates teal
- Wave bars show teal color when active
- All text labels visible

**Do NOT touch any JS code in this step.**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(design): remap voice assistant glow colors from lime to teal (no logic change)"
```

---

## Task 8: Update Stats Section Visual Style

**Files:**
- Modify: `index.html` — `.stats` CSS block and stat card styling

- [ ] **Step 1: Update stat numbers to use Direction E accent**

Find the `.stats` CSS block and stat number styles:
```css
.stat-number, .stat-value {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
}
```

If the stat numbers currently use `color: var(--accent)` directly (simpler), that's also fine — the variable swap in Task 3 already handles it. Only add the gradient if the HTML currently shows plain color.

- [ ] **Step 2: Update stat borders/dividers**

Any horizontal or vertical dividers between stats:
```css
.stats .stat-divider, .stats > * + * {
  border-left-color: var(--border); /* auto-updated via variable */
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(design): Direction E stats — gradient accent on numbers"
```

---

## Task 9: Add Holographic Gradient Accents to Section Titles

**Files:**
- Modify: `index.html` — `.section-title` CSS and any key heading styles

Direction E uses holographic gradient text on prominent headings.

- [ ] **Step 1: Add gradient effect to `.section-title`**

Find or create a `.section-title` CSS rule:
```css
.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  /* keep existing font-size */
}
```

No gradient on section-title (keep legible). Reserve gradient for hero only.

- [ ] **Step 2: Add holographic border to `.voice-response-card`**

Find `.voice-response-card` CSS and add a left-border accent:
```css
.voice-response-card {
  border-left: 2px solid var(--accent); /* teal left border */
  /* existing: background, padding, border-radius unchanged */
}
```

- [ ] **Step 3: Update scroll progress bar color**

Find `#scroll-progress` CSS:
```css
#scroll-progress {
  background: linear-gradient(to right, var(--accent), var(--accent2));
  /* keep height, position, z-index */
}
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat(design): Direction E polish — gradient scroll bar, voice card border"
```

---

## Task 10: Final Verification

**Files:**
- Read: `index.html` — verify all constraints met

- [ ] **Step 1: Verify SEO head block intact**

```bash
grep -c "application/ld+json" /Users/mac-pedro/Desktop/DEV/personal-website/index.html
```
Expected: `2` (two JSON-LD script blocks)

```bash
grep "og:title" /Users/mac-pedro/Desktop/DEV/personal-website/index.html
```
Expected: `<meta property="og:title" content="Pedro Pizarro — AI Delivery Manager">`

```bash
grep "G-Z8W56KE5NY" /Users/mac-pedro/Desktop/DEV/personal-website/index.html
```
Expected: GA4 tracking ID found

- [ ] **Step 2: Verify voice assistant JS intact**

```bash
grep -c "PEDRO_INSTRUCTIONS" /Users/mac-pedro/Desktop/DEV/personal-website/index.html
```
Expected: `2` (declaration + reference)

```bash
grep "deepgram.com" /Users/mac-pedro/Desktop/DEV/personal-website/index.html
```
Expected: `wss://agent.deepgram.com/v1/agent/converse`

- [ ] **Step 3: Verify content section IDs intact**

```bash
grep 'id="about"\|id="voice"\|id="work"\|id="experience"\|id="skills"\|id="certifications"\|id="writing"\|id="contact"' /Users/mac-pedro/Desktop/DEV/personal-website/index.html
```
Expected: all 8 IDs found

- [ ] **Step 4: Verify no Playfair Display in link tag**

```bash
grep "Playfair" /Users/mac-pedro/Desktop/DEV/personal-website/index.html | grep "fonts.googleapis"
```
Expected: 0 results

- [ ] **Step 5: Verify Direction E colors applied**

```bash
grep "#1A0A2E\|#00E5CC\|#FF61D2\|#7B2FFF" /Users/mac-pedro/Desktop/DEV/personal-website/index.html | head -5
```
Expected: multiple matches

- [ ] **Step 6: Visual browser check — open portfolio server**

```bash
# Portfolio server already configured in .claude/launch.json port 3000
# Open http://localhost:3000 and verify:
```

Check in browser:
1. Background: deep aubergine/violet (NOT pure black)
2. Hero: sphere rotating, "Pizarro." has teal chromatic effect
3. Accent color throughout: teal `#00E5CC` (NOT lime yellow)
4. Nav: semi-transparent aubergine with teal borders
5. "Ask Pedro" mic button: teal glow (NOT lime)
6. Stat numbers: teal/pink gradient or teal color
7. Mobile (375px): sphere smaller, hero centered, readable

- [ ] **Step 7: Final commit**

```bash
git add index.html
git commit -m "feat: apply Direction E (Sci-Fi/Aubergine) redesign — teal+pink+violet palette, Space Grotesk, CSS 3D sphere, chromatic aberration hero"
```

---

## Self-Review: Spec Coverage Check

| Requirement | Covered by Task |
|-------------|-----------------|
| Rename index.html → index-old.html | Task 1 ✓ |
| Direction E palette applied | Tasks 3, 4, 6, 7, 8 ✓ |
| Space Grotesk font | Tasks 2, 3, 5 ✓ |
| CSS 3D sphere in hero | Task 5 ✓ |
| Chromatic aberration on "Pizarro." | Task 5 ✓ |
| Centered hero layout (not split-screen) | Task 5 ✓ |
| SEO meta tags preserved | Tasks 1, 10 ✓ |
| JSON-LD blocks preserved | Tasks 1, 10 ✓ |
| GA4 tracking preserved | Tasks 1, 10 ✓ |
| Voice assistant HTML preserved | Task 7 ✓ |
| Voice assistant JS preserved | Task 7 ✓ |
| Voice CSS updated (lime→teal) | Task 7 ✓ |
| Content sections (#about…#contact) preserved | Tasks 1, 10 ✓ |
| Photo in DOM for SEO | Task 5 ✓ |
| Holographic background gradients | Task 4 ✓ |
| Scroll progress bar → gradient | Task 9 ✓ |
| Mobile responsive | Tasks 5, 10 ✓ |
| No hardcoded lime rgba remaining | Task 7 ✓ |
