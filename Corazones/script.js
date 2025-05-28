// script.js
const canvas = document.getElementById('loveCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);

function heartFunction(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return {
    x: x * scale,
    y: -y * scale
  };
}

function randomPointInHeart(scale = 1, t = null, r = null) {
  if (t === null) t = Math.random() * Math.PI * 2;
  if (r === null) r = Math.random();
  const border = heartFunction(t, scale);
  const x = border.x * Math.sqrt(r);
  const y = border.y * Math.sqrt(r);
  return { x, y };
}

let disperseLevel = 0;
const disperseSpeed = 0.012;
let allowDisperse = false;
let pageLoadTime = Date.now();

// Elimina todo lo relacionado con helloScreen, helloBtn y la transición inicial
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loveCanvas').style.display = 'block';
  document.getElementById('loveText').style.display = 'block';
  // Puedes reproducir la música automáticamente si el navegador lo permite
  const loveAudio = document.getElementById('loveAudio');
  if (loveAudio) {
    // Descomenta la siguiente línea si quieres intentar reproducir automáticamente
    // loveAudio.play();
  }
  // Dispersar corazones después de 3 segundos de cargar la página
  setTimeout(() => {
    allowDisperse = true;
  }, 3000);
});

class HeartParticle {
  constructor(centerX, centerY, scale, t, r) {
    const pos = randomPointInHeart(scale, t, r);
    this.x0 = centerX + pos.x;
    this.y0 = centerY + pos.y;
    this.initX0 = this.x0;
    this.initY0 = this.y0;
    const minSize = isMobile() ? 7 : 11;
    const maxSize = isMobile() ? 5 : 9;
    this.size = minSize + Math.random() * maxSize;
    // Color personalizado: rojo brillante, cálido, con poco verde y azul sutil para tonos rosados/corales
    const red = 230 + Math.floor(Math.random() * 25);         // 230–254: rojo brillante, cálido
    const green = 10 + Math.floor(Math.random() * 25);        // 10–34: poco verde, no neutraliza
    const blue = 20 + Math.floor(Math.random() * 40);         // 20–59: sutil azul para tono rosado o coral
    const alpha = (0.85 + Math.random() * 0.15).toFixed(2);   // 0.85–1.00: buena visibilidad
    this.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    this.opacity = 0.7 + Math.random() * 0.3;
    this.angle = 0;
    this.floatOffset = Math.random() * 1000;
    this.dispersion = 0.22 + Math.random() * 0.38;
    this.dispersionAngle = -Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 14;
    this.life = 0;
    this.isTop = this.y0 < centerY;
    this.isBottom = this.y0 > centerY;
    this.dispersing = false;
    this.centerY = centerY;
    this.shadowBlur = getShadowBlur();
    // Offset aleatorio para el latido
    this.beatOffset = Math.random() * Math.PI * 2;
  }
  update(time) {
    const float = Math.sin((time + this.floatOffset) * 0.001) * 6;
    const speedFactor = isMobile() ? 300 : 480;
    if (this.dispersing) {
      this.life += 0.045;
      const dx = Math.cos(this.dispersionAngle) * this.dispersion * this.life * speedFactor;
      const dy = Math.sin(this.dispersionAngle) * this.dispersion * this.life * speedFactor;
      this.x = this.x0 + Math.cos(this.angle) * float + dx;
      this.y = this.y0 + Math.sin(this.angle) * float + dy;
    } else {
      this.x = this.x0 + Math.cos(this.angle) * float;
      this.y = this.y0 + Math.sin(this.angle) * float;
    }
  }
  draw(ctx, time, bpm = 60) { // Cambia bpm por defecto a 60
    // Latido individual con desfase
    const freq = bpm / 60;
    const beat = Math.sin(2 * Math.PI * freq * (time / 1000) + this.beatOffset);
    // Más grande en mobile
    const beatScale = isMobile()
      ? 1 + 0.38 * Math.max(0, beat) // mobile: más grande
      : 1 + 0.28 * Math.max(0, beat); // desktop
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.scale(0.8 * beatScale, 0.8 * beatScale);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      0, -this.size / 2,
      -this.size, -this.size / 2,
      -this.size, 0
    );
    ctx.bezierCurveTo(
      -this.size, this.size,
      0, this.size * 1.2,
      0, this.size * 1.7
    );
    ctx.bezierCurveTo(
      0, this.size * 1.2,
      this.size, this.size,
      this.size, 0
    );
    ctx.bezierCurveTo(
      this.size, -this.size / 2,
      0, -this.size / 2,
      0, 0
    );
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.shadowColor = '#f0f';
    ctx.shadowBlur = this.shadowBlur;
    ctx.fill();
    ctx.restore();
  }
}

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}

