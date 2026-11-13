
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('C:/Users/Computer Store/.gemini/antigravity/brain/67ed7a6a-4ca9-4f44-ba3b-11292ca1b01e/.user_uploaded/media_1794572321216_26754b14.png')

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

$transparentBmp.Save('C:/Users/Computer Store/Desktop/startup_space/public/logo.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved C:/Users/Computer Store/Desktop/startup_space/public/logo.png ($cropW x $cropH)"

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

$blackMask.Save('C:/Users/Computer Store/Desktop/startup_space/scripts/black-mask.png', [System.Drawing.Imaging.ImageFormat]::Png)
$orangeMask.Save('C:/Users/Computer Store/Desktop/startup_space/scripts/orange-mask.png', [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved masks"

$bmp.Dispose()
$transparentBmp.Dispose()
$blackMask.Dispose()
$orangeMask.Dispose()
