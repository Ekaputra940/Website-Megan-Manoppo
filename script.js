'use strict';

const inputField = document.getElementById('input-field');
const resultContainer = document.getElementById('result-container');
const resultInput = document.getElementById('result-input');
const resultDecimal = document.getElementById('result-decimal');
const resultStatus = document.getElementById('result-status');
const verdictBox = document.getElementById('verdict-box');
const verdictText = document.getElementById('verdict-text');
const verdictDesc = document.getElementById('verdict-desc');
const aboutModal = document.getElementById('about-modal');

function isScientificNotation(str) {
  const s = str.trim().replace(/\s/g, '');
  if (!/^-?[1-9](\.\d+)?[eE][+-]?\d+$/.test(s)) return false;
  const coeff = Math.abs(parseFloat(s.toLowerCase().split('e')[0]));
  return coeff >= 1 && coeff < 10;
}

function formatDecimal(str) {
  const s = str.trim().replace(/\s/g, '');
  const num = parseFloat(s);
  if (isNaN(num)) return null;
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(3);
  }
  return num.toLocaleString('id-ID');
}

function triggerAnim(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
}

function runScanner() {
  const raw = inputField.value.trim();
  if (!raw) {
    resultContainer.style.display = 'none';
    return;
  }

  const isValid = isScientificNotation(raw);
  resultInput.textContent = raw;
  const decimal = formatDecimal(raw);
  resultDecimal.textContent = decimal ? `= ${decimal}` : '';

  if (isValid) {
    resultStatus.textContent = '✓ Valid';
    resultStatus.classList.remove('invalid');
    verdictBox.classList.remove('invalid');
    verdictText.textContent = 'YES';
    verdictDesc.textContent = 'Valid Notation';
  } else {
    resultStatus.textContent = '✗ Invalid';
    resultStatus.classList.add('invalid');
    verdictBox.classList.add('invalid');
    verdictText.textContent = 'NO';
    verdictDesc.textContent = 'Invalid Notation';
  }

  triggerAnim(verdictText, 'anim-pop');
  resultContainer.style.display = 'block';
  resultContainer.style.opacity = '0';
  resultContainer.style.animation = 'none';

  setTimeout(() => {
    resultContainer.style.animation = 'fadeInScale 0.4s ease forwards';
  }, 10);

  setTimeout(() => openAbout(), 600);
}

function tryExample(value) {
  inputField.value = value;
  inputField.style.background = 'rgba(255, 0, 110, 0.1)';
  setTimeout(() => { inputField.style.background = 'transparent'; }, 200);
  runScanner();
  inputField.focus();
}

function openAbout() {
  aboutModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAbout() {
  aboutModal.classList.remove('show');
  document.body.style.overflow = 'auto';
}

inputField.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runScanner();
});

document.getElementById('logo-brand').addEventListener('click', openAbout);
aboutModal.addEventListener('click', (e) => {
  if (e.target.id === 'about-modal') closeAbout();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && aboutModal.classList.contains('show')) closeAbout();
});

inputField.focus();

/* ── Particle Click Effect ── */
document.addEventListener('click', (e) => {
  // Jangan buat particle saat klik di input atau modal
  if (e.target.closest('.modal-content') || e.target.closest('.input-field')) return;

  const x = e.clientX;
  const y = e.clientY;
  createParticles(x, y);
});

function createParticles(x, y) {
  const particleCount = 8;
  const colors = ['#0080FF', '#FF006E', '#C701AE', '#00D9FF'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = (i / particleCount) * Math.PI * 2;
    const velocity = 3 + Math.random() * 4;

    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.background = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '99';
    particle.style.boxShadow = `0 0 10px ${color}`;
    particle.style.opacity = '1';

    document.body.appendChild(particle);

    let life = 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    let px = x;
    let py = y;

    const animate = () => {
      life -= 2;
      px += vx;
      py += vy;

      particle.style.left = px + 'px';
      particle.style.top = py + 'px';
      particle.style.opacity = life / 100;
      particle.style.filter = `blur(${(100 - life) / 20}px)`;

      if (life > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    animate();
  }
}