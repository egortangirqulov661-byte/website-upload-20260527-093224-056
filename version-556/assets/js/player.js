import { H as Hls } from './hls-dru42stk.js';

function attachHls(video, source) {
  if (!source || video.dataset.playerAttached === '1') {
    return;
  }

  video.dataset.playerAttached = '1';

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    return;
  }

  if (Hls && Hls.isSupported && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    return;
  }

  video.src = source;
}

function initializePlayer(box) {
  const video = box.querySelector('video[data-hls-src]');

  if (!video) {
    return;
  }

  attachHls(video, video.dataset.hlsSrc);
  box.classList.add('is-ready');

  const promise = video.play();

  if (promise && typeof promise.catch === 'function') {
    promise.catch(function () {
      video.controls = true;
    });
  }
}

document.querySelectorAll('.player-box').forEach(function (box) {
  const overlay = box.querySelector('.player-overlay');
  const video = box.querySelector('video[data-hls-src]');

  if (overlay) {
    overlay.addEventListener('click', function () {
      initializePlayer(box);
    });
  }

  if (video) {
    video.addEventListener('play', function () {
      initializePlayer(box);
    }, { once: true });
  }
});
