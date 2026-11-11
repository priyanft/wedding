// Themed page for one celebration. The page sets <body data-event="haldi">;
// everything else comes from config.js.
(() => {
  const W = window.WEDDING;
  const $ = (s, el = document) => el.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slug = document.body.dataset.event;
  const i = W.events.findIndex(e => e.slug === slug);
  const E = W.events[i];
  const couple = `${W.bride} & ${W.groom}`;
  document.title = `${E.name} · ${couple}`;
  document.body.classList.add("t-" + slug);

  // ── Page content ────────────────────────────────────────
  const start = new Date(E.start), end = new Date(start.getTime() + (E.hours || 3) * 36e5);
  const art = `<figure class="art art-${slug}"><img src="${E.art}" alt="${W.bride} and ${W.groom} at the ${E.name}"><span class="shine"></span></figure>`;

  const others = W.events.filter(e => e !== E);

  document.body.insertAdjacentHTML("afterbegin", `
    <div class="decor" aria-hidden="true">${Celebrate.decor[slug]()}</div>
    <canvas id="fx" aria-hidden="true"></canvas>
    <nav class="topnav">
      <a class="back" href="index.html#open">← Invitation</a>
      <div class="chips">${W.events.map(e =>
        `<a href="${e.page}" class="chip ${e === E ? "on" : ""}">${e.name}</a>`).join("")}</div>
    </nav>
    <main>
      <header class="ev-hero">
        <p class="eyebrow">${couple} invite you to the</p>
        <h1 class="ev-title">${E.name}</h1>
        <p class="tagline">${E.tagline}</p>
        <div class="stage">
          ${slug === "wedding" ? Celebrate.mandala() : ""}
          ${art}
          ${slug === "wedding" ? Celebrate.diyas(5) : ""}
        </div>
        <p class="when-pill"><span>${E.when}</span><b>·</b><span>${E.time}</span></p>
        <p class="place">${E.place}</p>
      </header>

      <section class="ev-count reveal">
        <h2>Starts in</h2>
        <div class="clock"><div><b data-u="d">0</b><span>Days</span></div><div><b data-u="h">0</b><span>Hours</span></div>
          <div><b data-u="m">0</b><span>Min</span></div><div><b data-u="s">0</b><span>Sec</span></div></div>
      </section>

      <section class="ev-about reveal"><p>${E.about}</p></section>

      <section class="ev-expect">
        <h2 class="reveal">What to expect</h2>
        <div class="cards">${E.expect.map((x, k) => `
          <article class="card reveal" style="--k:${k}"><span class="ico">${x.icon}</span>
            <h3>${x.title}</h3><p>${x.text}</p></article>`).join("")}</div>
      </section>

      <section class="ev-dress reveal">
        <h2>Dress code</h2>
        <p class="dress">${E.dress}</p>
        <div class="swatches">${E.palette.map(c => `<i style="background:${c}" title="${c}"></i>`).join("")}</div>
      </section>

      <section class="ev-actions reveal">
        <a class="btn" href="${Celebrate.gcal(E, W)}" target="_blank" rel="noopener">Add to Calendar</a>
        <a class="btn" href="${W.venue.mapsUrl}" target="_blank" rel="noopener">Directions</a>
        <a class="btn solid" href="index.html#rsvp">RSVP</a>
      </section>

      <section class="ev-next">
        <h2 class="reveal">More celebrations</h2>
        <div class="next-grid">${others.map(e => `
          <a class="next reveal t-${e.slug}-card" href="${e.page}">
            <div class="mini"><img src="${e.art}" alt="" loading="lazy"></div>
            <div><h3>${e.name}</h3><p>${e.when} · ${e.time}</p><span>Explore →</span></div>
          </a>`).join("")}</div>
      </section>

      <footer class="ev-foot"><p>${W.hashtag}</p></footer>
    </main>`);

  // ── Countdown ───────────────────────────────────────────
  const units = { d: 864e5, h: 36e5, m: 6e4, s: 1e3 }, mod = { d: Infinity, h: 24, m: 60, s: 60 };
  const tick = () => {
    const ms = start - Date.now();
    if (ms <= 0) { $(".ev-count h2").textContent = Date.now() < end ? "Happening now!" : "Thank you for celebrating with us"; $(".ev-count .clock").remove(); return true; }
    for (const u in units) $(`[data-u="${u}"]`).textContent = Math.floor(ms / units[u]) % mod[u];
  };
  if (!tick()) { const t = setInterval(() => tick() && clearInterval(t), 1000); }

  // ── Reveal on scroll ────────────────────────────────────
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // ── Particles ───────────────────────────────────────────
  if (reduce) return;
  const cv = $("#fx"), ctx = cv.getContext("2d"), dpr = Math.min(2, devicePixelRatio || 1);
  const resize = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; };
  resize(); addEventListener("resize", resize);
  const R = Math.random, few = innerWidth < 700;
  const FX = {
    haldi: { n: few ? 28 : 55, cols: ["#FFD86B", "#FFB3C7", "#9FE3C6", "#CDB6FF", "#FFC9A8", "#F6A623"],
      make: p => Object.assign(p, { shape: R() < .55 ? "rect" : R() < .5 ? "circle" : "flower", vy: .0008 + R() * .0012 }) },
    sangeet: { n: few ? 30 : 60, cols: ["#FF3D9A", "#FFC94A", "#B98CFF", "#FFFFFF", "#5BE0FF"],
      make: p => Object.assign(p, { shape: R() < .35 ? "note" : "spark", vy: -(.0005 + R() * .0009), glyph: "♪♫♬♩"[Math.floor(R() * 4)] }) },
    wedding: { n: few ? 18 : 34, cols: ["#C8102E", "#E2475A", "#F39C1F", "#F0D79C"],
      make: p => Object.assign(p, { shape: "petal", vy: .0006 + R() * .0009 }) },
  }[slug];
  const ps = Array.from({ length: FX.n }, () => FX.make({
    x: R(), y: R(), r: 3 + R() * 6, a: R() * 6.28, va: (R() - .5) * .05, s: R() * 6.28,
    c: FX.cols[Math.floor(R() * FX.cols.length)],
  }));
  const flower = (r, c) => {
    ctx.fillStyle = c;
    for (let k = 0; k < 5; k++) { ctx.rotate(1.2566); ctx.beginPath(); ctx.ellipse(0, -r * .8, r * .5, r * .8, 0, 0, 6.28); ctx.fill(); }
    ctx.fillStyle = "#FFF3B0"; ctx.beginPath(); ctx.arc(0, 0, r * .4, 0, 6.28); ctx.fill();
  };
  (function frame(t) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of ps) {
      p.y += p.vy; p.a += p.va;
      if (p.y > 1.05) { p.y = -.05; p.x = R(); }
      if (p.y < -.05) { p.y = 1.05; p.x = R(); }
      const x = (p.x + Math.sin(t / 1700 + p.s) * .025) * cv.width, y = p.y * cv.height, r = p.r * dpr;
      ctx.save(); ctx.translate(x, y); ctx.rotate(p.a); ctx.fillStyle = p.c;
      if (p.shape === "rect") { ctx.globalAlpha = .85; ctx.fillRect(-r, -r * .45, r * 2, r * .9); }
      else if (p.shape === "circle") { ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(0, 0, r * .7, 0, 6.28); ctx.fill(); }
      else if (p.shape === "flower") { ctx.globalAlpha = .9; flower(r, p.c); }
      else if (p.shape === "petal") { ctx.globalAlpha = .7; ctx.beginPath(); ctx.ellipse(0, 0, r, r * .55, 0, 0, 6.28); ctx.fill(); }
      else if (p.shape === "note") { ctx.rotate(-p.a); ctx.globalAlpha = .55 + .35 * Math.sin(t / 500 + p.s); ctx.font = `${r * 3.2}px serif`; ctx.fillText(p.glyph, 0, 0); }
      else { // twinkling 4-point sparkle
        ctx.globalAlpha = Math.max(0, Math.sin(t / 380 + p.s)); ctx.beginPath();
        for (let k = 0; k < 8; k++) { const rr = k % 2 ? r * .25 : r * 1.1, an = k * .785; ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); }
        ctx.fill();
      }
      ctx.restore();
    }
    requestAnimationFrame(frame);
  })(0);
})();
