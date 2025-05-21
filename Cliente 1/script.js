const colors = [
  "#ff1493", // fucsia puro
  "#ff3fa6", // fucsia claro
  "#ff69b4", // rosa fuerte/fucsia
  "#e75480", // rosa medio
  "#ff4f81", // rosa intenso
  "#d72660", // magenta oscuro
  "#ff2d7a", // fucsia brillante
  "#ff5fa2", // fucsia pastel
  "#ff0080", // fucsia neón
  "#ff85c0"  // rosa pastel
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

// Detecta si es móvil
function isMobile() {
  return window.innerWidth <= 600;
}

function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  const mobile = isMobile();
  const minSize = mobile ? 20 : 20;
  const maxSize = mobile ? 48 : 80;
  const size = randomBetween(minSize, maxSize); // px
  heart.style.width = `${size}px`;
  heart.style.height = `${size * 0.9}px`;
  heart.style.left = `${randomBetween(-10, 100)}vw`;
  heart.style.bottom = `-60px`;
  heart.style.opacity = randomBetween(0.3, 0.9);
  heart.style.zIndex = Math.floor(randomBetween(1, 3));
  heart.style.animationDuration = `${randomBetween(4, 10)}s`;
  heart.style.animationDelay = `${randomBetween(0, 5)}s`;

  // Color
  const color = colors[Math.floor(Math.random() * colors.length)];
  const heartShape = document.createElement('div');
  heartShape.className = 'heart-shape';
  heartShape.style.background = color;
  heartShape.style.filter = `blur(${randomBetween(0, 3)}px)`;

  heart.appendChild(heartShape);

  // Movimiento más natural, con más oscilaciones izquierda/derecha
  const wind = randomBetween(-180, 180); // viento horizontal total (más fuerte)
  const sway1 = randomBetween(-90, 90);
  const sway2 = randomBetween(-120, 120);
  const sway3 = randomBetween(-90, 90);
  const sway4 = randomBetween(-150, 150);
  const rotate1 = randomBetween(-25, 25);
  const rotate2 = randomBetween(-45, 45);

  const animName = `floatUp_${Math.random().toString(36).substr(2, 8)}`;
  const keyframes = `
    @keyframes ${animName} {
      0% {
        transform: translateX(0px) translateY(0) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate1}deg);
        opacity: ${heart.style.opacity};
      }
      15% {
        transform: translateX(${sway1}px) translateY(-15vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate2}deg);
      }
      30% {
        transform: translateX(${sway2}px) translateY(-30vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate1}deg);
      }
      50% {
        transform: translateX(${sway3}px) translateY(-50vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate2}deg);
      }
      70% {
        transform: translateX(${sway4}px) translateY(-70vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate1}deg);
      }
      85% {
        transform: translateX(${wind}px) translateY(-95vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate2}deg);
        opacity: ${heart.style.opacity};
      }
      100% {
        transform: translateX(${wind * 1.2}px) translateY(-110vh) scale(${randomBetween(0.8, 1.2)}) rotate(${rotate2}deg);
        opacity: 0;
      }
    }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.innerText = keyframes;
  document.head.appendChild(styleSheet);

  heart.style.animationName = animName;

  heart.addEventListener('animationend', () => {
    heart.remove();
    styleSheet.remove();
    createHeart(); // Reemplaza el corazón para mantener la cantidad
  });

  // Efecto al pasar el mouse: agrandar y hacer "pop"
  heart.addEventListener('mouseenter', () => {
    heart.style.transition = 'transform 0.2s cubic-bezier(.68,-0.55,.27,1.55), filter 0.2s';
    heart.style.transform += ' scale(1.5)';
    heart.style.filter = 'brightness(1.3) drop-shadow(0 0 12px #fff3)';
  });
  heart.addEventListener('mouseleave', () => {
    heart.style.transition = 'transform 0.2s, filter 0.2s';
    // Elimina solo el último scale si hay varios
    heart.style.transform = heart.style.transform.replace(/scale\(1\.5\)/, '');
    heart.style.filter = '';
  });

  document.querySelector('.hearts-container').appendChild(heart);
}

// Ajusta la cantidad de corazones y partículas según el dispositivo
const maxHearts = isMobile() ? 90 : 360;
let currentHearts = isMobile() ? 20 : 60;
const particlesPerInterval = isMobile() ? 4 : 14;

// Crea los corazones iniciales
for (let i = 0; i < currentHearts; i++) {
  createHeart();
}

const interval = setInterval(() => {
  if (currentHearts < maxHearts) {
    createHeart();
    currentHearts++;
  } else {
    clearInterval(interval);
  }
}, isMobile() ? 60 : 30); // Más rápido (antes era 80)

// --- INTERACTIVE HEART EXPLOSION ---
function explodeHeart(heart) {
  heart.style.transition = 'transform 0.3s, opacity 0.3s';
  heart.style.transform += ' scale(2) rotate(40deg)';
  heart.style.opacity = 0;
  setTimeout(() => {
    heart.remove();
    createHeart();
  }, 300);
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('heart') || e.target.classList.contains('heart-shape')) {
    const heart = e.target.closest('.heart');
    if (heart) explodeHeart(heart);
  }
});

// Ya no se agrega la clase pulse-text ni se aplica brillo
function addTextPulse() {
  const el = document.getElementById('typewriter');
  if (el) {
    el.innerHTML = el.innerHTML.replace(
      /(I love You)/i,
      '<span class="love-big">$1</span>'
    );
  }
}

// Typing effect for the center text
function typeWriterEffect(element, lines, speed = 70, lineDelay = 600) {
  let line = 0, char = 0;
  function type() {
    if (line < lines.length) {
      if (char <= lines[line].length) {
        element.innerHTML =
          lines.slice(0, line).join('<br>') +
          (line > 0 ? '<br>' : '') +
          lines[line].slice(0, char) + '<span class="cursor">|</span>';
        char++;
        setTimeout(type, speed);
      } else {
        char = 0;
        line++;
        setTimeout(type, lineDelay);
      }
    } else {
      // Inserta span solo en la segunda línea
      element.innerHTML =
        lines[0] + '<br><span class="love-big">' + lines[1] + '</span>';
      addTextPulse();
    }
  }
  type();
}

window.addEventListener('DOMContentLoaded', () => {
  const typewriter = document.getElementById('typewriter');
  typeWriterEffect(typewriter, ["Happy Birthday,", "I love You"]);
});

// --- SONIDO SUAVE DE FONDO ---
let audio;
function playBackgroundMusic() {
  if (!audio) {
    audio = document.createElement('audio');
    audio.src = "https://cdn.pixabay.com/audio/2022/10/16/audio_12b5fae2b7.mp3"; // Piano romántico, libre de derechos
    audio.loop = true;
    audio.volume = 0.25;
    document.body.appendChild(audio);
  }
  audio.play();
}

document.body.addEventListener('click', function playMusicOnce() {
  playBackgroundMusic();
  document.body.removeEventListener('click', playMusicOnce);
});
