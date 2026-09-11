import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=(path)=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('npm run dev uses the localhost auto-sync runner',async()=>{
  const pkg=JSON.parse(await read('package.json'));
  assert.equal(pkg.scripts.dev,'node scripts/dev-sync.mjs');
});

test('dev auto-sync pulls the dev branch while Next is running',async()=>{
  const sync=await read('scripts/dev-sync.mjs');
  assert.match(sync,/git/);
  assert.match(sync,/pull/);
  assert.match(sync,/--ff-only/);
  assert.match(sync,/origin/);
  assert.match(sync,/dev/);
  assert.match(sync,/next/);
});
