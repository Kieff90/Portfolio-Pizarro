# Hero Voice Orb Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the decorative CSS sphere in the hero with a liquid blob voice orb that IS the Deepgram AI assistant trigger, restores the photo as a 48px avatar, and eliminates the max-width bottleneck on hero content.

**Architecture:** Single-file HTML/CSS/JS site (`index.html`). Changes are pure CSS + HTML structure swap + JS wiring. The existing `connect()` / `cleanup()` / `setState()` voice functions are untouched — we add orb class sync into `setState()` and a second click listener on the orb element.

**Tech Stack:** HTML, CSS animations (keyframes, border-radius morph, SVG feTurbulence), vanilla JS. No build tools. No new dependencies.

---

## File Map

| File | Changes |
|------|---------|
| `index.html` lines 510–565 | Replace `.hero-layout`, `.hero-content`, `.hero-sphere-wrap/sphere/ring` CSS with liquid blob CSS + orb states |
| `index.html` lines 445–447 | Hero padding: add `clamp()` vertical padding |
| `index.html` lines 487–495 | `.hero-description`: remove explicit `max-width` constraint (keep `560px` but let hero-content be full-width) |
| `index.html` lines 1734, 1755–1756, 1791–1793 | Responsive: replace sphere breakpoint rules with blob breakpoint rules |
| `index.html` lines 1568–1573 | `fadeInUp` animations: replace `hero-photo-scroll` with `hero-talk-label` + `hero-avatar-row` |
| `index.html` lines 1683–1687 | Reduced-motion: replace sphere/photo refs with blob refs |
| `index.html` lines 1719–1734 | Print CSS: replace sphere ref |
| `index.html` lines 1835–1875 | Hero HTML: orb `<button>`, talk label, avatar `<img>`, remove `hero-layout` wrapper |
| `index.html` lines 2681–2697 | `setState()` JS: add orb class sync |
| `index.html` lines 2899–2909 | Orb click handler (after existing voiceBtn listener) |

---

## Task 1 — Replace Hero Sphere CSS with Liquid Blob CSS

**File:** `index.html` CSS section

- [ ] **Step 1.1 — Replace the hero layout + sphere block**

Find and replace this entire CSS block (lines ~510–565):

```css
  /* ── HERO LAYOUT (Direction E — centered column) ── */
  .hero-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0;
  }
  .hero-content {
    width: 100%;
    max-width: 680px;
  }

  /* ── HERO 3D SPHERE ── */
  .hero-sphere-wrap {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 0 auto 40px;
  }
  .hero-sphere {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(from 0deg, var(--accent), var(--accent3), var(--accent2), var(--accent));
    animation: sphereSpin 8s linear infinite;
    position: relative;
  }
  .hero-sphere::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, rgba(240,235,248,0.25), var(--bg) 70%);
  }
  .hero-sphere-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(0,229,204,0.3);
    animation: sphereRingPulse 3s ease-in-out infinite;
    pointer-events: none;
  }
  .hero-sphere-ring { inset: -20px; }
  .hero-sphere-ring--2 {
    inset: -36px;
    border-color: rgba(255,97,210,0.2);
    animation-delay: 1s;
  }
  @keyframes sphereSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes sphereRingPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50%       { opacity: 0.8; transform: scale(1.04); }
  }
```

Replace with:

