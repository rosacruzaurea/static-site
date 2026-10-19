import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const site=path.join(root,'site');
const routes=JSON.parse(fs.readFileSync(path.join(root,'docs/routes.json'),'utf8'));
const failures=[];let references=0;
const assert=(condition,message)=>{if(!condition)failures.push(message);};
for(const route of routes){
 const filename=path.join(site,route.file);const html=fs.readFileSync(filename,'utf8');
 assert((html.match(/<h1(?:\s|>)/g)||[]).length===1,route.path+': exactly one h1');
 assert(html.includes('<html lang="pt-BR">'),route.path+': language');
 assert(html.includes('name="robots" content="noindex,nofollow"'),route.path+': review-only indexing');
 assert(!/<(?:iframe|object|embed)\b/i.test(html),route.path+': no automatic embeds');
 assert(!/\son\w+\s*=|javascript:|<script(?![^>]*src=)/i.test(html),route.path+': no inline executable content');
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert(ids.length===new Set(ids).size,route.path+': duplicate IDs');
 for(const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)){
  const value=match[1];
  if(/^(https:\/\/|mailto:|tel:)/.test(value))continue;
  assert(!value.startsWith('http://'),route.path+': insecure URL');
  const [url,fragment]=value.split('#');
  let target=url?path.resolve(path.dirname(filename),url.split('?')[0]):filename;
  assert(target===site||target.startsWith(site+path.sep),route.path+': local path outside site');
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert(fs.existsSync(target),route.path+': missing '+value);
  if(fragment && fs.existsSync(target))assert(fs.readFileSync(target,'utf8').includes(`id="${fragment}"`),route.path+': broken fragment '+value);
  references++;
 }
 assert(!/Lorem ipsum|Título do slide|\[email protected\]/i.test(html),route.path+': placeholder content');
 assert(!/(?:github_pat_|ghp_)[A-Za-z0-9_]{20,}|-----BEGIN [^-]*PRIVATE KEY-----/.test(html),route.path+': credential pattern');
}
const data=JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8'));
assert(data.articles.every(a=>a.body.length>100&&a.videos.length>0),'article body/video migration');
assert(data.events.length===3,'October source program has three events');
assert(data.locations.every(l=>l.groups.some(g=>g.heading==='Endereço'&&g.lines.length)),'address presence');
const report={pages:routes.length,localReferences:references,articles:data.articles.length,locations:data.locations.length,failures};
console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;
