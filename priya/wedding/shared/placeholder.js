// Draws a warm gradient stand-in when a photo file is missing,
// so the site and video still look right before real photos are added.
window.placeholderPhoto = function (label, w = 1080, h = 1440) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  const hue = [12, 28, 340, 20, 45, 355][label.length % 6];
  const g = x.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, `hsl(${hue} 45% 32%)`);
  g.addColorStop(1, `hsl(${hue + 25} 35% 12%)`);
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  const r = x.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.8);
  r.addColorStop(0, "rgba(255,220,170,.35)"); r.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = r; x.fillRect(0, 0, w, h);
  x.fillStyle = "rgba(255,240,220,.55)";
  x.font = `${Math.round(w / 22)}px sans-serif`;
  x.textAlign = "center";
  x.fillText("add " + label, w / 2, h - w / 10);
  return c.toDataURL("image/jpeg", 0.85);
};
