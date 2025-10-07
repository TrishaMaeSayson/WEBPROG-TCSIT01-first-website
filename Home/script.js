function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  const typingText = document.getElementById("typing-text");

  const fullHTML = `
    The only 3 things that you can control are your <br>
    <span class="word-thoughts">thoughts</span>,
    <span class="word-feelings">feelings</span>,
    and <span class="word-actions">actions</span>.
  `;

  const plainText = fullHTML
    .replace(/<[^>]+>/g, "") // remove HTML tags
    .replace(/\s+/g, " ")
    .trim();

  let i = 0;
  const typingSpeed = 50; // ms per character
  const delayBetweenRepeats = 2000;

  function type() {
    if (i < plainText.length) {
      typingText.innerHTML = plainText.substring(0, i + 1);
      i++;
      setTimeout(type, typingSpeed);
    } else {
      // Once finished, show formatted HTML (colored spans)
      typingText.classList.add("fade-in");
      typingText.innerHTML = fullHTML;

      setTimeout(() => {
        typingText.classList.remove("fade-in");
        typingText.innerHTML = "";
        i = 0;
        setTimeout(type, 500);
      }, delayBetweenRepeats);
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

