const fs = require('fs');
const path = require('path');
const potrace = require('potrace');
const { execSync } = require('child_process');

const inputPath = 'C:/Users/Computer Store/.gemini/antigravity/brain/67ed7a6a-4ca9-4f44-ba3b-11292ca1b01e/.user_uploaded/media_1794572321216_26754b14.png';

// Let's create a PowerShell script to crop and separate into black mask and orange mask PNGs
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

const outPngPath = path.join(publicDir, 'logo.png').replace(/\\/g, '/');
const blackMaskPath = path.resolve(__dirname, 'black-mask.png').replace(/\\/g, '/');
const orangeMaskPath = path.resolve(__dirname, 'orange-mask.png').replace(/\\/g, '/');

const psScript = `
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('${inputPath.replace(/'/g, "''")}')

$minX = 166
$maxX = 880
$minY = 416
$maxY = 626

$cropW = $maxX - $minX
$cropH = $maxY - $minY

# 1. Full transparent cropped PNG
$transparentBmp = New-Object System.Drawing.Bitmap($cropW, $cropH)

for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $p = $bmp.GetPixel($minX + $x, $minY + $y)
        # Background is around R=246, G=244, B=241
        $isBg = ($p.R -gt 230) -and ($p.G -gt 225) -and ($p.B -gt 220)
        if (-not $isBg) {
            $transparentBmp.SetPixel($x, $y, $p)
        } else {
            $transparentBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$transparentBmp.Save('${outPngPath}', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved ${outPngPath} ($cropW x $cropH)"

# Create high-res mask for Boshla (black) and Up (orange)
$blackMask = New-Object System.Drawing.Bitmap($cropW, $cropH)
$orangeMask = New-Object System.Drawing.Bitmap($cropW, $cropH)

for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $p = $transparentBmp.GetPixel($x, $y)
        if ($p.A -gt 40) {
            if ($p.R -gt 150 -and $p.G -gt 60 -and $p.B -lt 80) {
                # Orange part ("Up")
                $orangeMask.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 0, 0, 0))
                $blackMask.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
            } else {
                # Black part ("Boshla")
                $blackMask.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 0, 0, 0))
                $orangeMask.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
            }
        } else {
            $blackMask.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
            $orangeMask.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
        }
    }
}

$blackMask.Save('${blackMaskPath}', [System.Drawing.Imaging.ImageFormat]::Png)
$orangeMask.Save('${orangeMaskPath}', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved masks"

$bmp.Dispose()
$transparentBmp.Dispose()
$blackMask.Dispose()
$orangeMask.Dispose()
`;

fs.writeFileSync('scripts/crop.ps1', psScript);
console.log('Running crop.ps1...');
execSync('powershell -ExecutionPolicy Bypass -File scripts/crop.ps1', { stdio: 'inherit' });

// Now vectorize with potrace!
console.log('Tracing black and orange masks...');

potrace.trace('scripts/black-mask.png', { color: '#000000', threshold: 128 }, (err, blackSvg) => {
  if (err) throw err;
  potrace.trace('scripts/orange-mask.png', { color: '#FF6A13', threshold: 128 }, (err2, orangeSvg) => {
    if (err2) throw err2;

    // Extract path data
    const getPaths = (svg, color) => {
      const match = svg.match(/<path[^>]+d="([^"]+)"/);
      return match ? `<path d="${match[1]}" fill="${color}" fill-rule="evenodd" />` : '';
    };

    const blackPath = getPaths(blackSvg, '#09090B');
    const orangePath = getPaths(orangeSvg, '#FF5A1F');

    // Get viewBox from one of the svgs
    const vbMatch = blackSvg.match(/viewBox="([^"]+)"/);
    const viewBox = vbMatch ? vbMatch[1] : '0 0 714 210';

    const mergedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">
  ${blackPath}
  ${orangePath}
</svg>`;

    fs.writeFileSync(path.join(publicDir, 'logo.svg'), mergedSvg);
    console.log('✅ Generated public/logo.svg!');

    // Also generate an icon SVG (just the orange "Up" arrow)
    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">
  ${orangePath}
</svg>`;
    fs.writeFileSync(path.join(publicDir, 'logo-icon.svg'), iconSvg);
    console.log('✅ Generated public/logo-icon.svg!');
  });
});
