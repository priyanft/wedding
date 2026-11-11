(async () => {
  const W = window.WEDDING;
  const cv = document.getElementById("cv");
  const main = cv.getContext("2d");
  const off = document.createElement("canvas");       // layer for the incoming scene during crossfades
  const offCtx = off.getContext("2d");
  let ctx = main;                                      // helpers draw to whichever context is active
  const $ = id => document.getElementById(id);
  const root = p => "../" + p;
  const GOLD = ["#b8893f", "#f6e2a8", "#c9a35b"];
  const XF = 0.9; // crossfade seconds between scenes

  // ── Helpers ─────────────────────────────────────────────
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const ramp = (t, a, b) => ease(clamp((t - a) / (b - a)));          // 0→1 between a and b
  const inOut = (t, a, b, f = 0.7) => ramp(t, a, a + f) * (1 - ramp(t, b - f, b));

  const loadMedia = src => new Promise(res => {
    const i = new Image();
    i.onload = () => res(i);
    const fallback = () => { i.onerror = null; i.src = placeholderPhoto(src.split("/").pop(), 1080, 1920); };
    if (/\.(mp4|webm|mov)$/i.test(src)) {
      const v = document.createElement("video");
      Object.assign(v, { muted: true, loop: true, playsInline: true, preload: "auto" });
      v.oncanplay = () => { v.oncanplay = null; res(v); };
      v.onerror = fallback;
      v.src = root(src);
      return;
    }
    i.onerror = fallback;
    i.src = root(src);
  });

  // Draw media to fill the frame with a slow Ken Burns move
  const cover = (m, zoom, px, py, alpha = 1) => {
    const mw = m.videoWidth || m.naturalWidth, mh = m.videoHeight || m.naturalHeight;
    if (!mw) return;
    const s = Math.max(cv.width / mw, cv.height / mh) * zoom;
    const dw = mw * s, dh = mh * s;
    ctx.globalAlpha = alpha;
    ctx.drawImage(m, (cv.width - dw) / 2 + px * (dw - cv.width) / 2, (cv.height - dh) / 2 + py * (dh - cv.height) / 2, dw, dh);
    ctx.globalAlpha = 1;
  };

  const syncVideo = (m, local) => {
    if (m.tagName !== "VIDEO") return;
    if (m.paused && playing) m.play().catch(() => {});
    if (Math.abs(m.currentTime - (local % (m.duration || 1e9))) > 0.35) m.currentTime = local % (m.duration || 1e9);
  };

  const U = () => Math.min(cv.width, cv.height) / 1080;   // layout unit
  const text = (str, y, { size = 60, font = "serif", alpha = 1, gold = false, spacing = 0, blur = 0, rise = 0 } = {}) => {
    if (alpha <= 0 || !str) return;
    const fam = { serif: "'Cormorant Garamond'", script: "'Great Vibes'", sans: "'Montserrat'" }[font];
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `${font === "sans" ? 500 : 400} ${size * U()}px ${fam}`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing * U()}px`;
    if (blur) ctx.filter = `blur(${blur * U()}px)`;
    ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 24 * U();
    if (gold) {
      const w = ctx.measureText(str).width;
      const g = ctx.createLinearGradient(cv.width / 2 - w / 2, 0, cv.width / 2 + w / 2, 0);
      g.addColorStop(0, GOLD[0]); g.addColorStop(0.5, GOLD[1]); g.addColorStop(1, GOLD[2]);
      ctx.fillStyle = g;
    } else ctx.fillStyle = "#f7efe4";
    ctx.fillText(str, cv.width / 2, y * cv.height + (1 - alpha) * rise * U());
    ctx.restore();
  };

  const shade = (a = 0.45) => {
    const g = ctx.createRadialGradient(cv.width / 2, cv.height / 2, 0, cv.width / 2, cv.height / 2, Math.hypot(cv.width, cv.height) / 2);
    g.addColorStop(0, `rgba(0,0,0,${a * 0.3})`); g.addColorStop(1, `rgba(0,0,0,${a + 0.3})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
  };

  const edges = a => {              // dark gradient at top and bottom so text reads over photos
    const g = ctx.createLinearGradient(0, 0, 0, cv.height);
    g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(0.4, "rgba(0,0,0,0)");
    g.addColorStop(0.7, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${a})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
  };

  const bars = k => {               // cinematic letterbox bars, k = 0..1
    const h = cv.height * 0.07 * k;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cv.width, h); ctx.fillRect(0, cv.height - h, cv.width, h);
  };

  const dust = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 2.5 + 0.5, s: Math.random() * 0.02 + 0.005, p: Math.random() * 6 }));
  const goldDust = (t, a = 1) => {
    ctx.save();
    for (const d of dust) {
      const y = (d.y - t * d.s + 1) % 1;
      ctx.globalAlpha = a * (0.4 + 0.6 * Math.sin(t * 2 + d.p) ** 2);
      ctx.fillStyle = GOLD[1];
      ctx.beginPath(); ctx.arc((d.x + Math.sin(t * 0.4 + d.p) * 0.02) * cv.width, y * cv.height, d.r * U() * 1.6, 0, 7); ctx.fill();
    }
    ctx.restore();
  };

  // Film grain: a small noise tile, re-offset every frame
  const grain = document.createElement("canvas");
  grain.width = grain.height = 256;
  const gctx = grain.getContext("2d"), gd = gctx.createImageData(256, 256);
  for (let i = 0; i < gd.data.length; i += 4) { const v = Math.random() * 255; gd.data.set([v, v, v, 255], i); }
  gctx.putImageData(gd, 0, 0);
  const grainFx = () => {
    ctx.save();
    ctx.globalAlpha = 0.06; ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = ctx.createPattern(grain, "repeat");
    ctx.translate(Math.random() * 256, Math.random() * 256);
    ctx.fillRect(-256, -256, cv.width + 512, cv.height + 512);
    ctx.restore();
  };

  // ── Load assets ─────────────────────────────────────────
  $("status").textContent = "Loading photos & fonts…";
  await Promise.all(["400 40px 'Great Vibes'", "400 40px 'Cormorant Garamond'", "italic 400 40px 'Cormorant Garamond'", "500 40px 'Montserrat'"].map(f => document.fonts.load(f)));
  const shots = await Promise.all(W.video.shots.map(s => loadMedia(s.src)));
  const music = new Audio(root(W.music));
  music.crossOrigin = "anonymous";
  let hasMusic = await new Promise(r => { music.oncanplaythrough = () => r(true); music.onerror = () => r(false); });
  $("status").textContent = hasMusic ? "Ready." : "Ready (no music/theme.mp3 found, so the video will be silent).";

  // ── Scenes ──────────────────────────────────────────────
  const S = [];
  S.push({ d: 4.5, draw(t) {                                   // 1 · opening
    ctx.fillStyle = "#070505"; ctx.fillRect(0, 0, cv.width, cv.height);
    goldDust(t, ramp(t, 0, 1.5));
    text(W.intro.toUpperCase(), 0.47, { font: "sans", size: 26, spacing: 10, alpha: inOut(t, 0.6, 4.5, 1), gold: true });
    text(W.bride[0] + " ♥ " + W.groom[0], 0.54, { font: "script", size: 90, alpha: inOut(t, 1.4, 4.5, 1), gold: true, rise: 30 });
  }});

  S.push({ d: 7, draw(t) {                                     // 2 · names over hero shot
    const m = shots[0]; syncVideo(m, t);
    cover(m, 1.22 - 0.16 * ramp(t, 0, 7), 0, -0.2 + 0.2 * t / 7);
    shade(0.35); edges(0.65); bars(ramp(t, 0, 1.2));
    const k = (a) => ramp(t, a, a + 1.4);
    // names sit in the upper third so the couple's faces stay visible
    text(W.bride, 0.17, { font: "script", size: 170, gold: true, alpha: k(0.8), blur: 14 * (1 - k(0.8)), rise: 40 });
    text("&", 0.235, { font: "script", size: 90, gold: true, alpha: k(1.5) });
    text(W.groom, 0.30, { font: "script", size: 170, gold: true, alpha: k(2.1), blur: 14 * (1 - k(2.1)), rise: 40 });
    text("ARE GETTING MARRIED", 0.87, { font: "sans", size: 26, spacing: 12, alpha: k(3.4) });
  }});

  W.video.shots.slice(1).forEach((s, i) => {                   // 3 · story shots
    const dir = i % 2 ? 1 : -1;
    S.push({ d: 3.8, draw(t) {
      const m = shots[i + 1]; syncVideo(m, t);
      cover(m, 1.08 + 0.1 * t / 3.8, dir * (0.5 - t / 3.8), 0);
      shade(0.35); bars(1);
      text(s.line, 0.8, { font: "serif", size: 72, alpha: inOut(t, 0.6, 3.6), rise: 30 });
    }});
  });

  const last = shots[shots.length - 1];
  S.push({ d: 5, draw(t) {                                     // 4 · date & city
    ctx.save(); ctx.filter = `blur(${8 * U()}px) brightness(.5)`; cover(last, 1.25, 0, 0); ctx.restore();
    shade(0.4); bars(1); goldDust(t, 0.6);
    text("SAVE THE DATE", 0.36, { font: "sans", size: 28, spacing: 14, alpha: ramp(t, 0.3, 1.2), gold: true });
    text(W.dateText.split("·")[0].trim(), 0.44, { font: "serif", size: 56, alpha: ramp(t, 0.8, 1.8) });
    text((W.dateText.split("·")[1] || "").trim(), 0.52, { font: "serif", size: 96, gold: true, alpha: ramp(t, 1.2, 2.3), rise: 30 });
    text(W.city, 0.61, { font: "serif", size: 46, alpha: ramp(t, 1.8, 2.8) });
  }});

  S.push({ d: 1.4 + W.events.length * 0.9 + 2.5, draw(t) {     // 5 · events list
    ctx.save(); ctx.filter = `blur(${10 * U()}px) brightness(.4)`; cover(shots[0], 1.3, 0, 0); ctx.restore();
    shade(0.4); bars(1);
    text("The Celebrations", 0.2, { font: "script", size: 110, gold: true, alpha: ramp(t, 0.2, 1.2) });
    const n = W.events.length, gap = Math.min(0.12, 0.6 / n);
    W.events.forEach((e, i) => {
      const a = ramp(t, 1 + i * 0.9, 2 + i * 0.9), y = 0.33 + i * gap;
      text(e.name, y, { font: "script", size: 74, gold: true, alpha: a, rise: 30 });
      text(`${e.when}  ·  ${e.time}`, y + gap * 0.42, { font: "sans", size: 22, spacing: 4, alpha: a });
    });
  }});

  S.push({ d: 5.5, draw(t) {                                   // 6 · closing
    ctx.fillStyle = "#070505"; ctx.fillRect(0, 0, cv.width, cv.height);
    goldDust(t);
    const out = 1 - ramp(t, 4.4, 5.5);
    text("We can't wait to celebrate with you", 0.42, { font: "serif", size: 54, alpha: ramp(t, 0.3, 1.3) * out });
    text(W.hashtag, 0.5, { font: "script", size: 100, gold: true, alpha: ramp(t, 1, 2) * out, rise: 30 });
    text(W.website.toUpperCase(), 0.58, { font: "sans", size: 24, spacing: 8, alpha: ramp(t, 1.8, 2.8) * out });
  }});

  let acc = 0;
  S.forEach(s => { s.start = acc; acc += s.d - XF; });
  const TOTAL = acc + XF;

  // ── Render a single frame at time t ─────────────────────
  const render = t => {
    let i = S.findIndex(s => t < s.start + s.d - XF);
    if (i < 0) i = S.length - 1;
    const cur = S[i], local = t - cur.start;
    if (i > 0 && local < XF) {
      S[i - 1].draw(t - S[i - 1].start);
      // Draw the incoming scene offscreen, then fade the whole layer in
      ctx = offCtx; ctx.clearRect(0, 0, off.width, off.height); cur.draw(local); ctx = main;
      ctx.globalAlpha = ease(local / XF); ctx.drawImage(off, 0, 0); ctx.globalAlpha = 1;
    } else cur.draw(local);
    grainFx();
    $("time").textContent = `${t.toFixed(1)}s / ${TOTAL.toFixed(1)}s`;
  };

  // ── Playback & export ──────────────────────────────────
  var playing = false, t0 = 0, raf;
  const setSize = () => {
    const [w, h] = $("format").value.split("x").map(Number);
    cv.width = off.width = w; cv.height = off.height = h;
    const jump = +new URLSearchParams(location.search).get("t") || 0;   // e.g. ?t=12 to inspect a frame
    $("scrub").value = (jump / TOTAL) * 1000;
    render(jump);
  };

  const play = (from = 0, onEnd) => {
    playing = true; t0 = performance.now() - from * 1000;
    if (hasMusic) { music.currentTime = from; music.volume = 1; music.play().catch(() => {}); }
    const loop = () => {
      const t = (performance.now() - t0) / 1000;
      if (hasMusic && t > TOTAL - 2) music.volume = clamp((TOTAL - t) / 2);
      if (t >= TOTAL) { stop(); render(TOTAL - 0.001); onEnd && onEnd(); return; }
      render(t); $("scrub").value = (t / TOTAL) * 1000;
      raf = requestAnimationFrame(loop);
    };
    loop();
    $("play").textContent = "■ Stop";
  };
  const stop = () => {
    playing = false; cancelAnimationFrame(raf); music.pause();
    shots.forEach(m => m.tagName === "VIDEO" && m.pause());
    $("play").textContent = "▶ Preview";
  };

  $("play").onclick = () => (playing ? stop() : play((+$("scrub").value / 1000) * TOTAL % TOTAL));
  $("scrub").oninput = e => { stop(); render((e.target.value / 1000) * TOTAL); };
  $("format").onchange = setSize;

  let audioCtx, audioDest;
  $("export").onclick = () => {
    stop();
    const stream = cv.captureStream(30);
    if (hasMusic) {
      if (!audioCtx) {
        audioCtx = new AudioContext();
        const src = audioCtx.createMediaElementSource(music);
        audioDest = audioCtx.createMediaStreamDestination();
        src.connect(audioDest); src.connect(audioCtx.destination);
      }
      audioCtx.resume();
      audioDest.stream.getAudioTracks().forEach(tr => stream.addTrack(tr));
    }
    const type = ["video/mp4;codecs=avc1.640028,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"]
      .find(m => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 16e6 });
    const chunks = [];
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunks, { type });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${W.bride}-${W.groom}-invite.${type.includes("mp4") ? "mp4" : "webm"}`.toLowerCase();
      a.click();
      $("status").textContent = `Done: ${(blob.size / 1e6).toFixed(1)} MB saved.`;
      $("export").disabled = false;
    };
    $("export").disabled = true;
    $("status").textContent = "Recording… keep this tab visible.";
    rec.start(250);
    play(0, () => setTimeout(() => rec.stop(), 300));
  };

  setSize();
})();