```css
  /* ── HERO: centered column, full container width ── */
  .hero-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .hero-content {
    width: 100%;
  }

  /* ── LIQUID BLOB ORB ── */
  .orb-blob-wrap {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 16px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }
  .orb-blob {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent3) 50%, var(--accent2) 100%);
    animation: blobMorph 5s ease-in-out infinite alternate,
               blobGlow  3s ease-in-out infinite;
    position: relative;
    filter: url(#orb-turbulence);
    transition: animation-duration 0.4s;
  }
  .orb-blob::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 33% 28%, rgba(255,255,255,0.42) 0%, transparent 50%);
    pointer-events: none;
  }
  .orb-ring-1 {
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    border: 1px solid rgba(0,229,204,0.3);
    animation: orbRingPulse 2.8s ease-in-out infinite;
    pointer-events: none;
  }
  .orb-ring-2 {
    position: absolute;
    inset: -36px;
    border-radius: 50%;
    border: 1px solid rgba(255,97,210,0.18);
    animation: orbRingPulse 2.8s 1s ease-in-out infinite;
    pointer-events: none;
  }

  /* Idle (default) */
  @keyframes blobMorph {
    0%   { border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%; transform: scale(1) rotate(0deg); }
    15%  { border-radius: 58% 42% 54% 46% / 46% 54% 46% 54%; }
    30%  { border-radius: 44% 56% 42% 58% / 56% 44% 56% 44%; }
    50%  { border-radius: 56% 44% 60% 40% / 40% 60% 40% 60%; transform: scale(1.03) rotate(4deg); }
    70%  { border-radius: 42% 58% 44% 56% / 58% 42% 58% 42%; }
    85%  { border-radius: 52% 48% 50% 50% / 48% 52% 48% 52%; }
    100% { border-radius: 50% 50% 48% 52% / 52% 48% 52% 48%; transform: scale(1.05) rotate(-3deg); }
  }
  @keyframes blobGlow {
    0%,100% {
      box-shadow: 0 0 28px rgba(0,229,204,0.5),
                  0 0 60px rgba(0,229,204,0.2),
                  0 0 100px rgba(0,229,204,0.06);
    }
    50% {
      box-shadow: 0 0 40px rgba(255,97,210,0.55),
                  0 0 80px rgba(255,97,210,0.22),
                  0 0 120px rgba(255,97,210,0.07);
    }
  }
  @keyframes orbRingPulse {
    0%,100% { opacity: 0.3; transform: scale(1); }
    50%     { opacity: 0.8; transform: scale(1.05); }
  }

  /* State: loading */
  .orb-blob-wrap.orb-loading .orb-blob {
    animation: blobMorph 8s ease-in-out infinite alternate,
               blobGlowMuted 2s ease-in-out infinite;
    opacity: 0.7;
  }
  @keyframes blobGlowMuted {
    0%,100% { box-shadow: 0 0 16px rgba(0,229,204,0.25), 0 0 40px rgba(0,229,204,0.08); }
    50%     { box-shadow: 0 0 20px rgba(123,47,255,0.3),  0 0 50px rgba(123,47,255,0.1); }
  }

  /* State: recording/listening */
  .orb-blob-wrap.orb-recording .orb-blob {
    animation: blobMorphFast 2s ease-in-out infinite alternate,
               blobGlowRecording 1.2s ease-in-out infinite;
  }
  @keyframes blobMorphFast {
    0%   { border-radius: 60% 40% 55% 45% / 45% 55% 45% 55%; transform: scale(1.02); }
    33%  { border-radius: 40% 60% 42% 58% / 58% 42% 58% 42%; transform: scale(1.06); }
    66%  { border-radius: 55% 45% 62% 38% / 38% 62% 38% 62%; transform: scale(1.03); }
    100% { border-radius: 48% 52% 44% 56% / 54% 46% 54% 46%; transform: scale(1.05); }
  }
  @keyframes blobGlowRecording {
    0%,100% {
      box-shadow: 0 0 36px rgba(255,97,210,0.7),
                  0 0 80px rgba(255,97,210,0.3),
                  0 0 140px rgba(255,97,210,0.1);
    }
    50% {
      box-shadow: 0 0 50px rgba(255,97,210,0.95),
                  0 0 100px rgba(255,97,210,0.45),
                  0 0 180px rgba(255,97,210,0.15);
    }
  }
  .orb-blob-wrap.orb-recording .orb-ring-1 {
    animation: orbRingPulse 0.8s ease-in-out infinite;
    border-color: rgba(255,97,210,0.5);
  }
  .orb-blob-wrap.orb-recording .orb-ring-2 {
    animation: orbRingPulse 0.8s 0.4s ease-in-out infinite;
    border-color: rgba(255,97,210,0.3);
  }

  /* State: speaking */
  .orb-blob-wrap.orb-speaking .orb-blob {
    animation: blobMorph 3.5s ease-in-out infinite alternate,
               blobGlowSpeaking 1.8s ease-in-out infinite;
  }
  @keyframes blobGlowSpeaking {
    0%,100% {
      box-shadow: 0 0 40px rgba(0,229,204,0.7),
                  0 0 90px rgba(0,229,204,0.3),
                  0 0 150px rgba(0,229,204,0.1);
    }
    50% {
      box-shadow: 0 0 60px rgba(0,229,204,0.9),
                  0 0 120px rgba(0,229,204,0.4),
                  0 0 200px rgba(0,229,204,0.12);
    }
  }
  .orb-blob-wrap.orb-speaking .orb-ring-1 {
    border-color: rgba(0,229,204,0.6);
    animation: orbRingPulse 1s ease-in-out infinite;
  }

  /* ── ORB LABEL ("Click to talk to Pedro") ── */
  .orb-talk-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    opacity: 0.85;
    transition: opacity 0.3s;
  }
  .orb-talk-label:hover { opacity: 1; }
  .orb-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--accent);
    animation: orbDotBlink 1.6s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes orbDotBlink {
    0%,100% { opacity: 0.3; transform: scale(1); }
    50%     { opacity: 1;   transform: scale(1.4); }
  }

  /* ── AVATAR ROW (foto + eyebrow) ── */
  .hero-avatar-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .hero-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    object-position: top center;
    flex-shrink: 0;
    border: 2px solid rgba(0,229,204,0.35);
    box-shadow:
      0 0 0 4px rgba(0,229,204,0.08),
      0 4px 16px rgba(0,0,0,0.5);
    filter: brightness(1.05) contrast(1.05) saturate(1.1);
  }
```

