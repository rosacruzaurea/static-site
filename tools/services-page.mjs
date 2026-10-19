// Data is extracted from the public source; only escaped text and approved links reach HTML.
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function servicesPage(data) {
  const collections = data.collections;
  const total = collections.reduce((sum, cycle) => sum + cycle.entries.length, 0);
  const years = [...new Set(collections.map(cycle => cycle.year))].sort().reverse();
  const sourceDate = new Intl.DateTimeFormat('pt-BR', {timeZone:'UTC'}).format(new Date(data.retrievedAt));
  const editorialDate = data.editorialUpdate ? new Intl.DateTimeFormat('pt-BR', {timeZone:'UTC'}).format(new Date(data.editorialUpdate.date)) : null;
  const cycles = collections.map((cycle, index) => {
    const entries = cycle.entries.map((entry, i) => {
      const url = new URL(entry.url);
      if (url.protocol !== 'https:' || !['www.youtube.com','youtube.com','youtu.be'].includes(url.hostname) || url.username || url.password || url.port) {
        throw new Error('Unexpected service video URL');
      }
      return `<li data-service-entry data-search="${escape(cycle.title+' '+entry.title)}"><a class="service-record" href="${escape(entry.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(entry.title+'; assistir no YouTube em nova aba')}"><span class="service-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span class="service-title">${escape(entry.title)}</span><span class="service-meta">${entry.duration?`<span class="service-duration" aria-label="Duração ${escape(entry.duration)}">${escape(entry.duration)}</span>`:''}<span class="service-watch">Assistir no YouTube ↗</span></span></a></li>`;
    }).join('');
    return `<details class="service-cycle" data-services-cycle data-year="${escape(cycle.year)}" id="${escape(cycle.id)}"${index===0?' open':''}><summary><h2>${escape(cycle.title)}</h2><span class="service-cycle-count" data-cycle-count>${cycle.entries.length} registros</span></summary><ol class="service-records">${entries}</ol></details>`;
  }).join('');
  return `<section class="section service-archive" data-service-library><div class="wrap">
    <div class="services-intro"><p>Escolha um ciclo para consultar suas gravações. Os vídeos abrem no YouTube em uma nova aba.</p><span class="services-label">Serviços e conferências</span></div>
    <form class="filters services-filters" data-services-filter role="search" hidden><div class="field"><label for="services-search">Buscar no acervo</label><input id="services-search" name="q" type="search" maxlength="200" placeholder="Ex.: conferência, comunidade, junho…" autocomplete="off"></div><div class="field"><label for="services-year">Ano do ciclo</label><select id="services-year" name="year"><option value="">Todos os anos</option>${years.map(year=>`<option value="${escape(year)}">${escape(year)}</option>`).join('')}</select></div><button class="filter-reset" type="button" data-services-clear>Limpar filtros</button></form>
    <div class="services-toolbar"><p class="results-count" data-services-count role="status" aria-live="polite">${total} registros em ${collections.length} coleções</p><button class="services-expand" type="button" data-services-expand hidden>Expandir coleções</button></div>
    <div class="service-cycles">${cycles}</div>
    <div class="empty-state" data-services-empty hidden><h2>Nenhum registro encontrado</h2><p>Experimente outro termo ou selecione todos os anos.</p></div>
    <p class="source-note">Acervo inicial consultado em ${escape(sourceDate)} na <a href="${escape(data.sourceUrl)}">biblioteca original ↗</a>.${editorialDate ? ` Atualizado com links fornecidos pela equipe em ${escape(editorialDate)}.` : ''} A disponibilidade das gravações depende do YouTube.</p>
  </div></section>`;
}
