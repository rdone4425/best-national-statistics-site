// Page templates, one per hash route. Each returns HTML built from data.js;
// charts come from charts.js. Every figure names its source and year.

import { YEARS, SOURCES, SERIES, HEADLINES_2024, SECTORS_2024, QUARTERS_2024, AGE_2024, FACTS_2024, seriesById, valueAt } from './data.js';
import { barChart, lineChart, donut, formatNum } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function srcNote(sourceKey, extra = '') {
  return `<p class="src">Source: ${esc(SOURCES[sourceKey])}${extra ? ` · ${esc(extra)}` : ''}</p>`;
}

function yearButtons(year) {
  return `<div class="years" role="group" aria-label="Choose a year">
    ${YEARS.map(
      (y) =>
        `<button type="button" data-year="${y}" class="${y === year ? 'on' : ''}" aria-pressed="${y === year}">${y}</button>`,
    ).join('')}
  </div>`;
}

function kpiCards() {
  return `<div class="kpis">${HEADLINES_2024.map(
    (h) => `<article class="kpi">
      <p class="kpi-label">${esc(h.label)}</p>
      <p class="kpi-value">${esc(h.value)}</p>
      <p class="kpi-note">${esc(h.note)}</p>
      <p class="src">${esc(SOURCES[h.source])} · 2024</p>
    </article>`,
  ).join('')}</div>`;
}

function yearFocus(year) {
  const rows = [
    ['Population', seriesById('population'), 'm', 1],
    ['GDP', seriesById('gdp'), 'US$ tn', 2],
    ['GDP growth', seriesById('growth'), '%', 2],
    ['GDP per capita', seriesById('gdpPc'), 'US$', 0],
    ['Consumer prices', seriesById('cpi'), '%', 2],
    ['Exports', seriesById('exports'), 'US$ tn', 2],
  ];
  return `<div class="focus">
    <h3>In ${year}</h3>
    <dl>${rows
      .map(([label, s, unit, dec]) => {
        const v = valueAt(s, year);
        return `<div><dt>${esc(label)}</dt><dd>${v === null ? '—' : `${formatNum(v, dec)} ${unit}`}</dd></div>`;
      })
      .join('')}</dl>
    ${srcNote('wb', 'World Development Indicators, ' + year)}
  </div>`;
}

export function overview(year) {
  const gdp = seriesById('gdp');
  const pop = seriesById('population');
  const gdpPoints = YEARS.map((y) => ({ x: String(y), y: valueAt(gdp, y) }));
  const popPoints = YEARS.map((y) => ({ x: String(y), y: valueAt(pop, y) }));
  return `
  <p class="eyebrow">National statistics · China · 2015–2024</p>
  <h1>China by Numbers</h1>
  <p class="lede">The country's economy and people in ten years of official figures — every number with its source and year, drawn from the World Bank and China's National Bureau of Statistics.</p>
  ${kpiCards()}
  <section class="panel">
    <div class="panel-head">
      <h2>Explore by year</h2>
      ${yearButtons(year)}
    </div>
    <p class="hint">Pick a year: the panel below and the red marks on the charts follow it.</p>
    ${yearFocus(year)}
  </section>
  <div class="grid2">
    <section class="panel">
      <h2>GDP, 2015–2024</h2>
      ${barChart(gdpPoints, { unit: 'US$ trillion, current prices', highlight: String(year), decimals: 2 })}
      ${srcNote('wb')}
    </section>
    <section class="panel">
      <h2>Population, 2015–2024</h2>
      ${lineChart(popPoints, { unit: 'million people', highlight: String(year), decimals: 0 })}
      ${srcNote('wb')}
    </section>
  </div>
  <section class="panel">
    <h2>Inside the site</h2>
    <ul class="toc">
      <li><a href="#/population">Population</a> — how many people, how old they are, and where they live.</li>
      <li><a href="#/economy">Economy</a> — GDP, growth, trade and what the economy is made of.</li>
      <li><a href="#/jobs">Jobs &amp; prices</a> — unemployment, inflation and household income.</li>
      <li><a href="#/society">Society</a> — health, longevity and research.</li>
      <li><a href="#/data">All the data</a> — every series in one sortable table.</li>
    </ul>
  </section>`;
}

