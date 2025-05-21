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

function createHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';
  // Ajusta tamaño según pantalla
  const isMobile = window.innerWidth <= 600;
  const minSize = isMobile ? 20 : 20;
  const maxSize = isMobile ? 48 : 80;
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

  document.querySelector('.hearts-container').appendChild(heart);
}

// Gradual heart creation
const maxHearts = 360;
let currentHearts = 60;

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
}, 30); // Más rápido (antes era 80)
