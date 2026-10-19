'use strict';
(() => {
  const library = document.querySelector('[data-service-library]');
  if (!library) return;
  const form = library.querySelector('[data-services-filter]');
  const search = form.querySelector('input[type="search"]');
  const year = form.querySelector('select');
  const count = library.querySelector('[data-services-count]');
  const empty = library.querySelector('[data-services-empty]');
  const expand = library.querySelector('[data-services-expand]');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const cycles = [...library.querySelectorAll('[data-services-cycle]')].map(element => ({
    element,
    count: element.querySelector('[data-cycle-count]'),
    entries: [...element.querySelectorAll('[data-service-entry]')].map(item => ({element:item, text:normalize(item.dataset.search)})),
  }));
  const total = cycles.reduce((sum, cycle) => sum + cycle.entries.length, 0);
  let wasFiltering = false;
  let previousOpen = new Set();
  const updateExpand = () => {
    const visible = cycles.filter(cycle => !cycle.element.hidden);
    expand.disabled = !visible.length;
    expand.textContent = visible.some(cycle => !cycle.element.open) ? 'Expandir coleções' : 'Recolher coleções';
  };
  const filter = (updateUrl = true) => {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    const filtering = Boolean(terms.length || year.value);
    if (filtering && !wasFiltering) previousOpen = new Set(cycles.filter(c=>c.element.open).map(c=>c.element.id));
    let records = 0;
    let groups = 0;
    for (const cycle of cycles) {
      let visible = 0;
      const matchesYear = !year.value || cycle.element.dataset.year === year.value;
      for (const entry of cycle.entries) {
        const matches = matchesYear && terms.every(term => entry.text.includes(term));
        entry.element.hidden = !matches;
        if (matches) visible++;
      }
      cycle.element.hidden = visible === 0;
      cycle.count.textContent = `${visible} ${visible === 1 ? 'registro' : 'registros'}`;
      if (filtering) cycle.element.open = visible > 0;
      else if (wasFiltering) cycle.element.open = previousOpen.has(cycle.element.id);
      records += visible;
      if (visible) groups++;
    }
    wasFiltering = filtering;
    empty.hidden = records !== 0;
    count.textContent = `${records} de ${total} registros em ${groups} ${groups === 1 ? 'coleção' : 'coleções'}`;
    updateExpand();
    if (updateUrl) {
      const url = new URL(location.href);
      search.value.trim() ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
      year.value ? url.searchParams.set('year', year.value) : url.searchParams.delete('year');
      history.replaceState(null, '', url);
    }
  };
  const readUrl = () => {
    const params = new URLSearchParams(location.search);
    search.value = (params.get('q') || '').slice(0,200);
    year.value = [...year.options].some(option=>option.value===params.get('year')) ? params.get('year') : '';
    filter(false);
  };
  form.addEventListener('submit', event => { event.preventDefault(); filter(); });
  search.addEventListener('input', () => filter());
  year.addEventListener('change', () => filter());
  form.querySelector('[data-services-clear]').addEventListener('click', () => {
    search.value = ''; year.value = ''; filter(); search.focus();
  });
  expand.addEventListener('click', () => {
    const visible = cycles.filter(cycle => !cycle.element.hidden);
    const open = visible.some(cycle => !cycle.element.open);
    for (const cycle of visible) cycle.element.open = open;
    updateExpand();
  });
  for (const cycle of cycles) cycle.element.addEventListener('toggle', updateExpand);
  window.addEventListener('popstate', readUrl);
  window.addEventListener('pageshow', readUrl);
  readUrl();
  form.hidden = false;
  expand.hidden = false;
})();
