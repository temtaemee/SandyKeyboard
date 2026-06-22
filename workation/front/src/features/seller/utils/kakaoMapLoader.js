let kakaoMapServicesPromise = null;

export function ensureKakaoMapServices() {
  const maps = window.kakao?.maps;

  if (!maps) {
    return Promise.reject(new Error('Kakao Maps SDK is not loaded'));
  }

  if (maps.services?.Geocoder) {
    return Promise.resolve();
  }

  if (kakaoMapServicesPromise) {
    return kakaoMapServicesPromise;
  }

  if (typeof maps.load !== 'function') {
    return Promise.reject(new Error('Kakao Maps services library is not loaded'));
  }

  kakaoMapServicesPromise = new Promise((resolve, reject) => {
    maps.load(() => {
      if (maps.services?.Geocoder) {
        resolve();
        return;
      }

      kakaoMapServicesPromise = null;
      reject(new Error('Kakao Maps services library is not loaded'));
    });
  });

  return kakaoMapServicesPromise;
}

export async function geocodeAddress(address) {
  await ensureKakaoMapServices();

  return new Promise((resolve, reject) => {
    const { maps } = window.kakao;
    const geocoder = new maps.services.Geocoder();

    geocoder.addressSearch(address, (results, status) => {
      if (status !== maps.services.Status.OK || !results?.[0]) {
        reject(new Error('Address geocoding failed'));
        return;
      }

      const { y: lat, x: lng } = results[0];
      resolve({ lat, lng });
    });
  });
}
