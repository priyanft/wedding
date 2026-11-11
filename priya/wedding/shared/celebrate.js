// Shared by the invitation (index.html) and the event pages:
// themed background decorations and the "Add to calendar" link.
(() => {
  const R = (a, b) => a + Math.random() * (b - a);
  const flags = (n, cols) => Array.from({ length: n }, (_, k) =>
    `<path d="M${k * 40},0 l20,34 l20,-34 Z" fill="${cols[k % cols.length]}"/>`).join("");

  // Hanging strands: marigolds for haldi, fairy-light bulbs for sangeet
  const strands = (cls, n, lo, hi) => Array.from({ length: n }, (_, k) =>
    `<i class="${cls}" style="--x:${(k + .5) * 100 / n + R(-3, 3)}%;--h:${R(lo, hi)}%;--d:${R(3, 6)}s;--delay:-${R(0, 6)}s"></i>`).join("");

  const fallers = (cols, n) => Array.from({ length: n }, (_, k) =>
    `<i class="faller" style="--c:${cols[k % cols.length]};--x:${R(0, 100)}%;--s:${R(.6, 1.3)};--d:${R(9, 18)}s;--delay:-${R(0, 18)}s"></i>`).join("");

  const toran = () => `<svg class="toran" viewBox="0 0 800 120" preserveAspectRatio="none" aria-hidden="true">
    ${Array.from({ length: 17 }, (_, k) => {
      const x = 25 + k * 47.5, len = 60 + (k % 2) * 30;
      return `<line x1="${x}" y1="0" x2="${x}" y2="${len}" stroke="#7a3b10" stroke-width="1"/>
        ${Array.from({ length: Math.floor(len / 11) }, (_, j) =>
          `<circle cx="${x}" cy="${6 + j * 11}" r="5.5" fill="${j % 3 === 2 ? "#C8102E" : "#F39C1F"}"/>`).join("")}
        <path d="M${x - 6},${len + 4} q6,-10 12,0 l-2,8 h-8 Z" fill="#C9A35B"/>`;
    }).join("")}
    <path d="M0,4 Q400,26 800,4" stroke="#2f7a3a" stroke-width="7" fill="none" stroke-dasharray="14 6"/>
  </svg>`;

  const mandala = () => `<svg class="mandala" viewBox="-100 -100 200 200" aria-hidden="true">
    ${Array.from({ length: 16 }, (_, k) => `<g transform="rotate(${k * 22.5})">
      <path d="M0,-30 C10,-50 10,-70 0,-92 C-10,-70 -10,-50 0,-30 Z" fill="none" stroke="currentColor" stroke-width=".8"/>
      <circle cy="-60" r="3" fill="none" stroke="currentColor" stroke-width=".6"/></g>`).join("")}
    <circle r="28" fill="none" stroke="currentColor" stroke-width=".8"/>
    <circle r="96" fill="none" stroke="currentColor" stroke-width=".5" stroke-dasharray="2 4"/></svg>`;

  const diyas = n => `<div class="diyas" aria-hidden="true">${Array.from({ length: n }, (_, k) =>
    `<span class="diya" style="--k:${k}"><i class="flame"></i></span>`).join("")}</div>`;

  const decor = {
    haldi: () => `
      <div class="sunburst"></div>
      <svg class="bunting" viewBox="0 0 800 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,2 Q400,30 800,2" stroke="#d9b98a" stroke-width="2" fill="none"/>
        <g transform="translate(0,4)">${flags(20, ["#FFD86B", "#FFB3C7", "#9FE3C6", "#CDB6FF", "#FFC9A8"])}</g>
      </svg>
      <div class="strands">${strands("marigold", 11, 5, 16)}</div>
      ${fallers(["#FFD86B", "#FFB3C7", "#9FE3C6", "#CDB6FF", "#F6A623"], 18)}`,
    sangeet: () => `
      <div class="strands">${strands("bulbs", 12, 18, 55)}</div>
      <div class="beams"><i></i><i></i><i></i><i></i></div>
      <div class="discoball"></div>
      <div class="eq">${Array.from({ length: 28 }, (_, k) => `<i style="--k:${k}"></i>`).join("")}</div>`,
    wedding: () => `
      ${toran()}
      ${fallers(["#C8102E", "#E2475A", "#F39C1F", "#F0D79C"], 14)}`,
  };

  const stamp = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const gcal = (E, W) => {
    const start = new Date(E.start), end = new Date(start.getTime() + (E.hours || 3) * 36e5);
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(`${E.name} · ${W.bride} & ${W.groom}`)}` +
      `&dates=${stamp(start)}/${stamp(end)}` +
      `&location=${encodeURIComponent(`${E.place}, ${W.venue.address}`)}` +
      `&details=${encodeURIComponent(`${E.tagline}\nDress code: ${E.dress}`)}`;
  };

  window.Celebrate = { decor, mandala, diyas, gcal };
})();
