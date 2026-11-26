// China by Numbers — the figures behind the site.
//
// Two sources, each named wherever its figures appear:
//   * WB  — World Bank, World Development Indicators (accessed 26 Nov 2026),
//           ten-year series 2015-2024, China.
//   * NBS — National Bureau of Statistics of China, Statistical Communiqué on
//           the 2024 National Economic and Social Development, 28 Feb 2025.
//           Headline 2024 figures in yuan and the 2024 labour and income facts.
// A series ends where its source has no value yet (health and R&D stop at 2023).

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SOURCES = {
  wb: 'World Bank, World Development Indicators',
  nbs: 'National Bureau of Statistics of China, Statistical Communiqué 2024',
};

// Each series: a short id, the label the site shows, its unit, the source key,
// and one value per year in YEARS (null where the source has none yet).
export const SERIES = [
  {
    id: 'population',
    label: 'Population',
    unit: 'million people',
    source: 'wb',
    values: [1379.9, 1387.8, 1396.2, 1402.8, 1407.7, 1411.1, 1412.4, 1412.2, 1410.7, 1409.0],
  },
  {
    id: 'gdp',
    label: 'GDP',
    unit: 'US$ trillion, current prices',
    source: 'wb',
    values: [11.28, 11.46, 12.54, 14.15, 14.56, 15.0, 18.2, 18.32, 18.27, 18.73],
  },
  {
    id: 'growth',
    label: 'GDP growth',
    unit: '% per year, real',
    source: 'wb',
    values: [6.98, 6.77, 6.89, 6.76, 6.07, 2.34, 8.57, 3.13, 5.42, 4.96],
  },
  {
    id: 'gdpPc',
    label: 'GDP per capita',
    unit: 'US$, current prices',
    source: 'wb',
    values: [8175, 8255, 8980, 10086, 10343, 10627, 12887, 12971, 12951, 13293],
  },
  {
    id: 'exports',
    label: 'Exports of goods and services',
    unit: 'US$ trillion',
    source: 'wb',
    values: [2.36, 2.2, 2.42, 2.66, 2.64, 2.74, 3.54, 3.71, 3.54, 3.83],
  },
  {
    id: 'imports',
    label: 'Imports of goods and services',
    unit: 'US$ trillion',
    source: 'wb',
    values: [2.0, 1.94, 2.21, 2.56, 2.52, 2.41, 3.13, 3.17, 3.17, 3.28],
  },
  {
    id: 'urban',
    label: 'Urban population',
    unit: '% of total population',
    source: 'wb',
    values: [57.3, 58.8, 60.2, 61.5, 62.7, 63.5, 64.7, 65.2, 65.5, 65.9],
  },
  {
    id: 'cpi',
    label: 'Consumer prices (inflation)',
    unit: '% per year',
    source: 'wb',
    values: [1.44, 2.0, 1.59, 2.07, 2.9, 2.42, 0.98, 1.97, 0.23, 0.22],
  },
  {
    id: 'unemployment',
    label: 'Unemployment, ILO modelled',
    unit: '% of labour force',
    source: 'wb',
    values: [4.65, 4.56, 4.47, 4.31, 4.56, 5.0, 4.55, 4.98, 4.67, 4.59],
  },
  {
    id: 'life',
    label: 'Life expectancy at birth',
    unit: 'years',
    source: 'wb',
    values: [77.0, 77.2, 77.2, 77.7, 77.9, 78.0, 78.1, 78.2, 78.0, 78.0],
  },
  {
    id: 'fertility',
    label: 'Fertility rate',
    unit: 'births per woman',
    source: 'wb',
    values: [1.67, 1.77, 1.8, 1.54, 1.5, 1.24, 1.12, 1.03, 1.0, 1.01],
  },
  {
    id: 'age014',
    label: 'Population aged 0–14',
    unit: '% of total population',
    source: 'wb',
    values: [18.3, 18.3, 18.4, 18.3, 18.2, 18.0, 17.6, 17.1, 16.6, 16.0],
  },
  {
    id: 'age65',
    label: 'Population aged 65 and over',
    unit: '% of total population',
    source: 'wb',
    values: [10.1, 10.5, 11.0, 11.5, 12.1, 12.6, 13.2, 13.8, 14.3, 14.7],
  },
  {
    id: 'health',
    label: 'Health expenditure',
    unit: '% of GDP',
    source: 'wb',
    values: [4.85, 4.88, 4.97, 5.07, 5.27, 5.5, 5.26, 5.88, 5.94, null],
  },
  {
    id: 'rnd',
    label: 'Research and development spending',
    unit: '% of GDP',
    source: 'wb',
    values: [2.02, 2.06, 2.08, 2.1, 2.2, 2.36, 2.38, 2.49, 2.58, null],
  },
];

