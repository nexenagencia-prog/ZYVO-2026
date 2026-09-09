import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const page=fs.readFileSync(new URL('../app/skills/page.tsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../app/skills/skills.css',import.meta.url),'utf8');

test('Skills uses the supplied page background artwork',()=>{
  assert.match(css,/skills-page[^}]*background-image:\s*url\(['"]?\/skills-page-bg\.png/);
});

test('important moments use rectangular video thumbnails',()=>{
  assert.match(page,/skills-video-thumb/);
  assert.match(css,/\.skills-video-thumb\{/);
});

test('performance card includes faithful light effect and analysis CTA',()=>{
  assert.match(page,/Ver análise completa/);
  assert.match(css,/\.skills-score-card:before/);
  assert.match(css,/filter:blur/);
});

test('Skills typography and icons are refined and small',()=>{
  assert.match(css,/font-weight:2\d\d/);
  assert.match(css,/\.skills-metric-label svg\{[^}]*width:1[234]px/);
});
