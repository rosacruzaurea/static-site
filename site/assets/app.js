'use strict';
// Progressive enhancement: all essential navigation and content exists in HTML.
document.documentElement.classList.add('js');
const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('#site-navigation');
if (menuButton && navigation) {
  const closeMenu = (restoreFocus = false) => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰ Menu';
    if (restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? '× Fechar' : '☰ Menu';
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu(true);
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  matchMedia('(min-width: 901px)').addEventListener('change', () => closeMenu());
}
const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const dots = [...carousel.querySelectorAll('[data-slide-to]')];
  let current = 0;
  const showSlide = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
  };
  carousel.querySelectorAll('[data-carousel-control]').forEach(control => { control.hidden = false; });
  carousel.querySelector('[data-previous]').addEventListener('click', () => showSlide(current - 1));
  carousel.querySelector('[data-next]').addEventListener('click', () => showSlide(current + 1));
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slideTo))));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); showSlide(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
}
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
for (const form of document.querySelectorAll('[data-filter-form]')) {
  const container = document.querySelector(form.dataset.target);
  const cards = [...container.querySelectorAll('[data-search]')];
  const search = form.querySelector('input[type="search"]');
  const category = form.querySelector('select');
  const empty = container.querySelector('[data-empty]');
  const count = document.querySelector('[data-results-count]');
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  if ([...category.options].some(option => option.value === params.get('filter'))) category.value = params.get('filter');
  const filter = (updateUrl = true) => {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const card of cards) {
      const matches = terms.every(term => normalize(card.dataset.search).includes(term)) &&
        (!category.value || card.dataset.filter.split('|').includes(category.value));
      card.hidden = !matches;
      if (matches) visible++;
    }
    empty.hidden = visible !== 0;
    count.textContent = `${visible} de ${cards.length} ${form.dataset.noun}`;
    if (updateUrl) {
      const url = new URL(location.href);
      search.value.trim() ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
      category.value ? url.searchParams.set('filter', category.value) : url.searchParams.delete('filter');
      // Input stays text, not HTML. URL filters support reloading and sharing.
      history.replaceState(null, '', url);
    }
  };
  form.hidden = false;
  form.addEventListener('submit', event => { event.preventDefault(); filter(); });
  search.addEventListener('input', () => filter());
  category.addEventListener('change', () => filter());
  form.querySelector('[data-clear]').addEventListener('click', () => {
    search.value = ''; category.value = ''; filter(); search.focus();
  });
  window.addEventListener('pageshow', () => filter(false));
  filter(false);
}
// The current program is a dated source snapshot; past meetings are clearly marked.
for (const event of document.querySelectorAll('[data-event-end]')) {
  if (Date.now() > Date.parse(event.dataset.eventEnd)) {
    const status = event.querySelector('[data-event-status]');
    if (status) status.textContent = 'Encontro realizado';
    const link = event.querySelector('.button');
    if (link) link.textContent = 'Consultar programação';
  }
}
