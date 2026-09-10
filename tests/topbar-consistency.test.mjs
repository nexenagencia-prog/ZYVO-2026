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

test('AppTopbar preserves the Hero topbar structure and class names',async()=>{
  const topbar=await read('app/AppTopbar.tsx');
  for(const className of ['topbar','zyvo-brand','search-box','topnav','next-meeting','notification-button']){
    assert.ok(topbar.includes(className),`missing Hero class ${className}`);
  }
});

test('Contacts keeps the shared topbar above page content so links remain clickable',async()=>{
  const css=await read('app/contatos/contatos-favorites.css');
  assert.doesNotMatch(css,/\.contacts-content,.contacts-page>aside,.contacts-page>header\{position:relative;z-index:1\}/);
  assert.match(css,/\.contacts-page>header\.app-topbar\{[^}]*z-index:80/);
});
