// Router and controls for China by Numbers. Hash routes, no network:
//
//   #/                 overview (with a year selector)
//   #/population       population
//   #/economy          economy (with GDP / growth / trade tabs)
//   #/jobs             jobs and prices
//   #/society          society
//   #/data             the sortable, filterable data table
//   #/sources          where every figure comes from
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { overview, populationPage, economyPage, jobsPage, societyPage, dataPage, sourcesPage, missingPage } from './views.js';

const app = document.getElementById('app');

const state = {
  year: 2024,
  tab: 'gdp',
  filter: '',
  sortKey: 'label',
  sortDir: 'asc',
};

const TITLES = {
  '': 'China by Numbers',
  population: 'Population | China by Numbers',
  economy: 'Economy | China by Numbers',
  jobs: 'Jobs & prices | China by Numbers',
  society: 'Society | China by Numbers',
  data: 'All the data | China by Numbers',
  sources: 'Sources | China by Numbers',
};

function render() {
  window.__shotReady = false;
  const route = (location.hash.match(/^#\/([a-z]*)[/?]?/) || [])[1] || '';
  let html;
  if (route === '') {
    html = overview(state.year);
    document.title = TITLES[''];
  } else if (route === 'population') {
    html = populationPage(state.year);
    document.title = TITLES.population;
  } else if (route === 'economy') {
    html = economyPage(state.year, state.tab);
    document.title = TITLES.economy;
  } else if (route === 'jobs') {
    html = jobsPage(state.year);
    document.title = TITLES.jobs;
  } else if (route === 'society') {
    html = societyPage(state.year);
    document.title = TITLES.society;
  } else if (route === 'data') {
    html = dataPage(state.filter, state.sortKey, state.sortDir);
    document.title = TITLES.data;
  } else if (route === 'sources') {
    html = sourcesPage();
    document.title = TITLES.sources;
  } else {
    html = missingPage();
    document.title = 'Not found | China by Numbers';
  }
  app.innerHTML = html;
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('current', a.getAttribute('href') === `#/${route}`);
  });
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// Controls live inside the rendered page, so clicks are handled by delegation.
app.addEventListener('click', (event) => {
  const yearBtn = event.target.closest('[data-year]');
  if (yearBtn) {
    state.year = Number(yearBtn.dataset.year);
    render();
    return;
  }
  const tabBtn = event.target.closest('[data-tab]');
  if (tabBtn) {
    state.tab = tabBtn.dataset.tab;
    render();
    return;
  }
  const th = event.target.closest('th[data-sort]');
  if (th) {
    const key = th.dataset.sort;
    if (state.sortKey === key) {
      state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      state.sortKey = key;
      state.sortDir = 'asc';
    }
    render();
  }
});

app.addEventListener('input', (event) => {
  if (event.target.id === 'filter') {
    state.filter = event.target.value;
    const pos = event.target.selectionStart;
    render();
    const again = document.getElementById('filter');
    if (again) {
      again.focus();
      again.setSelectionRange(pos, pos);
    }
  }
});

window.addEventListener('hashchange', render);
render();
