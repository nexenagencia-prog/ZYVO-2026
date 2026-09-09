import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePercentage, validatePassword, validateImage } from '../lib/cms/validation.mjs';

test('percentage accepts 0..100 only', () => {
  assert.equal(validatePercentage(69), 69);
  assert.equal(validatePercentage('82'), 82);
  assert.throws(() => validatePercentage(101));
  assert.throws(() => validatePercentage(-1));
});

test('password requires 12+ chars and matching confirmation', () => {
  assert.throws(() => validatePassword('short', 'short'));
  assert.throws(() => validatePassword('LongEnough123!', 'different'));
  assert.equal(validatePassword('LongEnough123!', 'LongEnough123!'), 'LongEnough123!');
});

test('images are JPEG, PNG or WebP and at most 10 MB', () => {
  assert.equal(validateImage({type:'image/webp',size:1024}), true);
  assert.throws(() => validateImage({type:'image/gif',size:1024}));
  assert.throws(() => validateImage({type:'image/png',size:11*1024*1024}));
});