export function populationPage(year) {
  const pop = seriesById('population');
  const urban = seriesById('urban');
  const fert = seriesById('fertility');
  const points = (s) => YEARS.map((y) => ({ x: String(y), y: valueAt(s, y) }));
  const donutParts = [
    { name: 'Aged 0–14', share: AGE_2024[0].share, color: '#2e6f6a' },
    { name: 'Aged 15–64', share: AGE_2024[1].share, color: '#1c2b3a' },
    { name: 'Aged 65 and over', share: AGE_2024[2].share, color: '#b3271e' },
  ];
  return `
  <p class="eyebrow">People</p>
  <h1>Population</h1>
  <p class="lede">China's population peaked in 2021 and has fallen for three years since. The country is ageing fast: one in seven people is now 65 or older.</p>
  <div class="grid2">
    <section class="panel">
      <h2>Total population</h2>
      ${lineChart(points(pop), { unit: 'million people', highlight: String(year), decimals: 0 })}
      ${srcNote('wb')}
    </section>
    <section class="panel">
      <h2>Age structure, 2024</h2>
      <div class="donut-wrap">
        ${donut(donutParts, { centre: '1,409m' })}
        <ul class="legend">${donutParts
          .map((p) => `<li><span class="swatch" style="background:${p.color}"></span>${esc(p.name)} — ${formatNum(p.share, 1)}%</li>`)
          .join('')}</ul>
      </div>
      ${srcNote('wb', 'shares of total population, 2024')}
    </section>
  </div>
  <div class="grid2">
    <section class="panel">
      <h2>Urban share</h2>
      ${lineChart(points(urban), { unit: '% of total population', highlight: String(year), decimals: 1 })}
      ${srcNote('wb')}
      <p>By the NBS count of permanent residents, the urbanisation rate reached <strong>67.00%</strong> at the end of 2024, up 0.84 points on 2023.</p>
      ${srcNote('nbs', '2024')}
    </section>
    <section class="panel">
      <h2>Births and fertility</h2>
      ${lineChart(points(fert), { unit: 'births per woman', highlight: String(year), decimals: 2 })}
      ${srcNote('wb')}
      <dl class="facts">
        <div><dt>Births, 2024</dt><dd>${esc(FACTS_2024.births.value)} (${esc(FACTS_2024.births.note)})</dd></div>
        <div><dt>Deaths, 2024</dt><dd>${esc(FACTS_2024.deaths.value)} (${esc(FACTS_2024.deaths.note)})</dd></div>
        <div><dt>Natural growth, 2024</dt><dd>${esc(FACTS_2024.naturalGrowth.value)}</dd></div>
      </dl>
      ${srcNote('nbs', '2024')}
    </section>
  </div>`;
}

function sectorRows() {
  return SECTORS_2024.map(
    (s) => `<tr><td>${esc(s.name)}</td><td>${formatNum(s.value, 1)}</td><td>${formatNum(s.share, 1)}%</td><td>+${formatNum(s.growth, 1)}%</td></tr>`,
  ).join('');
}

