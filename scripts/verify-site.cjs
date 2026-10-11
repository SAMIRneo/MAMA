const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {courses}=require('../formations.js');
const root=path.resolve(__dirname,'..'),site='https://samirneo.github.io/MAMA/';
const pages=['index.html',...Object.values(courses).map(c=>`formations/${c.slug}/index.html`)];
for(const page of pages){
 const html=fs.readFileSync(path.join(root,page),'utf8');
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${page}: un seul h1`);
 assert.match(html,/<html lang="fr">/);assert.match(html,/<meta name="description" content="[^"]{60,230}">/);
 const canonical=page==='index.html'?site:site+page.replace('index.html','');assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`${page}: identifiants uniques`);
 const json=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);const schema=JSON.parse(json[1]);assert.equal(schema['@context'],'https://schema.org');
 assert.ok(!html.includes('AggregateRating')&&!html.includes('aggregateRating'),'Aucun avis inventé');
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=m[1];if(/^(https?:|data:|mailto:)/.test(href))continue;
  const [raw,hash]=href.split('#');const targetPath=raw.split('?')[0];
  const resolved=targetPath?path.resolve(path.dirname(path.join(root,page)),targetPath):path.join(root,page);
  const file=fs.existsSync(resolved)&&fs.statSync(resolved).isDirectory()?path.join(resolved,'index.html'):resolved;
  assert.ok(fs.existsSync(file),`${page}: cible manquante ${href}`);
  if(hash){const target=fs.readFileSync(file,'utf8');assert.ok(target.includes(`id="${hash}"`),`${page}: ancre manquante ${href}`);}
 }
 console.log(`${page} : structure, SEO, JSON-LD, liens et ressources OK`);
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/<loc>/g)||[]).length,4);assert.ok(fs.existsSync(path.join(root,'assets/boum-partage.png')));
console.log('Sitemap et image de partage : OK');
