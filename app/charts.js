// Small SVG charts, drawn from the site's own data. No library, no network:
// every chart is an inline <svg> built from numbers in data.js.

const NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs, children = '') {
  const a = Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');
  return `<${tag} ${a}>${children}</${tag}>`;
}

function niceTicks(max, count = 4) {
  const step = max / count;
  const mag = 10 ** Math.floor(Math.log10(step));
  const norm = step / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  const s = nice * mag;
  const ticks = [];
  for (let v = 0; v <= max + 1e-9; v += s) ticks.push(Math.round(v / s) * s);
  return ticks;
}

function formatNum(v, decimals = 1) {
  return Number(v).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// A vertical bar chart. `points` is [{x: '2015', y: 11.28}, ...].
// `highlight` marks one year with the accent colour; the rest use ink.
export function barChart(points, { width = 640, height = 300, unit = '', highlight = null, decimals = 1 } = {}) {
  const padL = 52;
  const padB = 30;
  const padT = 12;
  const padR = 8;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const max = Math.max(...points.map((p) => p.y)) * 1.08;
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1] || max;
  const bw = plotW / points.length;
  const barW = Math.min(34, bw * 0.62);

  let inner = '';
  for (const t of ticks) {
    const y = padT + plotH - (t / top) * plotH;
    inner += svgEl('line', { x1: padL, y1: y, x2: width - padR, y2: y, stroke: '#e3dccf', 'stroke-width': 1 });
    inner += svgEl('text', { x: padL - 8, y: y + 4, 'text-anchor': 'end', class: 'axis' }, String(t));
  }
  points.forEach((p, i) => {
    const h = (p.y / top) * plotH;
    const x = padL + i * bw + (bw - barW) / 2;
    const y = padT + plotH - h;
    const fill = p.x === highlight ? '#b3271e' : '#1c2b3a';
    inner += svgEl('rect', { x: x.toFixed(1), y: y.toFixed(1), width: barW.toFixed(1), height: h.toFixed(1), rx: 2, fill });
    inner += svgEl('text', { x: (x + barW / 2).toFixed(1), y: height - 10, 'text-anchor': 'middle', class: 'axis' }, p.x);
    if (p.y === Math.max(...points.map((q) => q.y))) {
      inner += svgEl(
        'text',
        { x: (x + barW / 2).toFixed(1), y: (y - 6).toFixed(1), 'text-anchor': 'middle', class: 'peak' },
        formatNum(p.y, decimals),
      );
    }
  });
  if (unit) {
    inner += svgEl('text', { x: padL, y: 12, class: 'unit' }, unit);
  }
  return svgEl(
    'svg',
    { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `Bar chart, ${unit}`.trim(), xmlns: NS, class: 'chart' },
    inner,
  );
}

// A line chart with dots. `points` is [{x: '2015', y: 6.98}, ...].
export function lineChart(points, { width = 640, height = 300, unit = '', highlight = null, decimals = 1, zero = false } = {}) {
  const padL = 52;
  const padB = 30;
  const padT = 16;
  const padR = 14;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const ys = points.filter((p) => p.y !== null && p.y !== undefined).map((p) => p.y);
  const lo = zero ? 0 : Math.min(...ys) * 0.92;
  const hi = Math.max(...ys) * 1.06;
  const span = hi - lo || 1;
  const ticks = niceTicks(hi - lo);
  const xAt = (i) => padL + (i / (points.length - 1)) * plotW;
  const yAt = (v) => padT + plotH - ((v - lo) / span) * plotH;

  let inner = '';
  for (const t of ticks) {
    const v = lo + t;
    if (v > hi) continue;
    const y = yAt(v);
    inner += svgEl('line', { x1: padL, y1: y, x2: width - padR, y2: y, stroke: '#e3dccf', 'stroke-width': 1 });
    inner += svgEl('text', { x: padL - 8, y: y + 4, 'text-anchor': 'end', class: 'axis' }, formatNum(v, decimals));
  }
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(p.y).toFixed(1)}`)
    .join(' ');
  inner += svgEl('path', { d: path, fill: 'none', stroke: '#b3271e', 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
  points.forEach((p, i) => {
    const isHi = p.x === highlight;
    inner += svgEl('circle', {
      cx: xAt(i).toFixed(1),
      cy: yAt(p.y).toFixed(1),
      r: isHi ? 5 : 3.5,
      fill: isHi ? '#b3271e' : '#faf6ef',
      stroke: '#b3271e',
      'stroke-width': 2,
    });
    if (i % 2 === 0 || isHi) {
      inner += svgEl('text', { x: xAt(i).toFixed(1), y: height - 10, 'text-anchor': 'middle', class: 'axis' }, p.x);
    }
    if (isHi) {
      inner += svgEl(
        'text',
        { x: xAt(i).toFixed(1), y: (yAt(p.y) - 10).toFixed(1), 'text-anchor': 'middle', class: 'peak' },
        formatNum(p.y, decimals),
      );
    }
  });
  if (unit) {
    inner += svgEl('text', { x: padL, y: 12, class: 'unit' }, unit);
  }
  return svgEl(
    'svg',
    { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `Line chart, ${unit}`.trim(), xmlns: NS, class: 'chart' },
    inner,
  );
}

// A donut: [{name, share, color}]. The centre shows the total label.
export function donut(parts, { size = 220, centre = '' } = {}) {
  const r = 82;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  let offset = 0;
  let arcs = '';
  for (const p of parts) {
    const len = (p.share / 100) * c;
    arcs += svgEl('circle', {
      cx,
      cy,
      r,
      fill: 'none',
      stroke: p.color,
      'stroke-width': 30,
      'stroke-dasharray': `${len.toFixed(1)} ${(c - len).toFixed(1)}`,
      'stroke-dashoffset': (-offset).toFixed(1),
    });
    offset += len;
  }
  const label = centre
    ? svgEl('text', { x: cx, y: cy + 5, 'text-anchor': 'middle', class: 'donut-centre' }, centre)
    : '';
  return svgEl(
    'svg',
    { viewBox: `0 0 ${size} ${size}`, role: 'img', 'aria-label': 'Share chart', xmlns: NS, class: 'donut' },
    arcs + label,
  );
}

export { formatNum };
