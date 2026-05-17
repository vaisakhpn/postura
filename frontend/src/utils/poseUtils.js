export const kpToPixel = (kp, w, h) =>
  kp && kp.x <= 1 && kp.y <= 1
    ? { x: kp.x * w, y: kp.y * h, score: kp.score ?? 0 }
    : kp;

export const calcAngle = (A, B, C) => {
  if (!A || !B || !C) return null;
  const AB = { x: A.x - B.x, y: A.y - B.y };
  const CB = { x: C.x - B.x, y: C.y - B.y };
  const dot = AB.x * CB.x + AB.y * CB.y;
  const magAB = Math.hypot(AB.x, AB.y);
  const magCB = Math.hypot(CB.x, CB.y);
  if (magAB === 0 || magCB === 0) return null;
  const cosTheta = Math.min(1, Math.max(-1, dot / (magAB * magCB)));
  return (Math.acos(cosTheta) * 180) / Math.PI;
};

export const drawLine = (ctx, p1, p2, w, color = "green", lineWidth = 3) => {
  if (!p1 || !p2) return;
  ctx.beginPath();
  ctx.moveTo(w - p1.x, p1.y);
  ctx.lineTo(w - p2.x, p2.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
};

export const drawKeypoints = (ctx, points, relevantKeypoints, w, color = "lime", radius = 4) => {
  ctx.fillStyle = color;
  Object.entries(points).forEach(([name, p]) => {
    if (relevantKeypoints.includes(name)) {
      ctx.beginPath();
      ctx.arc(w - p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

export const speak = (text, lastSpokenTimeRef) => {
  const now = Date.now();
  if (now - lastSpokenTimeRef.current > 3000) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
    lastSpokenTimeRef.current = now;
  }
};
