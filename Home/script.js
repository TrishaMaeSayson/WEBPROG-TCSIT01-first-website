    function showSection(sectionId) {
      document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
      document.getElementById(sectionId).classList.add('active');
    }

// ABOUT page player: play/pause toggle
(function () {
  const audio = document.getElementById('piano');
  const btn = document.getElementById('aboutPlayBtn');
  if (!audio || !btn) return;

  const icon = btn.querySelector('i');

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(err => {
        // autoplay/user gesture restrictions can cause .play() to fail
        console.warn('Play failed:', err);
      });
      icon.classList.remove('fa-play');
      icon.classList.add('fa-pause');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      audio.pause();
      icon.classList.remove('fa-pause');
      icon.classList.add('fa-play');
      btn.setAttribute('aria-pressed', 'false');
    }
  });

  // Reset icon when audio ends
  audio.addEventListener('ended', () => {
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
    btn.setAttribute('aria-pressed', 'false');
  });
})();