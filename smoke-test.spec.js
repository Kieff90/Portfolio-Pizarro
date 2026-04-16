const { chromium } = require('playwright');

async function runSmokeTests() {
  const BASE = 'http://localhost:61130';
  const results = [];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture console errors
  const jsErrors = [];
  page.on('pageerror', (err) => jsErrors.push(err.message));

  // ─── TEST 1: Homepage nav — exactly 5 links, no "Ask Pedro" ───────────────
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  const homeNavLinks = await page.evaluate(() => {
    const nav = document.querySelector('nav') || document.querySelector('header');
    if (!nav) return [];
    return Array.from(nav.querySelectorAll('a')).map(a => a.textContent.trim());
  });

  const expectedLinks = ['About', 'Services', 'Blog', 'Case Studies', 'Contact'];
  const hasExactlyFive = homeNavLinks.length === 5;
  const hasAllExpected = expectedLinks.every(l => homeNavLinks.some(nl => nl === l));
  const hasNoAskPedro = !homeNavLinks.some(l => l.toLowerCase().includes('ask pedro'));

  results.push({
    id: '1',
    label: 'Homepage nav — 5 links (About, Services, Blog, Case Studies, Contact), no "Ask Pedro"',
    pass: hasExactlyFive && hasAllExpected && hasNoAskPedro,
    detail: `Found links: [${homeNavLinks.join(', ')}] | count=${homeNavLinks.length} hasAll=${hasAllExpected} noAskPedro=${hasNoAskPedro}`
  });

  // ─── TEST 2: Homepage #contact section ────────────────────────────────────
  // Click Contact nav link and check footer content
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  const contactSection = await page.evaluate(() => {
    const el = document.querySelector('#contact');
    if (!el) return null;
    return el.innerText || el.textContent;
  });

  const hasName = contactSection && contactSection.includes('Pedro Pizarro');
  const hasEmail = contactSection && /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(contactSection);
  const hasPhone = contactSection && /[\+\d][\d\s\-\(\)]{7,}/.test(contactSection);
  const hasLinkedIn = contactSection && contactSection.toLowerCase().includes('linkedin');
  const hasGitHub = contactSection && contactSection.toLowerCase().includes('github');
  const hasMedium = contactSection && contactSection.toLowerCase().includes('medium');

  results.push({
    id: '2',
    label: 'Homepage #contact — has Pedro Pizarro Diaz, email, phone, LinkedIn, GitHub, Medium',
    pass: !!(hasName && hasEmail && hasPhone && hasLinkedIn && hasGitHub && hasMedium),
    detail: `name=${hasName} email=${hasEmail} phone=${hasPhone} linkedin=${hasLinkedIn} github=${hasGitHub} medium=${hasMedium}`
  });

  // ─── TEST 3: About page nav — same 5 links, no "Ask Pedro" ────────────────
  await page.goto(BASE + '/about.html', { waitUntil: 'domcontentloaded' });

  const aboutNavLinks = await page.evaluate(() => {
    const nav = document.querySelector('nav') || document.querySelector('header');
    if (!nav) return [];
    return Array.from(nav.querySelectorAll('a')).map(a => a.textContent.trim());
  });

  const aboutHasFive = aboutNavLinks.length === 5;
  const aboutHasAll = expectedLinks.every(l => aboutNavLinks.some(nl => nl === l));
  const aboutNoAskPedro = !aboutNavLinks.some(l => l.toLowerCase().includes('ask pedro'));

  results.push({
    id: '3',
    label: 'About page nav — 5 links, no "Ask Pedro"',
    pass: aboutHasFive && aboutHasAll && aboutNoAskPedro,
    detail: `Found links: [${aboutNavLinks.join(', ')}] | count=${aboutNavLinks.length} hasAll=${aboutHasAll} noAskPedro=${aboutNoAskPedro}`
  });

  // ─── TEST 4: About page bio text ──────────────────────────────────────────
  const aboutBodyText = await page.evaluate(() => document.body.innerText || document.body.textContent);

  const hasWhatIBuild = /what i build/i.test(aboutBodyText);
  const hasTwoAgentPipeline = /two.agent pipeline|2.agent pipeline/i.test(aboutBodyText);
  const hasOldScrum = /I started my career as a Scrum Master in 2010/.test(aboutBodyText);

  results.push({
    id: '4',
    label: 'About page bio — has "What I Build" heading + two-agent pipeline text, no "I started my career as a Scrum Master in 2010"',
    pass: hasWhatIBuild && hasTwoAgentPipeline && !hasOldScrum,
    detail: `hasWhatIBuild=${hasWhatIBuild} hasTwoAgentPipeline=${hasTwoAgentPipeline} hasOldScrum=${hasOldScrum}`
  });

  // ─── TEST 5: Voice UI — no JS error on orb click, response card exists ────
  jsErrors.length = 0; // reset
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });

  const orbExists = await page.evaluate(() => !!document.getElementById('hero-orb'));
  const cardExists = await page.evaluate(() => !!document.getElementById('voice-response-card'));

  let orbClickError = null;
  if (orbExists) {
    try {
      await page.evaluate(() => {
        document.getElementById('hero-orb').click();
      });
      // Small wait for any async JS
      await page.waitForTimeout(500);
    } catch (e) {
      orbClickError = e.message;
    }
  }

  const voiceJsErrors = jsErrors.filter(e =>
    !e.includes('favicon') && !e.includes('net::') && !e.includes('Failed to fetch')
  );

  results.push({
    id: '5',
    label: 'Voice UI — hero-orb clickable without JS error, voice-response-card exists',
    pass: orbExists && cardExists && voiceJsErrors.length === 0 && !orbClickError,
    detail: `orbExists=${orbExists} cardExists=${cardExists} jsErrors=${JSON.stringify(voiceJsErrors)} orbClickError=${orbClickError}`
  });

  // ─── TEST 6: Case studies Contact nav href = /#contact ────────────────────
  await page.goto(BASE + '/case-studies/', { waitUntil: 'domcontentloaded' });

  const contactHref = await page.evaluate(() => {
    const nav = document.querySelector('nav') || document.querySelector('header');
    if (!nav) return null;
    const links = Array.from(nav.querySelectorAll('a'));
    const contactLink = links.find(a => a.textContent.trim().toLowerCase() === 'contact');
    return contactLink ? contactLink.getAttribute('href') : null;
  });

  const hrefIsCorrect = contactHref === '/#contact';

  results.push({
    id: '6',
    label: 'Case studies Contact nav href = "/#contact"',
    pass: hrefIsCorrect,
    detail: `href="${contactHref}"`
  });

  // ─── TEST 7: Services page — no emoji in service cards, no "Ask Pedro" nav ─
  await page.goto(BASE + '/services.html', { waitUntil: 'domcontentloaded' });

  const servicesNavLinks = await page.evaluate(() => {
    const nav = document.querySelector('nav') || document.querySelector('header');
    if (!nav) return [];
    return Array.from(nav.querySelectorAll('a')).map(a => a.textContent.trim());
  });

  const servicesNoAskPedro = !servicesNavLinks.some(l => l.toLowerCase().includes('ask pedro'));

  // Check for emoji in service cards — look for common emoji unicode ranges
  const serviceCardText = await page.evaluate(() => {
    // Try common service card selectors
    const cards = document.querySelectorAll('.service-card, .services-grid .card, [class*="service"]');
    return Array.from(cards).map(c => c.innerHTML).join('');
  });

  // Emoji detection: check for emoji unicode characters
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
  const hasEmojiInCards = emojiRegex.test(serviceCardText);

  results.push({
    id: '7',
    label: 'Services page — no emoji icons in service cards, no "Ask Pedro" in nav',
    pass: servicesNoAskPedro && !hasEmojiInCards,
    detail: `noAskPedro=${servicesNoAskPedro} noEmojiInCards=${!hasEmojiInCards} | nav=[${servicesNavLinks.join(', ')}]`
  });

  await browser.close();

  // ─── Print results ────────────────────────────────────────────────────────
  console.log('\n=== SMOKE TEST RESULTS ===\n');
  let allPass = true;
  for (const r of results) {
    const icon = r.pass ? '✓' : '✗';
    if (!r.pass) allPass = false;
    console.log(`${icon} [${r.id}] ${r.label}`);
    if (!r.pass || process.env.VERBOSE) {
      console.log(`    Detail: ${r.detail}`);
    }
  }
  console.log('\n' + (allPass ? 'ALL TESTS PASSED' : `SOME TESTS FAILED (${results.filter(r => !r.pass).length}/${results.length})`));

  // Always print detail lines for failures
  const failures = results.filter(r => !r.pass);
  if (failures.length) {
    console.log('\n=== FAILURE DETAILS ===');
    for (const r of failures) {
      console.log(`\n[${r.id}] ${r.label}`);
      console.log(`  ${r.detail}`);
    }
  }
}

runSmokeTests().catch(console.error);