- [ ] **Step 1.2 — Commit CSS changes**

```bash
git add index.html
git commit -m "feat: liquid blob orb CSS — morphing animation + 4 voice states + avatar styles"
```

---

## Task 2 — Add SVG Filter for Blob Turbulence

The `filter: url(#orb-turbulence)` in the CSS needs a matching inline SVG filter in the HTML body.

- [ ] **Step 2.1 — Add SVG filter just before `<header>`**

Find this line in the HTML (around line 1811):
```html
<!-- NAV -->
<header class="site-header">
```

Insert immediately before it:

```html
<!-- Blob turbulence filter for voice orb -->
<svg style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
  <defs>
    <filter id="orb-turbulence" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.014"
                    numOctaves="3" seed="5" result="noise">
        <animate attributeName="seed" values="5;12;19;5" dur="9s" repeatCount="indefinite"/>
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="10"
                         xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>
</svg>
```

- [ ] **Step 2.2 — Commit**

```bash
git add index.html
git commit -m "feat: SVG feTurbulence filter for liquid orb displacement effect"
```

---

## Task 3 — Replace Hero HTML Structure

- [ ] **Step 3.1 — Replace the entire hero section HTML**

Find and replace this entire block (lines ~1833–1875):

```html
<!-- HERO -->
<div class="container">
  <section class="hero">
    <!-- Direction E: CSS 3D sphere -->
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

    <!-- Photo kept hidden for SEO alt text -->
    <div class="hero-photo-scroll" aria-hidden="true">
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
</div>
```

Replace with:

