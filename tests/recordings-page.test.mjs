import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pagePath='app/gravacoes/page.tsx';
const cssPath='app/gravacoes/gravacoes.css';
const sidebar=fs.readFileSync('app/AppSidebar.tsx','utf8');

test('sidebar opens recordings route',()=>{
  assert.match(sidebar,/label==='Gravações'.*router\.push\('\/gravacoes'\)/s);
  assert.match(sidebar,/label==='Gravações'\?pathname==='\/gravacoes'/s);
});

test('recordings page exposes editable gallery controls',()=>{
  const page=fs.readFileSync(pagePath,'utf8');
  assert.match(page,/zyvo-recordings/);
  assert.doesNotMatch(page,/Voltar ao menu/);
  assert.match(page,/Alterar miniatura/);
  assert.match(page,/Editar gravação/);
  assert.match(page,/Performance/);
  assert.match(page,/Linha 1 do título/);
  assert.match(page,/Linha 2 do título/);
  assert.match(page,/Cor da linha 1/);
  assert.match(page,/Cor da linha 2/);
  assert.match(page,/featured-title-line-one/);
  assert.match(page,/featured-title-line-two/);
  assert.match(page,/featuredItems/);
});

test('recordings rails move freely and featured cards all use the highlighted rectangle size',()=>{
  const css=fs.readFileSync(cssPath,'utf8');
  assert.doesNotMatch(css,/scroll-snap-type:\s*x mandatory/);
  assert.match(css,/\.recordings-featured-card\{[^}]*flex:0 0 min\(62vw,900px\)/s);
  assert.doesNotMatch(css,/\.recordings-featured-card\.is-active\{[^}]*flex-basis:/s);
  assert.match(css,/\.recordings-row-one \.recordings-small-card:nth-child\(3n\+1\)/);
  assert.match(css,/\.recordings-row-two \.recordings-small-card:nth-child\(4n\+2\)/);
});

test('analyze action stores selection and navigates directly to meeting analysis',()=>{
  const page=fs.readFileSync(pagePath,'utf8');
  assert.match(page,/const SELECTED_KEY='zyvo-selected-analysis'/);
  assert.match(page,/localStorage\.setItem\(SELECTED_KEY,JSON\.stringify\(item\)\)/);
  assert.match(page,/router\.push\(`\/analise-reunioes\?analysis=\$\{encodeURIComponent\(item\.id\)\}`\)/);
  assert.doesNotMatch(page,/SelectedRecordingAnalysisBridge/);
});

test('analysis route is a dedicated page instead of a simulated Skills click',()=>{
  const route=fs.readFileSync('app/analise-reunioes/page.tsx','utf8');
  assert.match(route,/AnalysisPageClient/);
  assert.doesNotMatch(route,/OpenAnalysisOnMount/);
  assert.doesNotMatch(route,/SkillsPage/);
});
