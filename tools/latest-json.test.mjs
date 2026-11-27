import assert from 'node:assert/strict';
import { test } from 'node:test';
import { latestJson } from './latest-json.mjs';

test('latest.json con la firma y la dirección del instalador de esa versión', () => {
  const j = latestJson({ version: '1.2.0', firma: 'dW50cnVzdGVk\n', repo: 'Jgavino/farmy-desktop-descargas', notas: '', fecha: new Date('2026-11-27T04:30:00.123Z') });
  assert.deepEqual(j, {
    version: '1.2.0',
    notes: 'Farmy 1.2.0 para Windows.',
    pub_date: '2026-11-27T04:30:00Z',
    platforms: {
      'windows-x86_64': {
        signature: 'dW50cnVzdGVk',
        url: 'https://github.com/Jgavino/farmy-desktop-descargas/releases/download/v1.2.0/Farmy_1.2.0_x64-setup.exe',
      },
    },
  });
});

test('las notas se usan tal cual', () => {
  assert.equal(latestJson({ version: '1.2.1', firma: 'x', repo: 'a/b', notas: '  Impresión más rápida ' }).notes, 'Impresión más rápida');
});