```html
<!-- HERO -->
<div class="container">
  <section class="hero">
    <div class="hero-layout">
      <div class="hero-content">

        <!-- Voice Orb — AI assistant trigger -->
        <button class="orb-blob-wrap" id="hero-orb"
                aria-label="Avvia conversazione con Pedro AI"
                title="Click to talk to Pedro">
          <div class="orb-blob"></div>
          <div class="orb-ring-1" aria-hidden="true"></div>
          <div class="orb-ring-2" aria-hidden="true"></div>
        </button>

        <p class="orb-talk-label" aria-hidden="true">
          <span class="orb-dot"></span>
          Click to talk to Pedro
        </p>

        <!-- Avatar + eyebrow -->
        <div class="hero-avatar-row">
          <img
            src="assets/pedro-pizarro.jpg"
            alt="Pedro Pizarro, AI Delivery Manager"
            class="hero-avatar"
            width="48" height="48"
            loading="eager" decoding="async"
          >
          <p class="hero-eyebrow">AI Delivery Manager · Remote EU</p>
        </div>

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

    <!-- Hidden photo preserved for structured data alt text -->
    <div class="hero-photo-scroll" aria-hidden="true">
      <div class="hero-photo-wrapper">
        <div class="hero-photo-inner">
          <img
            src="assets/pedro-pizarro.jpg"
            alt="Pedro Pizarro, AI Delivery Manager"
            class="hero-photo-img"
            width="400" height="400"
            loading="lazy" decoding="async"
          >
        </div>
      </div>
    </div>
  </section>
</div>
```

- [ ] **Step 3.2 — Commit HTML**

```bash
git add index.html
git commit -m "feat: hero HTML — orb button, avatar row, remove sphere divs"
```

---

## Task 4 — Wire Orb to Voice Assistant JS

- [ ] **Step 4.1 — Add orb variable and state sync to `setState()`**

Find the `setState` function (around line 2681):

```javascript
    function setState(s, label) {
      voiceBtn.classList.remove('recording', 'loading', 'speaking');
      voiceBtn.setAttribute('aria-pressed', 'false');
      voiceBtn.disabled = false;
```

Replace with:

```javascript
    var heroOrb = document.getElementById('hero-orb');

    function setState(s, label) {
      voiceBtn.classList.remove('recording', 'loading', 'speaking');
      voiceBtn.setAttribute('aria-pressed', 'false');
      voiceBtn.disabled = false;
      if (heroOrb) {
        heroOrb.classList.remove('orb-recording', 'orb-loading', 'orb-speaking');
      }
```

- [ ] **Step 4.2 — Add orb class per state inside `setState()`**

The function continues with `if (s === 'recording')` etc. Find and replace the full if/else block:

```javascript
        voiceBtn.classList.add('recording');
        voiceBtn.setAttribute('aria-pressed', 'true');
```

Add orb sync immediately after each `voiceBtn.classList.add(...)` line. Find the three state branches and add the orb class:

After `voiceBtn.classList.add('recording');`:
```javascript
        if (heroOrb) heroOrb.classList.add('orb-recording');
```

After `voiceBtn.classList.add('loading');`:
```javascript
        if (heroOrb) heroOrb.classList.add('orb-loading');
```

After `voiceBtn.classList.add('speaking');`:
```javascript
        if (heroOrb) heroOrb.classList.add('orb-speaking');
```

- [ ] **Step 4.3 — Add orb click handler after `voiceBtn.addEventListener`**

Find this block (around line 2899):
```javascript
    voiceBtn.addEventListener('click', function () {
      if (isConnected) {
        cleanup();
        setState('idle', 'Click the microphone to start a conversation');
        return;
      }
      responseCard.hidden = true;
      voiceError.hidden = true;
      transcriptBox.hidden = true;
      connect();
    });
```

Immediately after the closing `});` of that block, add:

```javascript
    /* Hero orb — same behaviour as voice-btn */
    if (heroOrb) {
      heroOrb.addEventListener('click', function () {
        if (isConnected) {
          cleanup();
          setState('idle', 'Click the microphone to start a conversation');
          return;
        }
        responseCard.hidden = true;
        voiceError.hidden = true;
        transcriptBox.hidden = true;
        connect();
      });
    }
```

- [ ] **Step 4.4 — Commit JS wiring**

```bash
git add index.html
git commit -m "feat: wire hero orb to voice assistant — click triggers connect/cleanup, setState syncs orb classes"
```

---

## Task 5 — Fix Responsive CSS + Reduced-Motion + Print

- [ ] **Step 5.1 — Fix fadeInUp animation entries**

Find (around line 1568):
```css
  .hero-photo-scroll { animation: fadeInUp 0.5s 0.5s ease both; }
```

