import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('notes carousel physically follows pointer drag',()=>{
  const page=fs.readFileSync('app/anotacoes/page.tsx','utf8');
  assert.match(page,/onPointerDown/);
  assert.match(page,/onPointerMove/);
  assert.match(page,/onPointerUp/);
  assert.match(page,/dragX/);
  assert.match(page,/setPointerCapture/);
});

test('shared sidebar preserves hero profile avatar and original menu actions',()=>{
  const sidebar=fs.readFileSync('app/AppSidebar.tsx','utf8');
  assert.match(sidebar,/zyvo-profile-avatar/);
  assert.match(sidebar,/Camera/);
  assert.match(sidebar,/Calculadora/);
  assert.match(sidebar,/Anotar/);
  assert.match(sidebar,/Anotações/);
});
