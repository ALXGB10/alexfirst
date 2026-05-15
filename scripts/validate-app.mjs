import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('src/styles.css', 'utf8');
const js = readFileSync('src/script.js', 'utf8');

const required = [
  'Rolex x Jannik Sinner',
  'Special:Redirect/file/Rolex%20Datejust%20126234.jpg',
  'Special:Redirect/file/Jannik%20Sinner%20(2024%20US%20Open)%2004%20(cropped).jpg',
  'Concepto visual no oficial',
];

for (const token of required) {
  if (!html.includes(token)) {
    throw new Error(`Missing required content: ${token}`);
  }
}

for (const token of ['.watch-card', '.athlete-card', '@keyframes spin']) {
  if (!css.includes(token)) {
    throw new Error(`Missing required style: ${token}`);
  }
}

if (!js.includes('pointermove') || !js.includes('--rx')) {
  throw new Error('Missing parallax pointer interaction');
}

console.log('Static app validation passed.');
