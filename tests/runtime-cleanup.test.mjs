import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const legacyFiles=[
  'app/HeroSlidePhotoEnhancer.tsx',
  'app/SelectedRecordingAnalysisBridge.tsx',
  'app/AnalysisVideoControls.tsx',
  'app/analise-reunioes/OpenAnalysisOnMount.tsx',
];

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())return walk(full);
    return /\.(ts|tsx)$/.test(entry.name)?[full]:[];
  });
}

test('legacy runtime enhancers are removed',()=>{
  for(const file of legacyFiles)assert.equal(fs.existsSync(file),false,`${file} should be removed`);
});

test('runtime code contains no MutationObserver',()=>{
  for(const file of walk('app')){
    const source=fs.readFileSync(file,'utf8');
    assert.doesNotMatch(source,/\bMutationObserver\b/,`${file} still uses MutationObserver`);
  }
});

test('root layout stays minimal and does not mount removed enhancers',()=>{
  const layout=fs.readFileSync('app/layout.tsx','utf8');
  assert.doesNotMatch(layout,/HeroSlidePhotoEnhancer|SelectedRecordingAnalysisBridge|AnalysisVideoControls/);
});