const getOptimalParticles = () => {
  if (!isMobile()) return 1500;
  // En móviles, más partículas para un efecto más vistoso
  if (window.innerWidth < 400 || window.innerHeight < 700) return 900;
  if (window.innerWidth < 600 || window.innerHeight < 900) return 1200;
  return 1500;
};
let NUM_PARTICLES = getOptimalParticles();
let particles = [];

function isInsideHeart(x, y) {
  const yAdj = y * 1.13;
  return Math.pow(x * x + yAdj * yAdj - 1, 3) - x * x * yAdj * yAdj * yAdj <= 0;
}

function createParticles() {
  NUM_PARTICLES = getOptimalParticles();
  particles = [];
  // Eliminar margen para centrar perfectamente
  const heartWidth = 32;
  const heartHeight = 30;
  let scale = Math.min(width / heartWidth, height / heartHeight);
  if (isMobile()) {
    scale *= 0.85; // Reduce el tamaño del corazón en móviles, pero menos
  }
  const centerX = width / 2;
  const centerY = height / 2 + scale * 2;

  // NUEVO: Usar una cuadrícula dispersa para cubrir mejor el corazón
  const gridX = Math.floor(Math.sqrt(NUM_PARTICLES) * 1.25); // más columnas que filas
  const gridY = Math.floor(NUM_PARTICLES / gridX);

  let count = 0;
  for (let i = 0; i < gridX; i++) {
    for (let j = 0; j < gridY; j++) {
      // Normalizar a [-1,1] y agregar aleatoriedad
      const x = (i / (gridX - 1)) * 2 - 1 + (Math.random() - 0.5) * 0.08;
      const y = (j / (gridY - 1)) * 2 - 1 + (Math.random() - 0.5) * 0.08;
      if (isInsideHeart(x, y)) {
        const px = centerX + x * 16 * scale;
        const py = centerY - y * 13 * scale * 1.13;
        const p = new HeartParticle(centerX, centerY, scale, null, null);
        p.x0 = px;
        p.y0 = py;
        p.initX0 = px;
        p.initY0 = py;
        particles.push(p);
        count++;
        if (count >= NUM_PARTICLES) break;
      }
    }
    if (count >= NUM_PARTICLES) break;
  }

  // Si faltan partículas por pequeños huecos, rellenar aleatoriamente
  let tries = 0;
  while (particles.length < NUM_PARTICLES && tries < NUM_PARTICLES * 5) {
    const x = (Math.random() * 2.1 - 1.05);
    const y = (Math.random() * 2.1 - 1.05);
    if (isInsideHeart(x, y)) {
      const px = centerX + x * 16 * scale;
      const py = centerY - y * 13 * scale * 1.13;
      const p = new HeartParticle(centerX, centerY, scale, null, null);
      p.x0 = px;
      p.y0 = py;
      p.initX0 = px;
      p.initY0 = py;
      particles.push(p);
    }
    tries++;
  }
}
createParticles();
window.addEventListener('resize', createParticles);

function getShadowBlur() {
  // En móviles, menos blur para mejor rendimiento
  if (isMobile()) return 2;
  if (NUM_PARTICLES > 1000) return 3;
  if (NUM_PARTICLES > 800) return 4;
  return 5;
}

let running = true;
document.addEventListener('visibilitychange', () => {
  running = !document.hidden;
  if (running) requestAnimationFrame(animate);
});

let disperseBottom = true;
let reloading = false;
let reloadLevel = 0;
const reloadSpeed = isMobile() ? 0.008 : 0.006;

function getDispersedRatio() {
  let dispersed = 0;
  for (let p of particles) {
    if (p.dispersing && (Math.abs(p.x - p.x0) > 30 || Math.abs(p.y - p.y0) > 30)) dispersed++;
  }
  return dispersed / particles.length;
}

function resetParticle(p, centerX, centerY, scale) {
  const pos = randomPointInHeart(scale, null, null);
  p.x0 = centerX + pos.x;
  p.y0 = centerY + pos.y;
  const minSize = isMobile() ? 7 : 11;
  const maxSize = isMobile() ? 5 : 9;
  p.size = minSize + Math.random() * maxSize;
  // Color personalizado igual que en HeartParticle
  const red = 230 + Math.floor(Math.random() * 25);
  const green = 10 + Math.floor(Math.random() * 25);
  const blue = 20 + Math.floor(Math.random() * 40);
  const alpha = (0.85 + Math.random() * 0.15).toFixed(2);
  p.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  p.opacity = 0.7 + Math.random() * 0.3;
  p.angle = 0;
  p.floatOffset = Math.random() * 1000;
  p.dispersion = 0.22 + Math.random() * 0.38;
  p.dispersionAngle = -Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 14;
  p.life = 0;
  p.dispersing = false;
  p.isTop = p.y0 < centerY;
  p.isBottom = p.y0 > centerY;
  p.centerY = centerY;
}