export function economyPage(year, tab) {
  const gdp = seriesById('gdp');
  const growth = seriesById('growth');
  const exp = seriesById('exports');
  const imp = seriesById('imports');
  const points = (s) => YEARS.map((y) => ({ x: String(y), y: valueAt(s, y) }));
  let chartHtml = '';
  let chartSrc = 'wb';
  if (tab === 'growth') {
    chartHtml = lineChart(points(growth), { unit: '% per year, real', highlight: String(year), decimals: 1 });
  } else if (tab === 'trade') {
    const expPts = points(exp);
    const impPts = points(imp);
    chartHtml = `<div class="trade-charts">
      <div><h3>Exports</h3>${barChart(expPts, { unit: 'US$ trillion', highlight: String(year), decimals: 2 })}</div>
      <div><h3>Imports</h3>${barChart(impPts, { unit: 'US$ trillion', highlight: String(year), decimals: 2 })}</div>
    </div>`;
  } else {
    chartHtml = barChart(points(gdp), { unit: 'US$ trillion, current prices', highlight: String(year), decimals: 2 });
  }
  const donutParts = [
    { name: 'Primary', share: SECTORS_2024[0].share, color: '#2e6f6a' },
    { name: 'Secondary', share: SECTORS_2024[1].share, color: '#1c2b3a' },
    { name: 'Tertiary', share: SECTORS_2024[2].share, color: '#b3271e' },
  ];
  return `
  <p class="eyebrow">Economy</p>
  <h1>Economy</h1>
  <p class="lede">The world's second-largest economy: ¥134.9 trillion of output in 2024, growing 5.0%, with services now more than half of everything produced.</p>
  <section class="panel">
    <div class="tabs" role="tablist" aria-label="Choose an indicator">
      <button type="button" role="tab" data-tab="gdp" class="${tab === 'gdp' ? 'on' : ''}" aria-selected="${tab === 'gdp'}">GDP</button>
      <button type="button" role="tab" data-tab="growth" class="${tab === 'growth' ? 'on' : ''}" aria-selected="${tab === 'growth'}">Growth</button>
      <button type="button" role="tab" data-tab="trade" class="${tab === 'trade' ? 'on' : ''}" aria-selected="${tab === 'trade'}">Trade</button>
    </div>
    ${chartHtml}
    ${srcNote(chartSrc)}
  </section>
  <div class="grid2">
    <section class="panel">
      <h2>What the economy is made of, 2024</h2>
      <div class="donut-wrap">
        ${donut(donutParts, { centre: '¥134.9tn' })}
        <ul class="legend">${donutParts
          .map((p) => `<li><span class="swatch" style="background:${p.color}"></span>${esc(p.name)} — ${formatNum(p.share, 1)}%</li>`)
          .join('')}</ul>
      </div>
      <table class="mini">
        <thead><tr><th>Sector</th><th>Value added (¥bn)</th><th>Share</th><th>Growth</th></tr></thead>
        <tbody>${sectorRows()}</tbody>
      </table>
      ${srcNote('nbs', '2024')}
    </section>
    <section class="panel">
      <h2>Growth by quarter, 2024</h2>
      ${barChart(QUARTERS_2024.map((q) => ({ x: q.quarter, y: q.growth })), { unit: '% year on year', decimals: 1 })}
      ${srcNote('nbs', '2024')}
      <dl class="facts">
        <div><dt>Goods trade, 2024</dt><dd>¥43,846.8bn, up 5.0% — exports ¥25,454.5bn (+7.1%), imports ¥18,392.3bn (+2.3%)</dd></div>
        <div><dt>Trade surplus, 2024</dt><dd>${esc(FACTS_2024.tradeSurplus.value)}</dd></div>
        <div><dt>Grain output, 2024</dt><dd>${esc(FACTS_2024.grain.value)} (${esc(FACTS_2024.grain.note)})</dd></div>
      </dl>
      ${srcNote('nbs', '2024')}
    </section>
  </div>`;
}

export function jobsPage(year) {
  const unemp = seriesById('unemployment');
  const cpi = seriesById('cpi');
  const points = (s) => YEARS.map((y) => ({ x: String(y), y: valueAt(s, y) }));
  return `
  <p class="eyebrow">Work and money</p>
  <h1>Jobs &amp; prices</h1>
  <p class="lede">Unemployment has stayed near 5% for a decade, and prices barely moved in 2024 — consumer prices rose just 0.2%.</p>
  <div class="grid2">
    <section class="panel">
      <h2>Unemployment</h2>
      ${lineChart(points(unemp), { unit: '% of labour force, ILO modelled', highlight: String(year), decimals: 2 })}
      ${srcNote('wb')}
      <p>The NBS surveyed urban unemployment rate averaged <strong>5.1%</strong> in 2024, with 12.56 million new urban jobs created. In the 31 major cities it was 5.0%.</p>
      ${srcNote('nbs', '2024')}
    </section>
    <section class="panel">
      <h2>Consumer prices</h2>
      ${lineChart(points(cpi), { unit: '% per year', highlight: String(year), decimals: 2 })}
      ${srcNote('wb')}
      <p>Retail sales of consumer goods reached <strong>¥48,789.5 billion</strong> in 2024, up 3.5% on 2023. Value-added industrial output rose 5.8%.</p>
      ${srcNote('nbs', '2024')}
    </section>
  </div>
  <section class="panel">
    <h2>Household income, 2024</h2>
    <div class="kpis">
      <article class="kpi"><p class="kpi-label">Disposable income per capita</p><p class="kpi-value">¥41,314</p><p class="kpi-note">up 5.3% nominal, 5.1% real</p>${srcNote('nbs', '2024')}</article>
      <article class="kpi"><p class="kpi-label">Urban households</p><p class="kpi-value">¥54,188</p><p class="kpi-note">up 4.6% nominal</p>${srcNote('nbs', '2024')}</article>
      <article class="kpi"><p class="kpi-label">Rural households</p><p class="kpi-value">¥23,119</p><p class="kpi-note">up 6.6% nominal, faster than urban</p>${srcNote('nbs', '2024')}</article>
      <article class="kpi"><p class="kpi-label">Rural migrant workers</p><p class="kpi-value">${esc(FACTS_2024.migrantWorkers.value)}</p><p class="kpi-note">${esc(FACTS_2024.migrantWorkers.note)}</p>${srcNote('nbs', '2024')}</article>
    </div>
  </section>`;
}

