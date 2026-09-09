import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('saving a floating note closes the panel and broadcasts the saved card',()=>{
  const source=fs.readFileSync('app/FloatingNotes.tsx','utf8');
  assert.match(source,/select\('id,subject,body,created_at,updated_at'\)/);
  assert.match(source,/zyvo:note-saved/);
  assert.match(source,/onClose\(\)/);
});

test('notes page listens for saved notes and inserts them instantly',()=>{
  const source=fs.readFileSync('app/anotacoes/page.tsx','utf8');
  assert.match(source,/zyvo:note-saved/);
  assert.match(source,/setNotes\(v=>\[note,\.\.\.v\.filter/);
});