export function seriesById(id) {
  return SERIES.find((s) => s.id === id);
}

export function valueAt(series, year) {
  const i = YEARS.indexOf(year);
  return i === -1 ? null : series.values[i];
}

export function latest(series) {
  for (let i = series.values.length - 1; i >= 0; i--) {
    if (series.values[i] !== null && series.values[i] !== undefined) {
      return { year: YEARS[i], value: series.values[i] };
    }
  }
  return { year: null, value: null };
}

// Headline 2024 facts in yuan and from the labour market, all from the NBS
// communiqué. Each card on the overview names its source.
export const HEADLINES_2024 = [
  {
    label: 'Population',
    value: '1,408.28m',
    note: 'end of 2024, down 1.39m on 2023',
    source: 'nbs',
  },
  {
    label: 'GDP',
    value: '¥134.9 trillion',
    note: 'up 5.0% on 2023',
    source: 'nbs',
  },
  {
    label: 'GDP per capita',
    value: '¥95,749',
    note: 'up 5.1% on 2023',
    source: 'nbs',
  },
  {
    label: 'Goods trade',
    value: '¥43.85 trillion',
    note: 'exports ¥25.45tn, imports ¥18.39tn',
    source: 'nbs',
  },
  {
    label: 'Urban surveyed unemployment',
    value: '5.1%',
    note: 'annual average; 12.56m new urban jobs',
    source: 'nbs',
  },
  {
    label: 'Disposable income per capita',
    value: '¥41,314',
    note: 'up 5.3% nominal, 5.1% real',
    source: 'nbs',
  },
];

// GDP by sector in 2024, NBS: value added and share of GDP.
export const SECTORS_2024 = [
  { name: 'Primary (farming, forestry, fishing)', value: 9141.4, share: 6.8, growth: 3.5 },
  { name: 'Secondary (industry, construction)', value: 49208.7, share: 36.5, growth: 5.3 },
  { name: 'Tertiary (services)', value: 76558.3, share: 56.7, growth: 5.0 },
];

// Quarterly real GDP growth in 2024, NBS.
export const QUARTERS_2024 = [
  { quarter: 'Q1', growth: 5.3 },
  { quarter: 'Q2', growth: 4.7 },
  { quarter: 'Q3', growth: 4.6 },
  { quarter: 'Q4', growth: 5.4 },
];

// Age structure at the end of 2024, from the World Bank 2024 shares.
export const AGE_2024 = [
  { name: 'Aged 0–14', share: 16.0 },
  { name: 'Aged 15–64', share: 69.3 },
  { name: 'Aged 65 and over', share: 14.7 },
];

// Extra 2024 facts from the NBS communiqué, shown on the section pages.
export const FACTS_2024 = {
  births: { value: '9.54 million', note: 'birth rate 6.77 per thousand' },
  deaths: { value: '10.93 million', note: 'death rate 7.76 per thousand' },
  naturalGrowth: { value: '−0.99 per thousand', note: 'third year of natural decrease' },
  urbanResidents: { value: '943.50 million', note: 'urbanisation rate 67.00%, up 0.84 points' },
  retail: { value: '¥48,789.5 billion', note: 'retail sales of consumer goods, up 3.5%' },
  industry: { value: '+5.8%', note: 'value-added industrial output' },
  grain: { value: '706.50 million tonnes', note: 'grain output, up 1.6%, a record' },
  migrantWorkers: { value: '299.73 million', note: 'rural migrant workers, up 0.7%' },
  incomeUrban: { value: '¥54,188', note: 'urban per capita disposable income, up 4.6%' },
  incomeRural: { value: '¥23,119', note: 'rural per capita disposable income, up 6.6%' },
  tradeSurplus: { value: '¥7,062.3 billion', note: 'surplus of trade in goods' },
};
