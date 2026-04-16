// Navigation investigation script — no fixes, only observe and screenshot
const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:61130';
const OUT = '/Users/mac-pedro/Desktop/DEV/personal-website/nav-screenshots';

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  { url: '/', label: 'homepage' },
  { url: '/about.html', label: 'about' },
  { url: '/services.html', label: 'services' },
  { url: '/blog/', label: 'blog' },
  { url: '/case-studies/', label: 'case-studies' },
];

const VIEWPORTS = [
  { width: 1280, height: 800, label: 'desktop' },
  { width: 768, label: 'tablet', height: 1024 },
  { width: 375, height: 812, label: 'mobile' },
];

const findings = [];

function log(msg) {
  console.log(msg);
  findings.push(msg);
}

async function screenshotNav(page, label) {
  const header = page.locator('header, .site-header, nav').first();
  const box = await header.boundingBox().catch(() => null);
  if (box) {
    await page.screenshot({
      path: path.join(OUT, `${label}.png`),
      clip: { x: 0, y: 0, width: box.width + box.x, height: Math.min(box.height + box.y + 20, 200) },
    });
  } else {
    await page.screenshot({ path: path.join(OUT, `${label}.png`), fullPage: false });
  }
}

async function countNavLinks(page) {
  const links = await page.locator('.nav-links a').all();
  const texts = await Promise.all(links.map(l => l.innerText()));
  return { count: links.length, texts };
}

async function checkNavOverflow(page) {
  return page.evaluate(() => {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return { overflow: false, details: 'nav-links not found' };
    const style = getComputedStyle(navLinks);
    const scrollable = navLinks.scrollWidth > navLinks.clientWidth;
    const wrapping = style.flexWrap !== 'nowrap';
    return {
      scrollWidth: navLinks.scrollWidth,
      clientWidth: navLinks.clientWidth,
      overflow: scrollable,
      flexWrap: style.flexWrap,
      overflowX: style.overflowX,
      wrapping,
    };
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ──────────────────────────────────────────
  // 1. Audit every page at every viewport
  // ──────────────────────────────────────────
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    for (const pg of PAGES) {
      await page.goto(BASE + pg.url, { waitUntil: 'networkidle' });
      const { count, texts } = await countNavLinks(page);
      const overflow = await checkNavOverflow(page);
      const label = `${vp.label}_${pg.label}_initial`;

      log(`\n=== [${vp.label} ${vp.width}px] ${pg.url} ===`);
      log(`  Nav links (${count}): ${texts.join(' | ')}`);
      log(`  Overflow: scrollWidth=${overflow.scrollWidth} clientWidth=${overflow.clientWidth} overflows=${overflow.overflow} flexWrap=${overflow.flexWrap}`);

      await screenshotNav(page, label);
    }

    await ctx.close();
  }

  // ──────────────────────────────────────────
  // 2. Click "About" on homepage — observe what happens
  // ──────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });

    log('\n=== CLICK TEST: About link on homepage ===');
    const { texts: beforeTexts, count: beforeCount } = await countNavLinks(page);
    log(`  Before click — links (${beforeCount}): ${beforeTexts.join(' | ')}`);
    await screenshotNav(page, 'click_test_homepage_before');

    // Click About (#about anchor)
    const aboutLink = page.locator('.nav-links a').filter({ hasText: 'About' }).first();
    await aboutLink.click();
    await page.waitForTimeout(800);

    const { texts: afterTexts, count: afterCount } = await countNavLinks(page);
    log(`  After clicking About — links (${afterCount}): ${afterTexts.join(' | ')}`);
    log(`  URL after click: ${page.url()}`);
    await screenshotNav(page, 'click_test_homepage_after_about');
    await page.screenshot({ path: path.join(OUT, 'click_test_homepage_after_about_full.png'), fullPage: false });

    await ctx.close();
  }

  // ──────────────────────────────────────────
  // 3. Click every nav link on about.html
  // ──────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();

    log('\n=== CLICK TEST: Each nav link on /about.html ===');
    const links = await (async () => {
      await page.goto(BASE + '/about.html', { waitUntil: 'networkidle' });
      const els = await page.locator('.nav-links a').all();
      return Promise.all(els.map(async (el, i) => ({
        text: await el.innerText(),
        href: await el.getAttribute('href'),
        index: i,
      })));
    })();

    for (const { text, href, index } of links) {
      await page.goto(BASE + '/about.html', { waitUntil: 'networkidle' });
      const { count: navCount } = await countNavLinks(page);
      const linkEl = page.locator('.nav-links a').nth(index);
      await screenshotNav(page, `about_before_click_${index}`);

      await linkEl.click();
      await page.waitForTimeout(600);
      const urlAfter = page.url();
      const { texts: textsAfter, count: countAfter } = await countNavLinks(page);
      log(`  Clicked "${text}" (href="${href}") → url=${urlAfter} | links now: ${countAfter} [${textsAfter.join(' | ')}]`);

      // Check if nav changed content unexpectedly
      if (countAfter !== navCount) {
        log(`  !! NAV LINK COUNT CHANGED: was ${navCount}, now ${countAfter}`);
      }

      const screenshotLabel = `about_after_click_${index}_${text.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
      await screenshotNav(page, screenshotLabel);
      await page.screenshot({ path: path.join(OUT, `${screenshotLabel}_full.png`), fullPage: false });
    }

    await ctx.close();
  }

  // ──────────────────────────────────────────
  // 4. Mobile nav investigation
  // ──────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();

    for (const pg of PAGES) {
      await page.goto(BASE + pg.url, { waitUntil: 'networkidle' });
      const overflow = await checkNavOverflow(page);
      const { count, texts } = await countNavLinks(page);
      log(`\n=== [mobile 375px] ${pg.url} ===`);
      log(`  Links (${count}): ${texts.join(' | ')}`);
      log(`  Overflow: ${JSON.stringify(overflow)}`);
      await page.screenshot({ path: path.join(OUT, `mobile_${pg.label}_full.png`), fullPage: false });
      await screenshotNav(page, `mobile_${pg.label}_nav`);
    }

    await ctx.close();
  }

  // ──────────────────────────────────────────
  // 5. From homepage: navigate to About page via nav link
  //    (homepage's nav has NO /about.html link — only #about anchor)
  // ──────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });

    log('\n=== CROSS-PAGE NAV: homepage → /about.html (if link exists) ===');
    const allLinks = await page.locator('.nav-links a').all();
    const hrefs = await Promise.all(allLinks.map(l => l.getAttribute('href')));
    log(`  Homepage nav hrefs: ${hrefs.join(' | ')}`);

    const hasAboutPage = hrefs.some(h => h && h.includes('about.html'));
    log(`  Homepage has /about.html link: ${hasAboutPage}`);

    if (!hasAboutPage) {
      log('  !! Homepage nav has NO /about.html link — only #about anchor');
      log('  !! This means users on the homepage cannot navigate to the About page via nav');
    }

    await ctx.close();
  }

  await browser.close();

  // Write summary
  const summaryPath = path.join(OUT, 'findings.txt');
  fs.writeFileSync(summaryPath, findings.join('\n'), 'utf8');
  console.log(`\nFindings written to: ${summaryPath}`);
  console.log(`Screenshots saved to: ${OUT}`);
})();
