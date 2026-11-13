const fs = require('fs');

const svg = fs.readFileSync('public/logo.svg', 'utf8');

// Match the two paths
const matches = [...svg.matchAll(/<path d="([^"]+)" fill="([^"]+)"/g)];
if (matches.length >= 2) {
  let blackD = matches[0][1];
  let orangeD = matches[1][1];

  // Split each into subpaths starting with 'M '
  const splitSubpaths = (d) => {
    return d.split(/(?=M\s)/).map(s => s.trim()).filter(Boolean);
  };

  const blackSubs = splitSubpaths(blackD);
  const orangeSubs = splitSubpaths(orangeD);

  console.log('Black subpaths count:', blackSubs.length);
  console.log('Orange subpaths count:', orangeSubs.length);

  // Black subpaths belong to "Boshla" (X is between 0 and 492)
  // Let's filter out any subpath whose initial M coordinate X > 485
  const cleanBlackSubs = blackSubs.filter(sub => {
    const m = sub.match(/^M\s*([\d\.]+)/);
    if (!m) return true;
    const x = parseFloat(m[1]);
    return x < 492;
  });

  // Orange subpaths belong to "Up" (X > 480)
  const cleanOrangeSubs = orangeSubs.filter(sub => {
    const m = sub.match(/^M\s*([\d\.]+)/);
    if (!m) return true;
    const x = parseFloat(m[1]);
    return x >= 480;
  });

  console.log('Clean black subpaths:', cleanBlackSubs.length);
  console.log('Clean orange subpaths:', cleanOrangeSubs.length);

  const cleanBlackD = cleanBlackSubs.join(' ');
  const cleanOrangeD = cleanOrangeSubs.join(' ');

  const finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 714 210" fill="none">
  <!-- Boshla (Dark Black #09090B) -->
  <path d="${cleanBlackD}" fill="#09090B" fill-rule="evenodd" />
  <!-- Up (Vibrant Orange #FF6A13 with upward arrow) -->
  <path d="${cleanOrangeD}" fill="#FF6A13" fill-rule="evenodd" />
</svg>`;

  fs.writeFileSync('public/logo.svg', finalSvg);
  console.log('Successfully cleaned public/logo.svg');

  // Also create a dark-mode variant where Boshla is white (#FFFFFF)
  const whiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 714 210" fill="none">
  <path d="${cleanBlackD}" fill="#FFFFFF" fill-rule="evenodd" />
  <path d="${cleanOrangeD}" fill="#FF6A13" fill-rule="evenodd" />
</svg>`;
  fs.writeFileSync('public/logo-white.svg', whiteSvg);

  // Also create an icon SVG for favicon and brand marks (just the Up arrow glyph)
  // Let's get the viewBox for Up: X goes from 490 to 714 -> width 224, height 210
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="485 0 230 210" fill="none">
  <path d="${cleanOrangeD}" fill="#FF6A13" fill-rule="evenodd" />
</svg>`;
  fs.writeFileSync('public/logo-icon.svg', iconSvg);
}
