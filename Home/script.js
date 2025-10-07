function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

document.addEventListener("DOMContentLoaded", function() {
  const el = document.getElementById("typing-text");
  const fullText = el.innerHTML; // keep formatting
  el.innerHTML = ""; // start empty

  let i = 0;
  let isDeleting = false;

  function typeEffect() {
    const textLength = fullText.length;

    if (!isDeleting && i < textLength) {
      el.innerHTML = fullText.slice(0, ++i);
      setTimeout(typeEffect, 40);
    } 
    else if (i === textLength) {
      setTimeout(() => { isDeleting = true; typeEffect(); }, 1500);
    } 
    else if (isDeleting && i > 0) {
      el.innerHTML = fullText.slice(0, --i);
      setTimeout(typeEffect, 20);
    } 
    else if (isDeleting && i === 0) {
      isDeleting = false;
      setTimeout(typeEffect, 1000);
    }
  }

  typeEffect();
});

(function () {
  const audio = document.getElementById('piano');
  const btn = document.getElementById('aboutPlayBtn');
  const icon = btn.querySelector('i');
  const bars = document.querySelectorAll('.music-visualizer span');

  if (!audio || !btn || bars.length === 0) return;

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
    bars.forEach(bar => bar.classList.remove('active'));
    btn.classList.remove('playing');
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      ctx.resume();
      audio.play().catch(err => console.warn('Play failed:', err));
      icon.classList.replace('fa-play', 'fa-pause');
      btn.setAttribute('aria-pressed', 'true');

      bars.forEach(bar => bar.classList.add('active'));
      btn.classList.add('playing');
      animateBars();

    } else {
      audio.pause();
      icon.classList.replace('fa-pause', 'fa-play');
      btn.setAttribute('aria-pressed', 'false');
      resetBars();
    }
  });

  audio.addEventListener('ended', () => {
    icon.classList.replace('fa-pause', 'fa-play');
    btn.setAttribute('aria-pressed', 'false');
    resetBars();
  });

  resetBars();
})();

