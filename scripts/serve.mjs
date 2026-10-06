import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {dirname,resolve,relative,extname,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT??9163);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{
  try{
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(path.split('/').some(p=>p.startsWith('.')||['scripts','test-output'].includes(p))||path.includes('\\')){res.writeHead(404);res.end('Not found');return}
    let target=resolve(root,'.'+path);const rel=relative(root,target);
    if(rel.startsWith('..')||isAbsolute(rel)){res.writeHead(404);res.end('Not found');return}
    if((await stat(target)).isDirectory())target=resolve(target,'index.html');
    const data=await readFile(target);
    res.writeHead(200,{'Content-Type':types[extname(target)]??'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(resolve(root,'404.html')))}
}).listen(port,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+port));
