import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('notes page uses an infinite carousel with a highlighted center card',()=>{
  const page=fs.readFileSync('app/anotacoes/page.tsx','utf8');
  assert.match(page,/notes-carousel/);
  assert.match(page,/activeIndex/);
  assert.match(page,/carouselCards/);
});

test('notes page keeps the ZYVO sidebar visible',()=>{
  const page=fs.readFileSync('app/anotacoes/page.tsx','utf8');
  assert.match(page,/AppSidebar/);
});
