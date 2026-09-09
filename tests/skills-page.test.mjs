import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Skills route exists and preserves shared ZYVO chrome',()=>{
  const page=read('app/skills/page.tsx');
  assert.match(page,/AppSidebar/);
  assert.match(page,/AppTopbar/);
  assert.match(page,/Veja aqui o/);
  assert.match(page,/Comunicação/);
  assert.match(page,/Clareza/);
  assert.match(page,/Escuta/);
  assert.match(page,/Objetividade/);
  assert.match(page,/Perguntas/);
  assert.match(page,/Argumentação/);
  assert.match(page,/Condução/);
});

test('Skills layout is viewport-fitted and glass-styled',()=>{
  const css=read('app/skills/skills.css');
  assert.match(css,/height:\s*100vh/);
  assert.match(css,/overflow:\s*hidden/);
  assert.match(css,/backdrop-filter:\s*blur/);
  assert.match(css,/\.skills-top-grid/);
  assert.match(css,/\.skills-metrics/);
  assert.match(css,/\.skills-bottom-grid/);
});

test('Reference art asset is present',()=>{
  assert.equal(fs.existsSync(path.join(root,'public/skills-card.jpg')),true);
});
