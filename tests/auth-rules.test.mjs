import test from 'node:test';
import assert from 'node:assert/strict';
import { isAdminEmail, safeNextPath } from '../lib/cms/auth.mjs';

test('only the approved CMS admin email is accepted', () => {
  assert.equal(isAdminEmail('sandrobellomind@gmail.com'), true);
  assert.equal(isAdminEmail('SANDROBELLOMIND@GMAIL.COM'), true);
  assert.equal(isAdminEmail('outro@gmail.com'), false);
});

test('callback next path cannot escape the site', () => {
  assert.equal(safeNextPath('/cms/reset-password'), '/cms/reset-password');
  assert.equal(safeNextPath('https://evil.example'), '/cms');
  assert.equal(safeNextPath('//evil.example'), '/cms');
});
