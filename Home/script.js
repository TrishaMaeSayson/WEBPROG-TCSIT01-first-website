function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  const typingElement = document.getElementById("typing-text");

  const htmlString = `The only...<br>thoughts...`;

  // For the phrase with formatting
  const formattedHtmlString = `The only...<br><span class="word-thoughts">thoughts</span>...`;

  let currentIndex = 0;
  let isTyping = true;

  // Function to type the string with HTML
  function typeHTML(html, callback) {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    let chars = [];
    // Flatten the HTML into a sequence of characters, including tags
    function flatten(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        chars.push({ type: 'text', content: node.textContent });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Insert opening tag
        const tagStart = `<${node.tagName.toLowerCase()}`;
        let attrs = "";
        for (let attr of node.attributes) {
          attrs += ` ${attr.name}="${attr.value}"`;
        }
        const startTag = `${tagStart}${attrs}>`;
        chars.push({ type: 'tag', content: startTag });

        // Recursively process children
        node.childNodes.forEach(child => flatten(child));

        // Insert closing tag
        const endTag = `</${node.tagName.toLowerCase()}>`;
        chars.push({ type: 'tag', content: endTag });
      }
    }

    Array.from(tempDiv.childNodes).forEach(node => flatten(node));

    // Now type character by character
    let displayHTML = "";
    let index = 0;

    function typeChar() {
      if (index >= chars.length) {
        if (callback) callback();
        return;
      }
      displayHTML += chars[index].content;
      typingElement.innerHTML = displayHTML;
      index++;
      setTimeout(typeChar, 30); // Adjust speed here
    }

    typeChar();
  }

  // Start typing
  typeHTML(formattedHtmlString);
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

