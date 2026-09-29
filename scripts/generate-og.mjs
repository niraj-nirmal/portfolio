// One-off: renders public/og.png (1200x630) for social sharing cards.
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#14100A"/>
  <rect x="26" y="26" width="1148" height="578" fill="none" stroke="#A8863C" stroke-width="1.5"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#C9A24B" stroke-opacity=".28" stroke-width="1"/>
  <path d="M600 62 L618 80 L600 98 L582 80 Z" fill="none" stroke="#C9A24B" stroke-width="1.6"/>
  <circle cx="600" cy="80" r="3.5" fill="#C25E52"/>
  <text x="600" y="205" font-family="Georgia, serif" font-size="34" fill="#C9A24B" text-anchor="middle" letter-spacing="14">CAMBRIDGE · UNITED KINGDOM</text>
  <text x="600" y="330" font-family="Georgia, serif" font-size="104" fill="#F2E9D5" text-anchor="middle" font-weight="500">Niraj Nirmal</text>
  <text x="600" y="410" font-family="Georgia, serif" font-size="42" font-style="italic" fill="#C9A24B" text-anchor="middle">building AI, responsibly.</text>
  <text x="600" y="505" font-family="Arial, sans-serif" font-size="26" fill="#C9BEA4" text-anchor="middle">Senior machine learning technology leader · Amazon · Microsoft · Cambridge</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('wrote public/og.png');
