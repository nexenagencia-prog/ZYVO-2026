import test from 'node:test';
import assert from 'node:assert/strict';

test('analysis theme exposes the approved light-blue palette to every entry point',async()=>{
  const theme=await import('../app/analysis-theme.mjs');
  assert.equal(theme.analysisThemeClass('analysis-stage'),'analysis-stage analysis-theme');
  assert.deepEqual(theme.analysisThemeVars,{
    '--analysis-ink':'#0b1a31',
    '--analysis-panel-start':'rgba(235,245,252,.42)',
    '--analysis-panel-end':'rgba(194,215,231,.25)',
    '--analysis-progress-start':'#244562',
    '--analysis-progress-end':'#ffffff',
  });
});
