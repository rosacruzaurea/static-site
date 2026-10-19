// Optional UI verification using an existing Playwright/CDP installation, entirely offline.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
if (!process.env.PLAYWRIGHT_MODULE || !process.env.CDP_URL) throw new Error('Set PLAYWRIGHT_MODULE and CDP_URL to existing authorized tooling.');
const {chromium} = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root,'site');
const evidence = path.join(root,'evidence'); fs.mkdirSync(evidence,{recursive:true});
const data = JSON.parse(fs.readFileSync(path.join(root,'content/services.json'),'utf8'));
const entries = data.collections.flatMap(c=>c.entries);
const route = '/biblioteca-de-servicos-e-conferencias/';
const origin = 'https://static-site.test';
const base = origin+'/static-site';
const results = [], failures = [], thirdParty = [], errors = [];
const check = (passed,description) => {results.push({description,passed:Boolean(passed)});if(!passed) failures.push(description);};
const normalize = value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg'};
const fulfill = async request => {
  const url = new URL(request.request().url());
  if(url.origin!==origin){thirdParty.push(url.origin);await request.abort();return;}
  if(!url.pathname.startsWith('/static-site/')){failures.push('Missing project subpath: '+url.pathname);await request.fulfill({status:404,body:''});return;}
  let file=path.resolve(site,'.'+decodeURIComponent(url.pathname.slice('/static-site'.length)));
  if(file!==site&&!file.startsWith(site+path.sep)){await request.fulfill({status:403,body:''});return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){failures.push('Missing local asset: '+url.pathname);await request.fulfill({status:404,body:''});return;}
  await request.fulfill({status:200,contentType:types[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});
};
const browser=await chromium.connectOverCDP(process.env.CDP_URL,{timeout:20000});
const context=await browser.newContext({viewport:{width:1365,height:1100},locale:'pt-BR',timezoneId:'America/Sao_Paulo'});
await context.route('**/*',fulfill);
const page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
try {
  for(const width of [1365,390,320]){
    await page.setViewportSize({width,height:1100});await page.goto(base+route,{waitUntil:'load'});
    check(await page.locator('h1').count()===1,`${width}px: one heading`);
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}px: no horizontal overflow`);
    check(await page.locator('[data-services-filter]').isVisible(),`${width}px: filters enhanced`);
    if(width!==320) await page.screenshot({path:path.join(evidence,`services-${width}.png`)});
  }
  const cycles=page.locator('[data-services-cycle]');
  check(await cycles.count()===data.collections.length,'All source collections retained');
  check(await page.locator('[data-service-entry]').count()===entries.length,'All source entries retained');
  check(await page.locator('[data-services-cycle][open]').count()===1,'First collection opens initially');
  await cycles.first().locator('summary').focus();await page.keyboard.press('Enter');
  check(await cycles.first().getAttribute('open')===null,'Native summary collapses by keyboard');
  await page.keyboard.press('Enter');
  check(await cycles.first().getAttribute('open')!==null,'Native summary opens by keyboard');
  await page.locator('[data-services-expand]').click();
  check(await page.locator('[data-service-entry]:visible').count()===entries.length,'Expand exposes every entry');
  await page.locator('[data-services-expand]').click();
  check(await page.locator('[data-services-cycle][open]').count()===0,'Collapse closes all collections');
  const search=page.getByRole('searchbox');const year=page.getByLabel('Ano do ciclo');
  await year.selectOption('2026');
  const yearCount=data.collections.filter(c=>c.year==='2026').reduce((n,c)=>n+c.entries.length,0);
  check(await page.locator('[data-service-entry]:visible').count()===yearCount,'Year filter exposes matching entries in open collections');
  await search.fill('CONFERENCIA');
  const combinedCount=data.collections.filter(c=>c.year==='2026').flatMap(c=>c.entries).filter(e=>normalize(e.title).includes('conferencia')).length;
  check(await page.locator('[data-service-entry]:visible').count()===combinedCount,'Combined filters ignore case and accents');
  await page.reload();
  check(await search.inputValue()==='CONFERENCIA'&&await year.inputValue()==='2026','URL preserves both filters on reload');
  check(await page.locator('[data-service-entry]:visible').count()===combinedCount,'Reload preserves actual result set');
  await search.fill('zzzz-sem-resultados');
  check(await page.locator('[data-services-empty]').isVisible(),'Empty state appears');
  check(await page.locator('[data-services-cycle]:visible').count()===0,'Empty state hides all cycles');
  check(await page.locator('[data-services-expand]').isDisabled(),'Empty state disables expansion');
  await search.fill('<img src=x onerror=alert(1)>');
  check(await page.locator('img[src="x"]').count()===0,'Search text never becomes executable markup');
  await page.getByRole('button',{name:'Limpar filtros'}).click();
  check(await search.inputValue()===''&&await year.inputValue()==='','Clear resets both inputs');
  check(!new URL(page.url()).searchParams.has('q')&&!new URL(page.url()).searchParams.has('year'),'Clear removes filter query parameters');
  check(await cycles.filter({visible:true}).count()===data.collections.length,'Clear restores every collection');
  check(await search.evaluate(e=>e===document.activeElement),'Clear returns focus to search');
  await year.selectOption('2020');await search.fill('marco');
  check(await page.locator('[data-service-entry]:visible').count()===2,'Collection month is searchable without accent');
  await page.goto(base+route+'?year=1900');
  check(await year.inputValue()===''&&await cycles.filter({visible:true}).count()===data.collections.length,'Invalid year falls back to all collections');
  const urls=await page.locator('.service-record').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
  check(JSON.stringify(urls)===JSON.stringify(entries.map(e=>e.url)),'Every video destination and timestamp preserved in source order');
  check(await page.locator('.service-record[target="_blank"][rel="noopener noreferrer"]').count()===entries.length,'External tabs isolate opener/referrer');
  check(await page.locator('iframe,object,embed').count()===0,'No automatic embedded video');
  check(await page.locator('meta[name="robots"]').getAttribute('content')==='noindex,nofollow','Review indexing policy preserved');
  const menu=page.locator('[data-menu-toggle]');await menu.click();
  check(await menu.getAttribute('aria-expanded')==='true','Mobile menu works on direct page');
  await page.keyboard.press('Escape');
  check(await menu.getAttribute('aria-expanded')==='false','Mobile menu closes with Escape');
  check(await page.locator('.site-nav a,.site-footer a').evaluateAll((links,route)=>links.every(a=>!a.href.includes(route)),route),'Hidden page is absent from shared navigation/footer');
  await page.goto(base+'/');
  check(await page.locator(`a[href*="${route.slice(1)}"]`).count()===0,'Home has no link to services archive');
  await page.getByRole('link',{name:'Ir para a biblioteca de palestras',exact:true}).click();
  check(new URL(page.url()).pathname==='/static-site/biblioteca-de-palestras/','Existing public library link is unchanged');
  const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}});
  await noJS.route('**/*',fulfill);
  try {
    const fallback=await noJS.newPage();await fallback.goto(base+route);
    check(await fallback.locator('[data-service-entry]').count()===entries.length,'No JavaScript: complete archive remains in HTML');
    check(await fallback.locator('[data-services-filter]').isHidden(),'No JavaScript: inactive filters remain hidden');
    await fallback.locator('[data-services-cycle]').last().locator('summary').click();
    check(await fallback.locator('[data-services-cycle]').last().locator('.service-record').first().isVisible(),'No JavaScript: oldest collection opens natively');
    check(await fallback.getByRole('navigation',{name:'Navegação principal'}).isVisible(),'No JavaScript: navigation stays usable');
  } finally {await noJS.close();}
  for(const file of JSON.parse(fs.readFileSync(path.join(root,'docs/routes.json'),'utf8'))){
    if(file.path===route)continue;
    const html=fs.readFileSync(path.join(site,file.file),'utf8');
    if(html.includes('biblioteca-de-servicos-e-conferencias/'))failures.push('Unexpected inbound link from '+file.path);
  }
  check(thirdParty.length===0,'No third-party automatic requests');
  check(errors.length===0,'No browser/console errors');
} catch(error){failures.push('Runner: '+error.stack);}
finally {
  await context.close();await browser.close();
  const report={environment:'Installed Chrome, isolated offline fixture under /static-site/',checks:results.length,passed:results.filter(r=>r.passed).length,results,failures,thirdParty,errors};
  fs.writeFileSync(path.join(evidence,'services-browser-results.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({checks:report.checks,passed:report.passed,failures,thirdParty,errors},null,2));
}
if(failures.length)process.exitCode=1;