function resetParticleToInitial(p) {
  p.x0 = p.initX0;
  p.y0 = p.initY0;
  const minSize = isMobile() ? 7 : 11;
  const maxSize = isMobile() ? 5 : 9;
  p.size = minSize + Math.random() * maxSize;
  // Color personalizado igual que en HeartParticle
  const red = 230 + Math.floor(Math.random() * 25);
  const green = 10 + Math.floor(Math.random() * 25);
  const blue = 20 + Math.floor(Math.random() * 40);
  const alpha = (0.85 + Math.random() * 0.15).toFixed(2);
  p.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  p.opacity = 0.7 + Math.random() * 0.3;
  p.angle = 0;
  p.floatOffset = Math.random() * 1000;
  p.dispersion = 0.22 + Math.random() * 0.38;
  p.dispersionAngle = -Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 14;
  p.life = 0;
  p.dispersing = false;
}

// NUEVO: Loop infinito de dispersión y recarga
function startHeartLoop() {
  // Si ya está en loop, no hacer nada
  if (window._heartLoopActive) return;
  window._heartLoopActive = true;

  // Hook en animate para reiniciar el ciclo tras cada recarga
  let lastReloading = false;
  function loopCheck() {
    // reloading y disperseLevel son globales
    if (typeof reloading !== "undefined" && typeof disperseLevel !== "undefined") {
      if (!reloading && disperseLevel === 0 && allowDisperse) {
        // Esperar 2s y volver a dispersar
        setTimeout(() => {
          disperseLevel = 0;
          allowDisperse = true;
        }, 2000);
      }
    }
    requestAnimationFrame(loopCheck);
  }
  loopCheck();
}

const DISPERSION_PERCENT = 0.7;

let lastTime = 0;
let frameSkip = 0;
function animate(time = 0) {
  if (!running) return;
  if (time - lastTime < 1000 / 40) {
    frameSkip++;
    if (frameSkip < 1) {
      requestAnimationFrame(animate);
      return;
    }
    frameSkip = 0;
  }
  lastTime = time;
  ctx.clearRect(0, 0, width, height);


  // Latido: frecuencia y escala
  const bpm = 40; // latidos por minuto, más lento
  const freq = bpm / 60; // Hz
  // El latido será una onda seno "aplanada" para que se note el pulso
  const beat = Math.sin(2 * Math.PI * freq * (time / 1000));
  // El valor oscila entre 0.93 y 1.38 aprox (ajustable)
  const beatScale = isMobile()
    ? 1 + 0.38 * Math.max(0, beat)
    : 1 + 0.28 * Math.max(0, beat);

  // En desktop, solo permitir dispersión tras click en el botón
  if (!isMobile()) {
    // Espera al click del botón para permitir dispersión
    // allowDisperse se activa en el click del botón
  } else {
    // En mobile, siempre mostrar el mensaje y permitir dispersión tras 4s
    if (!allowDisperse && Date.now() - pageLoadTime >= 4000) {
      allowDisperse = true;
    }
  }

  if (allowDisperse && !reloading && disperseLevel < 1) {
    disperseLevel += disperseSpeed;
    if (disperseLevel > 1) disperseLevel = 1;
  }

  if (!reloading) {
    let minY = Infinity, maxY = -Infinity;
    for (let p of particles) {
      if (p.initY0 < minY) minY = p.initY0;
      if (p.initY0 > maxY) maxY = p.initY0;
    }
    const thresholdY = minY + (maxY - minY) * disperseLevel;
    for (let p of particles) {
      if (p.initY0 <= thresholdY) {
        p.dispersing = true;
      }
    }
  }

  if (!reloading && disperseLevel >= 1 && getDispersedRatio() >= 1) {
    reloading = true;
    reloadLevel = 0;
  }

  if (reloading) {
    let minY = Infinity, maxY = -Infinity;
    for (let p of particles) {
      if (p.initY0 < minY) minY = p.initY0;
      if (p.initY0 > maxY) maxY = p.initY0;
    }
    const thresholdY = minY + (maxY - minY) * reloadLevel;
    for (let p of particles) {
      if (p.dispersing && p.initY0 <= thresholdY) {
        resetParticleToInitial(p);
      }
    }
    reloadLevel += reloadSpeed;
    if (reloadLevel >= 1) {
      reloadLevel = 1;
      reloading = false;
      disperseLevel = 0;
      allowDisperse = false;
      pageLoadTime = Date.now();
      for (let p of particles) {
        p.dispersing = false;
        p.x0 = p.initX0;
        p.y0 = p.initY0;
        p.life = 0;
      }
      // Dispersar corazones automáticamente después de 2 segundos de recarga
      setTimeout(() => {
        allowDisperse = true;
      }, 2000);
    }
  }

  for (let p of particles) {
    p.update(time);
    p.draw(ctx, time, bpm);
  }

  requestAnimationFrame(animate);
}
animate();

// El tap/click en mobile y el control de mobileTapDone ya no son necesarios
