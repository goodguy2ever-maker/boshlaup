Add-Type -AssemblyName System.Drawing
$imgPath = 'C:/Users/Computer Store/.gemini/antigravity/brain/67ed7a6a-4ca9-4f44-ba3b-11292ca1b01e/.user_uploaded/media_1794572321216_26754b14.png'
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
Write-Host "Width: $($bmp.Width), Height: $($bmp.Height)"
$bg = $bmp.GetPixel(10, 10)
Write-Host "Background Color: R=$($bg.R), G=$($bg.G), B=$($bg.B)"
# Find text bounding box
$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y += 2) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        $pixel = $bmp.GetPixel($x, $y)
        # Check if significantly different from background (244, 244, 242)
        $diff = [Math]::Abs($pixel.R - $bg.R) + [Math]::Abs($pixel.G - $bg.G) + [Math]::Abs($pixel.B - $bg.B)
        if ($diff -gt 30) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Bounding box: X=$minX..$maxX, Y=$minY..$maxY"
Write-Host "Text Width: $($maxX - $minX), Text Height: $($maxY - $minY)"

$bmp.Dispose()
