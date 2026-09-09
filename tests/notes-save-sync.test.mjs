import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('saving a floating note closes the panel and broadcasts the saved card',()=>{
  const source=fs.readFileSync('app/FloatingNotes.tsx','utf8');
  assert.match(source,/zyvo:note-saved/);
  assert.match(source,/onClose\(\)/);
});

test('saving is local-first and does not wait for Supabase auth',()=>{
  const source=fs.readFileSync('app/FloatingNotes.tsx','utf8');
  const start=source.indexOf('const saveNote = async () =>');
  const end=source.indexOf('const openNote =',start);
  const save=source.slice(start,end);
  assert.ok(save.includes('writeGuestNotes'));
  assert.ok(save.indexOf('writeGuestNotes') < save.indexOf('supabase.auth.getUser'));
  assert.ok(save.indexOf('onClose()') < save.indexOf('supabase.auth.getUser'));
});

test('notes page listens for saved notes and inserts them instantly',()=>{
  const source=fs.readFileSync('app/anotacoes/page.tsx','utf8');
  assert.match(source,/zyvo:note-saved/);
  assert.match(source,/setNotes\(v=>\[note,\.\.\.v\.filter/);
});