Replace with:
```css
  .hero-avatar-row  { animation: fadeInUp 0.5s 0.4s ease both; }
  .orb-talk-label   { animation: fadeInUp 0.5s 0.5s ease both; }
```

- [ ] **Step 5.2 — Fix tablet breakpoint (≤768px)**

Find (around line 1755):
```css
    .hero { padding: 28px 0 40px; }
    .hero-sphere-wrap { width: 120px; height: 120px; margin-bottom: 28px; }
```

Replace with:
```css
    .hero { padding: 28px 0 40px; }
    .orb-blob-wrap { width: 150px; height: 150px; }
    .orb-blob      { width: 150px; height: 150px; }
```

- [ ] **Step 5.3 — Fix mobile breakpoint (≤480px)**

Find (around line 1791):
```css
    .hero { padding: 36px 0 32px; }
    .hero-sphere-wrap { width: 100px; height: 100px; margin-bottom: 24px; }
    .hero-cta { flex-direction: column; align-items: center; }
```

Replace with:
```css
    .hero { padding: 36px 0 32px; }
    .orb-blob-wrap { width: 120px; height: 120px; }
    .orb-blob      { width: 120px; height: 120px; }
    .hero-cta { flex-direction: column; align-items: center; }
```

- [ ] **Step 5.4 — Fix reduced-motion**

Find (around line 1683):
```css
    /* Photo animations off */
    .hero-photo-inner { animation: none; }
    .hero-photo-scroll, .hero-photo-wrapper {
      transform: none !important;
      transition: none !important;
      will-change: auto;
    }
```

Replace with:
```css
    /* Blob animations off — keep static shape */
    .orb-blob { animation: none; border-radius: 50%; }
    .orb-ring-1, .orb-ring-2 { animation: none; }
    .orb-dot { animation: none; opacity: 0.7; }
```

- [ ] **Step 5.5 — Fix print CSS**

Find (around line 1731):
```css
    .hero-photo-scroll, .hero-photo-wrapper, .hero-photo-inner {
      transform: none !important; animation: none !important;
    }
    .hero-sphere-wrap { display: none; }
```

Replace with:
```css
    .orb-blob-wrap, .orb-ring-1, .orb-ring-2, .orb-talk-label { display: none !important; }
    .hero-avatar { width: 32px; height: 32px; filter: none; }
```

- [ ] **Step 5.6 — Commit responsive + a11y fixes**

```bash
git add index.html
git commit -m "fix: responsive blob sizing, reduced-motion, print CSS for hero orb"
```

---

## Task 6 — Visual Verification + Deploy

- [ ] **Step 6.1 — Open live preview**

```bash
# Server già in launch.json: npx serve -p 3000
# Open http://localhost:3000
```

Verify:
- [ ] Blob animates (morph + glow alternating teal/pink)
- [ ] Rings pulse around the blob
- [ ] Avatar photo visible (48px circle) with teal border
- [ ] "Click to talk to Pedro" label visible with blinking dot
- [ ] Clicking orb → voice assistant starts (recording state → pink intense glow)
- [ ] Speaking state → teal intense glow
- [ ] No excessive side whitespace on desktop
- [ ] Mobile (resize to 375px): orb shrinks to 120px, CTA stacks vertically

- [ ] **Step 6.2 — Grep check: no sphere refs outside print/reduced-motion**

```bash
grep -n "hero-sphere\|sphereSpin\|sphereRingPulse" index.html
```

Expected: 0 results (all removed).

```bash
grep -n "orb-blob\|orb-ring\|blobMorph\|blobGlow" index.html | wc -l
```

Expected: 30+ lines (new blob CSS present).

- [ ] **Step 6.3 — Final commit + push**

```bash
git add index.html
git commit -m "feat: hero voice orb complete — liquid blob, avatar, JS wiring, responsive"
git push origin main
```

Expected: GitHub Actions deploys to IONOS within ~90 seconds. Check `https://pedropizarrodiaz.it` after 2 minutes.
