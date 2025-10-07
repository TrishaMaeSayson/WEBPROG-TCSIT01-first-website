function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

document.addEventListener("DOMContentLoaded", function () {
  const typingText = document.getElementById("typing-text");
  const phrases = [
    "The only 3 things that you can control are your",
    "thoughts,",
    "feelings,",
    "and actions."
  ];

  let currentPhrase = 0;
  let currentChar = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[currentPhrase];
    const speed = isDeleting ? 40 : 70;

    typingText.classList.add("typing");
    typingText.innerHTML =
      current.substring(0, currentChar) +
      (currentPhrase === 1
        ? '<span class="word-thoughts">thoughts</span>'
        : currentPhrase === 2
        ? '<span class="word-feelings">feelings</span>'
        : currentPhrase === 3
        ? '<span class="word-actions">actions</span>'
        : "");

    if (!isDeleting && currentChar < current.length) {
      currentChar++;
      setTimeout(type, speed);
    } else if (currentChar === current.length && !isDeleting) {
      // Pause before deleting
      setTimeout(() => {
        isDeleting = true;
        setTimeout(type, 600);
      }, 1200);
    } else if (isDeleting && currentChar > 0) {
      currentChar--;
      setTimeout(type, speed / 2);
    } else {
      // Move to next phrase
      isDeleting = false;
      currentPhrase = (currentPhrase + 1) % phrases.length;
      setTimeout(type, 800);
    }
  }

  type();
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

