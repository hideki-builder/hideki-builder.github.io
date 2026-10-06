import {readFile,readdir,stat} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
async function walk(dir){const result=[];for(const name of await readdir(dir)){if(name.startsWith('.')||['test-output','scripts'].includes(name))continue;const p=resolve(dir,name);if((await stat(p)).isDirectory())result.push(...await walk(p));else result.push(p)}return result}
const files=await walk(root),pages=files.filter(p=>p.endsWith('.html'));
const voidTags=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
for(const file of pages){
  const html=await readFile(file,'utf8');
  assert.match(html,/<!doctype html>/i);assert.match(html,/<html lang="en">/);
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length,1);
  assert.match(html,/<title>[^<]+<\/title>/);assert.match(html,/<meta name="description" content="[^"]+">/);
  assert.match(html,/name="viewport"/);assert.match(html,/id="main"/);
  const stack=[];
  for(const match of html.matchAll(/<(\/)?([a-z][a-z0-9-]*)\b[^>]*>/gi)){
    const tag=match[2].toLowerCase();if(voidTags.has(tag)||match[0].endsWith('/>'))continue;
    if(match[1])assert.equal(stack.pop(),tag,'Unbalanced tag in '+file);else stack.push(tag);
  }
  assert.equal(stack.length,0);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,'Duplicate ID');
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const href=match[1];if(href.startsWith('https://'))continue;
    assert.ok(!/^(?:javascript|http|mailto):/.test(href),'Unexpected link');
    const url=new URL(href,'https://hideki-builder.github.io/'+file.slice(root.length+1).replaceAll('\\','/'));
    let target=resolve(root,'.'+decodeURIComponent(url.pathname));
    if((await stat(target)).isDirectory())target=resolve(target,'index.html');
    const source=await readFile(target,'utf8');
    if(url.hash)assert.ok(source.includes('id="'+url.hash.slice(1)+'"'),'Missing fragment '+href);
  }
}
assert.ok(files.every(p=>!p.endsWith('CNAME')));
console.log('PASS: '+pages.length+' HTML pages, local links/fragments/assets, structural tags, unique IDs, SEO and accessibility landmarks.');
