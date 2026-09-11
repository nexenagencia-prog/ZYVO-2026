import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const css=await readFile(new URL('../app/gravacoes/gravacoes.css',import.meta.url),'utf8');

test('recordings lower rails are intentionally staggered',()=>{
  assert.match(css,/\.recordings-stage > \.recordings-rail:nth-of-type\(1\)\{[^}]*padding-left:/);
  assert.match(css,/\.recordings-stage > \.recordings-rail:nth-of-type\(2\)\{[^}]*padding-left:/);
});

test('featured carousel keeps a dominant center card and narrow side cards',()=>{
  assert.match(css,/\.recordings-featured-card\{[^}]*flex:0 0 min\(24vw,330px\)/);
  assert.match(css,/\.recordings-featured-card\.is-active\{[^}]*flex-basis:min\(62vw,900px\)/);
});
