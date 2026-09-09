import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('notes carousel physically follows pointer drag and arrow motion',()=>{const page=fs.readFileSync('app/anotacoes/page.tsx','utf8');assert.match(page,/onPointerDown/);assert.match(page,/onPointerMove/);assert.match(page,/dragX/);assert.match(page,/animateMove/);assert.match(page,/requestAnimationFrame/)});
test('note cards open a large editor and support save/delete',()=>{const page=fs.readFileSync('app/anotacoes/page.tsx','utf8');assert.match(page,/selectedNote/);assert.match(page,/saveSelected/);assert.match(page,/deleteSelected/);assert.match(page,/notes-modal/);assert.match(page,/window\.confirm/)});
test('one exact hero sidebar component is reused on home and internal pages',()=>{const sidebar=fs.readFileSync('app/AppSidebar.tsx','utf8');const home=fs.readFileSync('app/HomeClient.tsx','utf8');const notes=fs.readFileSync('app/anotacoes/page.tsx','utf8');assert.match(sidebar,/className={`sidebar/);assert.match(sidebar,/avatar-wrap/);assert.match(sidebar,/side-nav/);assert.match(sidebar,/zyvo-profile-avatar/);assert.match(home,/import AppSidebar/);assert.match(home,/<AppSidebar/);assert.doesNotMatch(home,/<aside className={`sidebar/);assert.match(notes,/<AppSidebar/)});