export function societyPage(year) {
  const life = seriesById('life');
  const fert = seriesById('fertility');
  const health = seriesById('health');
  const rnd = seriesById('rnd');
  const points = (s) => YEARS.map((y) => ({ x: String(y), y: valueAt(s, y) }));
  const healthLatest = health.values[8];
  const rndLatest = rnd.values[8];
  return `
  <p class="eyebrow">People's lives</p>
  <h1>Society</h1>
  <p class="lede">People live longer than ever — 78 years at birth — while births fall and the country spends more on health and research.</p>
  <div class="grid2">
    <section class="panel">
      <h2>Life expectancy</h2>
      ${lineChart(points(life), { unit: 'years at birth', highlight: String(year), decimals: 1 })}
      ${srcNote('wb')}
    </section>
    <section class="panel">
      <h2>Fertility rate</h2>
      ${lineChart(points(fert), { unit: 'births per woman', highlight: String(year), decimals: 2 })}
      ${srcNote('wb')}
      <p>The fertility rate fell below replacement in the early 1990s and reached <strong>1.01</strong> in 2024 — among the lowest in the world.</p>
    </section>
  </div>
  <section class="panel">
    <h2>Spending on health and research</h2>
    <div class="kpis">
      <article class="kpi"><p class="kpi-label">Health expenditure</p><p class="kpi-value">${formatNum(healthLatest, 2)}% of GDP</p><p class="kpi-note">latest year, 2023 — up from 4.85% in 2015</p>${srcNote('wb', '2023')}</article>
      <article class="kpi"><p class="kpi-label">Research &amp; development</p><p class="kpi-value">${formatNum(rndLatest, 2)}% of GDP</p><p class="kpi-note">latest year, 2023 — up from 2.02% in 2015</p>${srcNote('wb', '2023')}</article>
      <article class="kpi"><p class="kpi-label">Urban permanent residents</p><p class="kpi-value">${esc(FACTS_2024.urbanResidents.value)}</p><p class="kpi-note">urbanisation rate 67.00% at end-2024</p>${srcNote('nbs', '2024')}</article>
    </div>
  </section>`;
}

