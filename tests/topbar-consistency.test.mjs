import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=(path)=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('Home and Contacts use the same AppTopbar component',async()=>{
  const [home,contacts]=await Promise.all([
    read('app/HomeClient.tsx'),
    read('app/contatos/page.tsx')
  ]);
  assert.match(home,/import AppTopbar from ['"]\.\/AppTopbar['"]/);
  assert.match(home,/<AppTopbar\b/);
  assert.match(contacts,/import AppTopbar from ['"]\.\.\/AppTopbar['"]/);
  assert.match(contacts,/<AppTopbar\b/);
});

test('AppTopbar preserves the Hero topbar structure and defaults to Hero positioning',async()=>{
  const topbar=await read('app/AppTopbar.tsx');
  for(const className of ['topbar','zyvo-brand','search-box','topnav','next-meeting','notification-button']){
    assert.ok(topbar.includes(className),`missing Hero class ${className}`);
  }
  assert.match(topbar,/floating=false/);
});

test('Recordings uses the Hero topbar spacing instead of a floating override',async()=>{
  const [page,css]=await Promise.all([
    read('app/gravacoes/page.tsx'),
    read('app/gravacoes/gravacoes.css')
  ]);
  assert.match(page,/<AppTopbar\s+floating=\{false\}/);
  assert.match(css,/\.recordings-content\{[^}]*padding:36px 52px 42px 154px/s);
});

test('Contacts keeps the shared topbar above page content so links remain clickable',async()=>{
  const css=await read('app/contatos/contatos-favorites.css');
  assert.doesNotMatch(css,/\.contacts-content,.contacts-page>aside,.contacts-page>header\{position:relative;z-index:1\}/);
  assert.match(css,/\.contacts-page>header\.app-topbar\{[^}]*z-index:9999!important/s);
});

test('Contacts search cannot overlap or intercept the top navigation',async()=>{
  const css=await read('app/contatos/contatos-favorites.css');
  assert.match(css,/\.contacts-page>header\.app-topbar \.search-box\{[^}]*width:420px!important;[^}]*max-width:420px!important;[^}]*pointer-events:none!important/s);
  assert.match(css,/\.contacts-page>header\.app-topbar \.topnav\{[^}]*position:relative!important;[^}]*z-index:10001!important;[^}]*pointer-events:auto!important/s);
});
