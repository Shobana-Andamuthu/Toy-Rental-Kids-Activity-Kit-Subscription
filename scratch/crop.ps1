Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('C:\Users\User\.gemini\antigravity-ide\brain\8b4abf07-ef04-45c6-81dd-4d9ee1bdfbfa\.user_uploaded\media_1788600180126.png')
$rect = New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, 35)
$crop = $bmp.Clone($rect, $bmp.PixelFormat)
$crop.Save('C:\Users\User\.gemini\antigravity-ide\brain\8b4abf07-ef04-45c6-81dd-4d9ee1bdfbfa\scratch\top_crop.png')
Write-Host "Done"
