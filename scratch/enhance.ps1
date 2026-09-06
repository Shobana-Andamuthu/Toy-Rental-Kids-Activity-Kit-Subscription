Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('C:\Users\User\.gemini\antigravity-ide\brain\8b4abf07-ef04-45c6-81dd-4d9ee1bdfbfa\.user_uploaded\media_1788600180126.png')
$out = New-Object System.Drawing.Bitmap($bmp.Width, 35)

for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt 35; $y++) {
        $p = $bmp.GetPixel($x, $y)
        # If it's not white/light blue, make it black, else white
        $brightness = ($p.R + $p.G + $p.B) / 3
        if ($brightness -lt 240) {
            $out.SetPixel($x, $y, [System.Drawing.Color]::Black)
        } else {
            $out.SetPixel($x, $y, [System.Drawing.Color]::White)
        }
    }
}

$out.Save('C:\Users\User\.gemini\antigravity-ide\brain\8b4abf07-ef04-45c6-81dd-4d9ee1bdfbfa\scratch\enhanced_text.png')
Write-Host "Enhanced text saved"
