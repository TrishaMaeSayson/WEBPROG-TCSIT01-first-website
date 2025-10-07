function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

document.addEventListener("DOMContentLoaded", function() {
  const line = document.getElementById("typing-line");

  // Text blocks (supports HTML formatting)
  const textParts = [
    "The only 3 things that you can control are your",
    '<span class="word-thoughts">thoughts</span>, ' +
    '<span class="word-feelings">feelings</span>, ' +
    'and <span class="word-actions">actions</span>.'
  ];

  let partIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPart = textParts[partIndex];
    const plainText = currentPart.replace(/<[^>]*>?/gm, ''); // Strip tags for typing
    const displayText = plainText.substring(0, charIndex);

    // Apply formatting only after typing the line fully
    if (isDeleting) {
      line.textContent = displayText;
    } else {
      line.textContent = displayText;
    }

    if (!isDeleting && charIndex < plainText.length) {
      charIndex++;
      setTimeout(type, 50);
    } else if (!isDeleting && charIndex === plainText.length) {
      // When done typing this line
      if (partIndex === 1) {
        // Apply formatted HTML for the 2nd line
        line.innerHTML = textParts.join("<br>");
        setTimeout(() => { isDeleting = true; type(); }, 2500);
      } else {
        // Pause, then move to next line
        setTimeout(() => { partIndex++; charIndex = 0; type(); }, 500);
      }
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      line.textContent = line.textContent.substring(0, charIndex);
      setTimeout(type, 25);
    } else {
      // Restart after full delete
      isDeleting = false;
      partIndex = 0;
      charIndex = 0;
      line.textContent = "";
      setTimeout(type, 1000);
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

