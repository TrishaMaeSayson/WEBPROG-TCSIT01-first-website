window.addEventListener('scroll', () => {
  let fromTop = window.scrollY + 200; // offset for fixed sidebar
  document.querySelectorAll('.nav-link').forEach(link => {
    let section = document.querySelector(link.getAttribute('href'));
    if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const text1 = "The only 3 things that you can control are your";
  const words = {
    thoughts: "thoughts,",
    feelings: "feelings,",
    actions: "& actions."
  };

  const typingText = document.getElementById("typing-text");
  const spans = {
    thoughts: document.getElementById("thoughts"),
    feelings: document.getElementById("feelings"),
    actions: document.getElementById("actions")
  };

  let i = 0;
  let phase = "line1";

  function type() {
    if (phase === "line1") {
      typingText.firstChild.textContent = text1.substring(0, i);
      i++;
      if (i <= text1.length) {
        setTimeout(type, 40);
      } else {
        phase = "thoughts"; i = 0; setTimeout(type, 500);
      }
    } else if (phase === "thoughts") {
      spans.thoughts.textContent = words.thoughts.substring(0, i);
      i++;
      if (i <= words.thoughts.length) setTimeout(type, 80);
      else { phase = "feelings"; i = 0; setTimeout(type, 400); }
    } else if (phase === "feelings") {
      spans.feelings.textContent = words.feelings.substring(0, i);
      i++;
      if (i <= words.feelings.length) setTimeout(type, 80);
      else { phase = "actions"; i = 0; setTimeout(type, 400); }
    } else if (phase === "actions") {
      spans.actions.textContent = words.actions.substring(0, i);
      i++;
      if (i <= words.actions.length) setTimeout(type, 80);
      else setTimeout(restart, 2500);
    }
  }

  function restart() {
    typingText.firstChild.textContent = "";
    spans.thoughts.textContent = "";
    spans.feelings.textContent = "";
    spans.actions.textContent = "";
    i = 0; phase = "line1"; setTimeout(type, 800);
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

