/** Optional browser checks. Requires an existing Playwright installation and an authorized CDP browser.
 *  Fully offline fixture: no public site or private HTTP endpoint is requested by pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const modulePath=process.env.PLAYWRIGHT_MODULE;
if(!modulePath||!process.env.CDP_URL)throw new Error('Set PLAYWRIGHT_MODULE and CDP_URL to existing authorized tooling.');
const {chromium}=await import(pathToFileURL(modulePath));
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const site=path.join(root,'site');const evidence=path.join(root,'evidence');fs.mkdirSync(evidence,{recursive:true});
const data=JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8'));
const browser=await chromium.connectOverCDP(process.env.CDP_URL,{timeout:20000});
const context=await browser.newContext({viewport:{width:1365,height:900},locale:'pt-BR',timezoneId:'America/Sao_Paulo'});
const base='https://static-site.test';const failures=[];const blocked=[];const consoleErrors=[];const results=[];
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const fulfill=async route=>{
 const u=new URL(route.request().url());
 if(u.origin!==base){blocked.push(u.origin);await route.abort();return;}
 let file=path.resolve(site,'.'+decodeURIComponent(u.pathname));
 if(!file.startsWith(site+path.sep)&&file!==site){await route.fulfill({status:403,body:''});return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){failures.push('Missing fixture: '+u.pathname);await route.fulfill({status:404,body:''});return;}
 await route.fulfill({status:200,contentType:types[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});
};
await context.route('**/*',fulfill);
const page=await context.newPage();page.on('pageerror',error=>consoleErrors.push(error.message));page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
const check=(value,description)=>{results.push({description,passed:Boolean(value)});if(!value)failures.push(description);};
try{
 const representatives=['/','/sobre/','/enderecos/','/biblioteca-de-palestras/','/carta-aberta-aos-buscadores-da-verdade/','/politica-de-privacidade/',data.articles[0].path,data.locations[5].path];
 for(const width of [1365,390,320]){
  await page.setViewportSize({width,height:900});
  for(const route of representatives){
   await page.goto(base+route,{waitUntil:'load'});
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),h1:document.querySelectorAll('h1').length}));
   check(!state.overflow,`${width}px ${route}: no horizontal overflow`);
   check(!state.brokenImages.length,`${width}px ${route}: no failed loaded images`);
   check(state.h1===1,`${width}px ${route}: one h1`);
   if([1365,390].includes(width)&&['/','/biblioteca-de-palestras/','/enderecos/'].includes(route)){
    await page.evaluate(async()=>{for(const img of document.images){if(!img.closest('[hidden]')){img.loading='eager';await img.decode().catch(()=>{});}}});
    await page.screenshot({path:path.join(evidence,(route==='/'?'home':route.split('/')[1])+'-'+width+'.png'),fullPage:true});
   }
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/');
 const menu=page.locator('[data-menu-toggle]');await menu.click();
 check(await menu.getAttribute('aria-expanded')==='true','Mobile menu opens');
 await page.keyboard.press('Escape');check(await menu.getAttribute('aria-expanded')==='false','Escape closes menu');
 check(await menu.evaluate(el=>el===document.activeElement),'Menu focus restored');
 await menu.click();await page.getByRole('navigation',{name:'Navegação principal'}).getByRole('link',{name:'Biblioteca',exact:true}).click();
 check(new URL(page.url()).pathname==='/biblioteca-de-palestras/','Mobile menu navigation');
 const search=page.getByRole('searchbox');await search.fill('monada');
 check(await page.locator('[data-search]:visible').count()===1,'Library search ignores accents');
 await search.fill('<img src=x onerror=alert(1)>');
 check(await page.locator('[data-search]:visible').count()===0,'Library empty state on unmatched input');
 check(await page.locator('[data-empty]').isVisible(),'Library empty-state message visible');
 check(await page.locator('img[src="x"]').count()===0,'Search input is not interpreted as HTML');
 await page.getByRole('button',{name:'Limpar filtros'}).click();
 check(await page.locator('[data-search]:visible').count()===data.articles.length,'Clear restores complete library');
 await page.getByLabel('Tema',{exact:true}).selectOption('harmonia');
 check(await page.locator('[data-search]:visible').count()===data.articles.filter(a=>a.categories.includes('harmonia')).length,'Library category filter');
 await page.reload();check(await page.getByLabel('Tema',{exact:true}).inputValue()==='harmonia','Filter persists in URL on reload');
 await page.goto(base+'/enderecos/');await page.getByRole('searchbox').fill('sao paulo');
 check(await page.locator('[data-search]:visible').count()>=1,'Directory search ignores accents');
 await page.getByRole('button',{name:'Limpar filtros'}).click();await page.getByLabel('Estado',{exact:true}).selectOption('ceara');
 check(await page.locator('[data-search]:visible').count()===3,'Directory state filter');
 await page.getByRole('searchbox').fill('zzzzxx');check(await page.locator('[data-empty]').isVisible(),'Directory empty state');
 await page.goto(base+'/');await page.getByRole('button',{name:'Próximo destaque'}).click();
 check(await page.locator('[data-slide]:visible h2').textContent()==='Compreenda','Carousel next');
 await page.getByRole('button',{name:'Destaque anterior'}).click();
 check(await page.locator('[data-slide]:visible h2').textContent()==='Desperte','Carousel previous');
 await page.getByRole('button',{name:'Mostrar Transforme'}).click();
 check(await page.locator('[data-slide]:visible h2').textContent()==='Transforme','Carousel direct navigation');
 await page.keyboard.press('ArrowRight');check(await page.locator('[data-slide]:visible h2').textContent()==='Desperte','Carousel keyboard wrap');
 check(await page.locator('[data-event-end]').count()===3,'Home includes three real events');
 await page.getByRole('link',{name:'Comece a sua jornada'}).click();
 check(new URL(page.url()).pathname==='/autoconhecimento-e-espiritualidade/','Primary call to action navigation');
 check(await page.getByRole('link',{name:'Quero meu acesso gratuito'}).getAttribute('href')===data.signupUrl,'Signup uses official destination');
 check(await page.locator('input').count()===0,'Signup does not collect data locally');
 await page.goto(base+data.articles[0].path);
 check((await page.getByRole('link',{name:'Assistir à palestra no YouTube'}).getAttribute('href')).includes(data.articles[0].videos[0]),'Video destination preserved');
 check(await page.locator('iframe').count()===0,'No implicit video embed');
 check(blocked.length===0,'No third-party automatic requests');
 check(consoleErrors.length===0,'No JavaScript or console errors');
 await context.setOffline(true);await page.goto(base+'/biblioteca-de-palestras/');
 check(await page.locator('h1').innerText()==='Biblioteca de Palestras','Offline fixture readable');
 const noJS=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 await noJS.route('**/*',fulfill);
 try{
  const fallback=await noJS.newPage();await fallback.goto(base+'/biblioteca-de-palestras/');
  check(await fallback.locator('[data-search]:visible').count()===data.articles.length,'No JavaScript: entire library readable');
  check(await fallback.getByRole('navigation',{name:'Navegação principal'}).isVisible(),'No JavaScript: mobile navigation visible');
  check(await fallback.locator('[data-filter-form]:visible').count()===0,'No JavaScript: inactive filters are not shown');
  await fallback.getByRole('link',{name:'Endereços',exact:true}).click();
  check(await fallback.locator('[data-search]:visible').count()===data.locations.length,'No JavaScript: directory accessible');
 }finally{await noJS.close();}
}catch(error){failures.push('Runner: '+error.message);
}finally{
 await context.close();await browser.close();
 fs.writeFileSync(path.join(evidence,'browser-results.json'),JSON.stringify({fixture:'Offline HTML/CSS/JS served in-memory; not a deployed site',browser:'Installed Google Chrome via authorized CDP; new isolated context',results,failures,consoleErrors,blocked},null,2)+'\n');
 console.log(JSON.stringify({checks:results.length,passed:results.filter(x=>x.passed).length,failures,consoleErrors,blocked},null,2));
}
if(failures.length)process.exitCode=1;
