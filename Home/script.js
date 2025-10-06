function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

(function () {
  const audio = document.getElementById('piano');
  const btn = document.getElementById('aboutPlayBtn');
  const icon = btn.querySelector('i');
  const bars = document.querySelectorAll('.music-visualizer span');
  const visualizer = document.querySelector('.music-visualizer');

  if (!audio || !btn || bars.length === 0 || !visualizer) return;

  // Set up Web Audio API
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const src = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  src.connect(analyser);
  analyser.connect(ctx.destination);

  let animationId = null;

  function animateBars() {
    animationId = requestAnimationFrame(animateBars);
    analyser.getByteFrequencyData(dataArray);
    bars.forEach((bar, i) => {
      const height = (dataArray[i] / 255) * 30 + 4;
      bar.style.height = `${height}px`;
    });
  }

  function resetBars() {
    cancelAnimationFrame(animationId);
    bars.forEach(bar => {
      bar.style.height = '8px';
      bar.style.background = 'black';
    });
  }

  // Play/pause toggle
  btn.addEventListener('click', () => {
    if (audio.paused) {
      ctx.resume();
      audio.play().catch(err => console.warn('Play failed:', err));
      icon.classList.replace('fa-play', 'fa-pause');
      btn.setAttribute('aria-pressed', 'true');
      visualizer.classList.add('playing');

      // Start bar animation
      animateBars();

      // Change bar colors dynamically when playing
      bars.forEach((bar, i) => {
        const hue = 260 + i * 5; // purple-ish range
        bar.style.background = `hsl(${hue}, 30%, 60%)`;
      });

    } else {
      audio.pause();
      icon.classList.replace('fa-pause', 'fa-play');
      btn.setAttribute('aria-pressed', 'false');
      visualizer.classList.remove('playing');
      resetBars();
    }
  });

  // Reset when audio ends
  audio.addEventListener('ended', () => {
    icon.classList.replace('fa-pause', 'fa-play');
    btn.setAttribute('aria-pressed', 'false');
    visualizer.classList.remove('playing');
    resetBars();
  });
})();
