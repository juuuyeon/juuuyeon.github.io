import test from 'node:test';
import assert from 'node:assert/strict';
import {shouldPublishAsset} from './public-asset-policy.mjs';

test('omits private original archives and every nested asset', () => {
  for (const name of ['jnj-game', 'yeosu-admin-original', 'yeosu-guide-original']) {
    for (const suffix of ['', '.html', '.json', '.pdf', '/01.jpg', '/01.jpg.webp', '/nested/screen.png', '/nested/screen.png.webp']) {
      const asset = `resources/${name}${suffix}`;
      assert.equal(shouldPublishAsset(asset), false, asset);
      assert.equal(shouldPublishAsset('/' + asset), false, '/' + asset);
    }
  }
});

test('omits generated operational viewers that can duplicate contact screens', () => {
  for (const name of ['yeosu-admin', 'yeosu-guide', 'yeosu-demo']) {
    for (const extension of ['html', 'pdf']) {
      const asset = `resources/${name}.${extension}`;
      assert.equal(shouldPublishAsset(asset), false, asset);
    }
  }
});

test('retains only the two explicitly reviewed non-contact admin previews', () => {
  for (const name of ['2001-20906', '2001-21873']) {
    for (const extension of ['jpg', 'jpg.webp']) {
      const asset = `resources/yeosu-admin-original/${name}.${extension}`;
      assert.equal(shouldPublishAsset(asset), true, asset);
    }
  }
  for (const asset of [
    'resources/yeosu-admin-original/2001-25357.jpg',
    'resources/yeosu-admin-original/2001-25357.jpg.webp',
    'resources/yeosu-admin-original/nested/2001-20906.jpg',
    'resources/yeosu-admin-original/2001-20906.pdf',
  ]) assert.equal(shouldPublishAsset(asset), false, asset);
});

test('normalizes leading URL slashes and Windows file separators', () => {
  assert.equal(shouldPublishAsset('\\\\resources\\\\jnj-game\\\\01.jpg'), false);
  assert.equal(shouldPublishAsset('/resources/yeosu-admin-original/2001-20906.jpg'), true);
});

test('preserves unrelated project assets and similarly named paths', () => {
  for (const asset of [
    'work/p015-2.png',
    '/case-assets/p017-2.png',
    'resources/yeosu-web-ko.html',
    'resources/yeosu-web-ko/2001-20906.jpg',
    'resources/yeosu-ia.pdf',
    'resources/jnj-game-extra.html',
    'resources/jnj-game-extra/01.jpg',
    'resources/yeosu-admin-original-notes.html',
    'resources/yeosu-guide-original-notes/01.jpg',
    'resources/yeosu-demo-preview.html',
    'editions/portfolio-20261106.pdf',
    'fonts/PretendardVariable.woff2',
  ]) assert.equal(shouldPublishAsset(asset), true, asset);
});
