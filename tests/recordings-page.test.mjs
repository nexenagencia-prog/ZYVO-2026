import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pagePath='app/gravacoes/page.tsx';
const cssPath='app/gravacoes/gravacoes.css';
const sidebar=fs.readFileSync('app/AppSidebar.tsx','utf8');

test('sidebar opens recordings route',()=>{
  assert.match(sidebar,/label==='Gravações'.*router\.push\('\/gravacoes'\)/s);
  assert.match(sidebar,/label==='Gravações'\?pathname==='\/gravacoes'/s);
});

test('recordings page exposes editable gallery controls',()=>{
  const page=fs.readFileSync(pagePath,'utf8');
  assert.match(page,/zyvo-recordings/);
  assert.match(page,/Voltar ao menu/);
  assert.match(page,/Alterar miniatura/);
  assert.match(page,/Editar gravação/);
  assert.match(page,/Performance/);
  assert.match(page,/onPointerDown/);
  assert.match(page,/scrollLeft/);
  assert.match(page,/featuredItems/);
  assert.match(page,/recordings-featured-rail" loop/);
});

test('recordings rails move freely without snapping into columns',()=>{
  const css=fs.readFileSync(cssPath,'utf8');
  assert.doesNotMatch(css,/scroll-snap-type:\s*x mandatory/);
  assert.match(css,/\.recordings-featured-card/);
  assert.match(css,/\.recordings-rail/);
  assert.match(css,/\.recordings-row-one \.recordings-small-card:nth-child\(3n\+1\)/);
  assert.match(css,/\.recordings-row-two \.recordings-small-card:nth-child\(4n\+2\)/);
});
