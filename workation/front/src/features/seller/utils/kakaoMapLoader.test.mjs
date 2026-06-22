import assert from 'node:assert/strict';
import { ensureKakaoMapServices } from './kakaoMapLoader.js';

async function testLoadsServicesBeforeResolving() {
  let loadCalled = false;

  globalThis.window = {
    kakao: {
      maps: {
        load(callback) {
          loadCalled = true;
          setTimeout(() => {
            globalThis.window.kakao.maps.services = {
              Geocoder: function Geocoder() {},
              Status: { OK: 'OK' },
            };
            callback();
          }, 0);
        },
      },
    },
  };

  await ensureKakaoMapServices();

  assert.equal(loadCalled, true);
  assert.equal(typeof globalThis.window.kakao.maps.services.Geocoder, 'function');
}

async function testRejectsWhenSdkIsMissing() {
  globalThis.window = {};

  await assert.rejects(
    () => ensureKakaoMapServices(),
    /Kakao Maps SDK is not loaded/,
  );
}

await testLoadsServicesBeforeResolving();
await testRejectsWhenSdkIsMissing();

delete globalThis.window;
