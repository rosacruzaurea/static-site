import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fs.realpathSync(path.join(path.dirname(fileURLToPath(import.meta.url)),'../site'));
const port=Number(process.env.PORT || 4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2'};
const csp="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
const server=http.createServer((req,res)=>{
 try {
  res.setHeader('Content-Security-Policy',csp);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end();return;}
  const parsed=new URL(req.url,'http://127.0.0.1');const decoded=decodeURIComponent(parsed.pathname);
  let filename=path.resolve(root,'.'+decoded);
  if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  if(fs.existsSync(filename)&&fs.statSync(filename).isDirectory()){
   if(!parsed.pathname.endsWith('/')){res.writeHead(308,{'Location':parsed.pathname+'/'+parsed.search});res.end();return;}
   filename=path.join(filename,'index.html');
  }
  if(!fs.existsSync(filename)){res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Página não encontrada.');return;}
  const actual=fs.realpathSync(filename);
  if(!actual.startsWith(root+path.sep)||!fs.statSync(actual).isFile()){res.writeHead(403);res.end();return;}
  const type=types[path.extname(filename)];if(!type){res.writeHead(404);res.end();return;}
  res.writeHead(200,{'Content-Type':type,'Content-Length':fs.statSync(actual).size,'Cache-Control':'no-store'});
  if(req.method==='HEAD'){res.end();return;}
  fs.createReadStream(actual).pipe(res);
 }catch{res.writeHead(400);res.end('Bad request');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Preview: http://127.0.0.1:${port} (loopback only)`));