export function dataPage(filter, sortKey, sortDir) {
  const rows = SERIES.map((s) => ({
    label: s.label,
    unit: s.unit,
    source: SOURCES[s.source],
    values: s.values,
  }));
  const q = (filter || '').trim().toLowerCase();
  const shown = q ? rows.filter((r) => (r.label + ' ' + r.unit).toLowerCase().includes(q)) : rows;
  const key = sortKey || 'label';
  const dir = sortDir === 'desc' ? -1 : 1;
  shown.sort((a, b) => {
    let av;
    let bv;
    if (key === 'label') {
      av = a.label;
      bv = b.label;
    } else if (key === 'latest') {
      av = a.values[a.values.findLastIndex((v) => v !== null)];
      bv = b.values[b.values.findLastIndex((v) => v !== null)];
    } else {
      const i = YEARS.indexOf(Number(key));
      av = i === -1 ? null : a.values[i];
      bv = i === -1 ? null : b.values[i];
    }
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    return (av < bv ? -1 : av > bv ? 1 : 0) * dir;
  });
  const headCells = [
    `<th data-sort="label" class="${key === 'label' ? 'sorted' : ''}">Indicator ${key === 'label' ? (dir === 1 ? '▲' : '▼') : ''}</th>`,
    `<th>Unit</th>`,
    ...YEARS.map(
      (y) =>
        `<th data-sort="${y}" class="${String(key) === String(y) ? 'sorted' : ''}">${y}${String(key) === String(y) ? (dir === 1 ? ' ▲' : ' ▼') : ''}</th>`,
    ),
    `<th data-sort="latest" class="${key === 'latest' ? 'sorted' : ''}">Latest${key === 'latest' ? (dir === 1 ? ' ▲' : ' ▼') : ''}</th>`,
  ].join('');
  const body = shown
    .map((r) => {
      const cells = r.values
        .map((v) => `<td>${v === null ? '—' : formatNum(v, Math.abs(v) < 10 ? 2 : 1)}</td>`)
        .join('');
      const lastI = r.values.findLastIndex((v) => v !== null);
      return `<tr><td class="row-label">${esc(r.label)}<span class="row-src">${esc(r.source)}</span></td><td>${esc(r.unit)}</td>${cells}<td><strong>${lastI === -1 ? '—' : formatNum(r.values[lastI], 2)} (${YEARS[lastI]})</strong></td></tr>`;
    })
    .join('');
  return `
  <p class="eyebrow">The numbers</p>
  <h1>All the data</h1>
  <p class="lede">Every series on this site in one table, 2015–2024. Click a column heading to sort; type to filter. Blank cells mean the source has not published that year yet.</p>
  <section class="panel">
    <label class="filter-label" for="filter">Filter indicators
      <input id="filter" type="search" value="${esc(filter || '')}" placeholder="e.g. population, GDP, prices…" autocomplete="off">
    </label>
    <div class="table-wrap">
      <table class="data">
        <thead><tr>${headCells}</tr></thead>
        <tbody>${body || '<tr><td colspan="13">No indicators match that filter.</td></tr>'}</tbody>
      </table>
    </div>
    <p class="src">Sources: World Bank, World Development Indicators (series), 2015–2024. Headline 2024 yuan figures on other pages come from the National Bureau of Statistics of China, Statistical Communiqué 2024.</p>
  </section>`;
}

export function sourcesPage() {
  return `
  <p class="eyebrow">Where the numbers come from</p>
  <h1>Sources</h1>
  <p class="lede">Two public sources, nothing else. Every figure on this site names one of them, with its year, next to the figure itself.</p>
  <section class="panel">
    <h2>World Bank — World Development Indicators</h2>
    <p>All ten-year series, 2015–2024: population, GDP and GDP per capita, GDP growth, exports and imports of goods and services, urban population share, consumer price inflation, ILO-modelled unemployment, life expectancy, fertility, age structure, health expenditure and research and development spending. Figures as published in the World Development Indicators database, accessed 26 November 2026.</p>
    <h2>National Bureau of Statistics of China — Statistical Communiqué on the 2024 National Economic and Social Development</h2>
    <p>Published 28 February 2025. All 2024 headline figures in yuan: GDP ¥134,908.4 billion (+5.0%), GDP per capita ¥95,749, sector shares and growth, quarterly growth, population 1,408.28 million, births and deaths, urbanisation rate 67.00%, surveyed urban unemployment 5.1%, per capita disposable income ¥41,314 (urban ¥54,188, rural ¥23,119), retail sales ¥48,789.5 billion, goods trade ¥43,846.8 billion, grain output 706.50 million tonnes.</p>
    <h2>About this site</h2>
    <p>China by Numbers is an independent presentation of public statistics. It is not affiliated with the World Bank or the National Bureau of Statistics of China. Figures are rounded for display; the underlying series are shown to two decimals in the data table.</p>
  </section>`;
}

export function missingPage() {
  return `<h1>Not found</h1>
  <p>There is no page at this address. <a href="#/">Back to the overview</a>.</p>`;
}
