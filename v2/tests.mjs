import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build,projects} from './build.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const {pages,out}=build();
const sourceAssets=new Set(JSON.parse(fs.readFileSync(path.join(root,'v2/source-assets.json'),'utf8')));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const htmlFiles=walk(out).filter(f=>f.endsWith('.html'));
test('33 localized routes and an honest 404 are generated',()=>{assert.equal(pages,33);assert.equal(htmlFiles.length,34);});
test('every internal link, stylesheet, script and media resolves',()=>{
  for(const file of htmlFiles){const html=fs.readFileSync(file,'utf8');for(const m of html.matchAll(/(?:src|href|poster)="(\/[^"?#]*)(#[^"]*)?"/g)){
    const url=decodeURIComponent(m[1]), rel=url.slice(1), local=path.join(out,rel);
    if(url.endsWith('/'))assert.ok(fs.existsSync(path.join(local,'index.html')),`${file}: missing route ${url}`);
    else assert.ok(fs.existsSync(local)||sourceAssets.has(rel),`${file}: missing asset ${url}`);
    if(m[2]&&url.endsWith('/'))assert.ok(fs.readFileSync(path.join(local,'index.html'),'utf8').includes(`id="${m[2].slice(1)}"`),`${file}: missing anchor ${url+m[2]}`);
  }}
});
test('every page has one main heading, a language and a crawl block',()=>{
  for(const file of htmlFiles){const h=fs.readFileSync(file,'utf8');assert.equal((h.match(/<h1[ >]/g)||[]).length,1,file);assert.match(h,/<html lang="(?:es|en|it)">/);assert.match(h,/noindex,nofollow/);assert.ok(!h.includes('�'),`Encoding replacement in ${file}`);}
});
test('all eight projects retain every original gallery item in three languages',()=>{
  for(const lang of ['','en/','it/'])for(const p of projects){const h=fs.readFileSync(path.join(out,lang,'projects',p.slug,'index.html'),'utf8');for(const item of new Set([p.video||p.image,...p.gallery]))assert.ok(h.includes('/'+item),`${p.title}: ${item}`);for(const v of h.matchAll(/<video([^>]*)>/g)){assert.ok(v[1].includes('controls'));assert.ok(v[1].includes('playsinline'));assert.ok(!v[1].includes('autoplay'));}}
});
test('no reference branding, commercial copy or third-party project assets leak into output',()=>{
  for(const file of htmlFiles){const h=fs.readFileSync(file,'utf8');assert.doesNotMatch(h,/cancreativestudio|ccscreativestudio|We CAN|Pedí un deseo|Candela|Pöuse|Vondel/i);}
});
test('contact and brand links use the original assets and correct destinations',()=>{
  for(const file of htmlFiles){const h=fs.readFileSync(file,'utf8');assert.match(h,/\/assets\/logos\/Rob_negro\.svg/);assert.match(h,/\/assets\/logos\/Rob_blanco\.svg/);assert.match(h,/mailto:romadgcv@gmail.com/);assert.match(h,/wa.me\/393513848087/);assert.doesNotMatch(h,/wa.me\/3513848087/);}
});
