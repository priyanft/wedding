(() => {
  const W = window.WEDDING;
  const $ = (s, el = document) => el.querySelector(s);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.registerPlugin(ScrollTrigger);

  // ── Fill content from config ─────────────────────────────
  document.title = `${W.bride} & ${W.groom} · Wedding Invitation`;
  document.querySelectorAll("[data-k]").forEach(el => (el.textContent = W[el.dataset.k] || ""));
  document.querySelectorAll("[data-monogram]").forEach(el => (el.textContent = W.bride[0] + W.groom[0]));

  // Images fall back to a placeholder until real photos are added
  const img = (src, alt = "") => {
    const i = new Image();
    i.alt = alt;
    i.onerror = () => { i.onerror = null; i.src = placeholderPhoto(src.split("/").pop()); };
    i.src = src;
    return i;
  };
  const heroImg = $(".hero-bg img");
  heroImg.replaceWith(img(W.photos.hero, `${W.bride} and ${W.groom}`));
  // Framed portrait for wide screens (CSS hides it on phones)
  const portrait = document.createElement("figure");
  portrait.className = "hero-portrait";
  portrait.append(img(W.photos.hero, ""));
  $("#hero .bars").before(portrait);

  const storyList = $(".story-list");
  W.story.forEach(s => {
    const item = document.createElement("article");
    item.className = "story-item";
    item.innerHTML = `<div class="story-photo"></div>
      <div><p class="story-when">${s.when}</p><h3>${s.title}</h3><p>${s.text}</p></div>`;
    $(".story-photo", item).append(img(s.photo, s.title));
    storyList.append(item);
  });

  const track = $(".gallery-track");
  W.photos.gallery.forEach(src => {
    const f = document.createElement("figure");
    f.append(img(src));
    track.append(f);
  });

  // ── Wedding weekend timeline ─────────────────────────────
  const days = [...new Set(W.events.map(e => e.when))];
  const dayName = e => ["Day One", "Day Two", "Day Three"][days.indexOf(e.when)] || e.when;
  const partOfDay = e => { const h = +new Date(e.start).toLocaleString("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" });
    return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"; };
  $(".tl-stops").innerHTML = W.events.map(e => `
    <a class="tl-stop tl-${e.slug}" href="#cele-${e.slug}">
      <span class="tl-thumb"><img src="${e.art}" alt="" loading="lazy"></span>
      <b>${e.name}</b><small>${dayName(e)} · ${e.time}</small>
    </a>`).join("");

  // ── One chapter per celebration ─────────────────────────
  const split = t => [...t].map((c, i) => `<span class="l" style="--i:${i}">${c === " " ? "&nbsp;" : c}</span>`).join("");
  $("#celebrations").innerHTML = W.events.map((e, k) => `
    <section class="cele cele-${e.slug}" id="cele-${e.slug}">
      <div class="cele-bg" aria-hidden="true">${Celebrate.decor[e.slug]()}</div>
      <div class="cele-inner ${k % 2 ? "flip" : ""}">
        <div class="cele-visual">
          ${e.slug === "wedding" ? Celebrate.mandala() : ""}
          <div class="tilt">
            <figure class="art art-${e.slug}"><img src="${e.art}" alt="${W.bride} and ${W.groom} at the ${e.name}" loading="lazy"><span class="shine"></span></figure>
          </div>
          ${e.slug === "wedding" ? Celebrate.diyas(5) : ""}
        </div>
        <div class="cele-text">
          <p class="cele-num">Chapter 0${k + 1} · ${dayName(e)} · ${partOfDay(e)}</p>
          <h3 class="cele-title" aria-label="${e.name}">${e.slug === "wedding" ? `<span class="l">${e.name}</span>` /* joined script must stay whole */ : split(e.name)}</h3>
          <p class="cele-tag">${e.tagline}</p>
          <div class="cele-meta"><span>📅 ${e.when}</span><span>⏰ ${e.time}</span><span>📍 ${e.place}</span></div>
          <p class="cele-about">${e.about}</p>
          <ul class="cele-expect">${e.expect.map(x =>
            `<li><span class="ico">${x.icon}</span><div><strong>${x.title}</strong><span>${x.text}</span></div></li>`).join("")}</ul>
          <div class="cele-dress"><span>Dress code</span><p>${e.dress}</p>
            <div class="swatches">${e.palette.map(c => `<i style="background:${c}"></i>`).join("")}</div></div>
          <div class="cele-actions">
            <a class="btn solid" href="${e.page}">Explore the ${e.name} →</a>
            <a class="btn" href="${Celebrate.gcal(e, W)}" target="_blank" rel="noopener">Add to Calendar</a>
          </div>
        </div>
      </div>
    </section>`).join("");

  // Side dots showing which celebration you're in
  const dots = document.createElement("nav");
  dots.className = "cele-dots"; dots.setAttribute("aria-label", "Celebrations");
  dots.innerHTML = W.events.map(e => `<a href="#cele-${e.slug}" data-s="${e.slug}"><span>${e.name}</span></a>`).join("");
  document.body.append(dots);

  // ── Good to know ────────────────────────────────────────
  $(".faq").innerHTML = (W.faq || []).map(f =>
    `<details><summary>${f.q}<i aria-hidden="true"></i></summary><p>${f.a}</p></details>`).join("");
  if (!(W.faq || []).length) $("#know").remove();

  // ── Share hashtag ───────────────────────────────────────
  $(".share-tag").addEventListener("click", e => {
    const small = $("small", e.currentTarget);
    navigator.clipboard?.writeText(W.hashtag).then(() => {
      small.textContent = "Copied ✓";
      setTimeout(() => (small.textContent = "Tap to copy"), 1800);
    });
  });

  $(".venue-name").textContent = W.venue.name;
  $(".venue-addr").textContent = W.venue.address;
  $("#venue iframe").src = W.venue.mapEmbed;
  $("#directions").href = W.venue.mapsUrl;
  $(".rsvp-note").textContent = `Kindly respond by ${W.rsvp.deadline}`;

  // ── RSVP → WhatsApp (no server needed) ──────────────────
  $("#rsvp-form").addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const msg = `RSVP for ${W.bride} & ${W.groom}'s wedding\n` +
      `Name: ${d.name}\nResponse: ${d.coming}\nGuests: ${d.guests}` +
      (d.note ? `\nWish: ${d.note}` : "");
    window.open(`https://wa.me/${W.rsvp.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  // ── Countdown ───────────────────────────────────────────
  const target = new Date(W.date).getTime();
  const tick = () => {
    const ms = Math.max(0, target - Date.now());
    $("#cd-d").textContent = Math.floor(ms / 864e5);
    $("#cd-h").textContent = Math.floor(ms / 36e5) % 24;
    $("#cd-m").textContent = Math.floor(ms / 6e4) % 60;
    $("#cd-s").textContent = Math.floor(ms / 1e3) % 60;
  };
  tick(); setInterval(tick, 1000);

  // ── Music ───────────────────────────────────────────────
  const audio = $("#audio"), musicBtn = $("#music");
  audio.src = W.music;
  audio.addEventListener("canplay", () => (musicBtn.hidden = false), { once: true });
  musicBtn.onclick = () => {
    audio.paused ? audio.play() : audio.pause();
    musicBtn.classList.toggle("off", audio.paused);
  };

  // ── Opening sequence ────────────────────────────────────
  const heroIntro = () => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(".hero-bg img", { scale: 1.05, duration: 9, ease: "power1.out" }, 0)
      .from(".bars i:first-child", { yPercent: -100, duration: 1.2 }, 0)
      .from(".bars i:last-child", { yPercent: 100, duration: 1.2 }, 0)
      .from(".hero-portrait", { opacity: 0, y: 40, duration: 1.8 }, 0.4)
      .from(".eyebrow", { opacity: 0, y: 20, duration: 1.2 }, 0.6)
      .from(".names span, .names em", { opacity: 0, y: 40, filter: "blur(12px)", stagger: 0.35, duration: 1.6 }, 1)
      .from(".sub, .date, .city", { opacity: 0, y: 20, stagger: 0.25, duration: 1 }, 2.4)
      .from(".scroll-hint", { opacity: 0, duration: 1 }, 3.4);
    // Slow drift on the hero photo while the page is scrolled
    gsap.to("#hero .hero-text", { yPercent: 40, opacity: 0, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
  };

  $("#open").addEventListener("click", () => {
    audio.play().then(() => (musicBtn.hidden = false)).catch(() => {});
    const tl = gsap.timeline({ onComplete: () => { $("#gate").remove(); document.body.classList.remove("locked"); } });
    tl.to(".gate-center", { opacity: 0, scale: 0.9, duration: 0.6 })
      .to(".door.left", { xPercent: -100, duration: 1.8, ease: "power3.inOut" }, 0.3)
      .to(".door.right", { xPercent: 100, duration: 1.8, ease: "power3.inOut" }, 0.3)
      .add(heroIntro, 0.9);
  });

  if (location.hash === "#open") $("#open").click();   // skip the gate (handy while editing)

  // ── Scroll animations ───────────────────────────────────
  if (!reduce) {
    document.querySelectorAll(".story-item").forEach(item => {
      const photo = $(".story-photo", item);
      gsap.to(photo, { clipPath: "inset(0 0 0% 0)", duration: 1.6, ease: "power3.inOut",
        scrollTrigger: { trigger: item, start: "top 75%" } });
      gsap.fromTo($("img", photo), { yPercent: -10 }, { yPercent: 0, ease: "none",
        scrollTrigger: { trigger: item, scrub: true } });
      gsap.from(item.children[1], { opacity: 0, y: 40, duration: 1.2,
        scrollTrigger: { trigger: item, start: "top 70%" } });
    });

    // Horizontal pinned gallery
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, { x: () => -dist(), ease: "none",
      scrollTrigger: { trigger: "#gallery", pin: true, scrub: 1, end: () => "+=" + dist(), invalidateOnRefresh: true } });
    track.querySelectorAll("img").forEach(i => gsap.to(i, { scale: 1, ease: "none",
      scrollTrigger: { trigger: "#gallery", scrub: true, start: "top top", end: () => "+=" + dist() } }));

    // Timeline line draws with scroll, stops pop in
    gsap.from(".tl-line i", { scaleX: 0, ease: "none",
      scrollTrigger: { trigger: ".timeline", start: "top 85%", end: "bottom 55%", scrub: true } });
    gsap.from(".tl-stop", { opacity: 0, y: 50, scale: .7, stagger: .2, duration: 1, ease: "back.out(1.8)",
      scrollTrigger: { trigger: ".timeline", start: "top 78%" } });

    // Celebration chapters
    document.querySelectorAll(".cele").forEach((sec, k) => {
      const q = s => sec.querySelectorAll(s);
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: "top 62%" } });
      tl.from($(".art", sec), { opacity: 0, y: 90, rotate: k % 2 ? 5 : -5, scale: .85, duration: 1.4, ease: "power4.out" })
        .from($(".art img", sec), { scale: 1.35, duration: 2, ease: "power3.out" }, 0)
        .from(q(".cele-title .l"), { opacity: 0, yPercent: 110, rotateX: -90, stagger: .07, duration: .9, ease: "back.out(2.2)" }, .25)
        .from(q(".cele-num, .cele-tag, .cele-meta span, .cele-about, .cele-expect li, .cele-dress, .cele-actions"),
          { opacity: 0, y: 30, stagger: .07, duration: .7, ease: "power2.out" }, .45)
        .from(q(".swatches i"), { scale: 0, stagger: .06, duration: .5, ease: "back.out(3)" }, 1.1)
        .from(q(".diya"), { opacity: 0, y: 20, stagger: .1, duration: .6 }, .8);
      // depth: visual and background drift at different speeds
      gsap.fromTo($(".cele-visual", sec), { y: 60 }, { y: -60, ease: "none",
        scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo($(".cele-bg", sec), { yPercent: -6 }, { yPercent: 6, ease: "none",
        scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
      ScrollTrigger.create({ trigger: sec, start: "top 50%", end: "bottom 50%",
        onToggle: st => dots.querySelector(`[data-s="${sec.id.slice(5)}"]`).classList.toggle("on", st.isActive) });
    });
    ScrollTrigger.create({ trigger: "#celebrations", start: "top 60%", end: "bottom 40%",
      onToggle: st => dots.classList.toggle("show", st.isActive) });

    // 3D tilt on the illustrations (mouse only)
    if (matchMedia("(hover: hover)").matches) document.querySelectorAll(".tilt").forEach(t => {
      t.addEventListener("mousemove", e => {
        const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        gsap.to(t, { rotateY: x * 14, rotateX: -y * 14, duration: .6, ease: "power2.out" });
      });
      t.addEventListener("mouseleave", () => gsap.to(t, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1, .5)" }));
    });

    gsap.utils.toArray("#countdown h2, #story h2, #weekend h2, .section-sub, #venue h2, #know h2, #rsvp h2, .clock div, .map, .faq details, #rsvp-form > *, #share > *").forEach(el =>
      gsap.from(el, { opacity: 0, y: 30, duration: 1, scrollTrigger: { trigger: el, start: "top 88%" } }));
    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    gsap.set(".story-photo", { clipPath: "none" });
  }

  // ── Falling petals ──────────────────────────────────────
  if (reduce) return;
  const cv = $("#petals"), ctx = cv.getContext("2d");
  const resize = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; };
  resize(); addEventListener("resize", resize);
  const petals = Array.from({ length: innerWidth < 700 ? 14 : 26 }, () => ({
    x: Math.random(), y: Math.random(), r: 4 + Math.random() * 6,
    v: 0.0006 + Math.random() * 0.001, s: Math.random() * 6, a: Math.random() * Math.PI,
  }));
  (function frame(t) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of petals) {
      p.y += p.v; p.a += 0.01;
      if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
      const x = (p.x + Math.sin(t / 1600 + p.s) * 0.03) * cv.width, y = p.y * cv.height;
      ctx.save(); ctx.translate(x, y); ctx.rotate(p.a);
      ctx.fillStyle = "rgba(214,120,130,.55)";
      ctx.beginPath(); ctx.ellipse(0, 0, p.r * devicePixelRatio, p.r * 0.55 * devicePixelRatio, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(frame);
  })(0);
})();
