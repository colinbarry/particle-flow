import './style.css'
import perlin from './perlin.js';

const numParticles = 3000;
const velocity = 2;
const noiseScale = 1 / 167;

const map = (value, fromLower, fromUpper, toLower, toUpper) => {
  const v = (value - fromLower) / (fromUpper - fromLower);
  return toLower + (toUpper - toLower) * v;
}

const rnd = max => Math.floor(Math.random() * (max + 1));

const makeParticle = () => {
  return {
    x: rnd(width),
    y: rnd(height),
    age: 0
  }
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
let frameCount = 0;

const particles = [];
for (let i = 0; i < numParticles; ++i) {
  particles.push(makeParticle());
}

const scale = value => value * noiseScale;

const colour = (noise, age) => {
  const h = map(noise, -1, 1, 0, 660);
  const s = map(noise, -1, 1, 20, 80);
  const l = map(age, 0, 100, 20, 100);
  return `hsl(${h}, ${s}%, ${l}%)`;
}


const frame = () => {
  if (++frameCount % 1200 === 0) {
    perlin.seed();
  }

  particles.forEach((p, index) => {
    const value = perlin.get(scale(p.x), scale(p.y));
    p.x += velocity * Math.cos(Math.PI * 2 * value);
    p.y += velocity * Math.sin(Math.PI * 2 * value);
    p.age += 1;

    if (p.x < 0 || p.x >= width || p.y <=0 || p.y >= height) {
      particles[index] = p = makeParticle();
    }

    p.noise = value;
  });

  ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    ctx.fillStyle = colour(p.noise, p.age);
    ctx.fillRect(p.x, p.y, 2, 2);
  });

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
