import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Anotações sidebar item navigates to fixed /anotacoes page',()=>{
  const source=fs.readFileSync('app/HomeClient.tsx','utf8');
  assert.match(source,/label==='Anotações'.*\/anotacoes/s);
  assert.doesNotMatch(source,/label==='Anotações'\)setNotesOpen\(true\)/);
});

test('fixed notes page includes three illustrative cards and saved notes support',()=>{
  assert.equal(fs.existsSync('app/anotacoes/page.tsx'),true);
  const source=fs.readFileSync('app/anotacoes/page.tsx','utf8');
  assert.match(source,/Planejamento Q4/);
  assert.match(source,/Reunião Comercial/);
  assert.match(source,/Estratégia de Marketing/);
  assert.match(source,/from\('notes'\)/);
  assert.match(source,/AppTopbar/);
});

test('guest users can save notes locally and see them in Anotações',()=>{
  const floating=fs.readFileSync('app/FloatingNotes.tsx','utf8');
  const page=fs.readFileSync('app/anotacoes/page.tsx','utf8');
  assert.match(floating,/zyvo:guest-notes/);
  assert.doesNotMatch(floating,/Entre na sua conta para salvar a anotação/);
  assert.match(page,/zyvo:guest-notes/);
});
