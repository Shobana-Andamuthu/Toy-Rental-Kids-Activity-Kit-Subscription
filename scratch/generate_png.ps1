Add-Type -AssemblyName System.Drawing

$width = 64
$height = 64
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Clear transparent
$g.Clear([System.Drawing.Color]::Transparent)

# Create rounded rect path
$rect = New-Object System.Drawing.Rectangle 0, 0, ($width - 1), ($height - 1)
$radius = 16
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$path.AddArc($rect.X, $rect.Y, $radius * 2, $radius * 2, 180, 90)
$path.AddArc($rect.Right - $radius * 2, $rect.Y, $radius * 2, $radius * 2, 270, 90)
$path.AddArc($rect.Right - $radius * 2, $rect.Bottom - $radius * 2, $radius * 2, $radius * 2, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $radius * 2, $radius * 2, $radius * 2, 90, 90)
$path.CloseFigure()

# Fill gradient
$colorStart = [System.Drawing.ColorTranslator]::FromHtml("#06B6D4")
$colorEnd = [System.Drawing.ColorTranslator]::FromHtml("#0891B2")
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $colorStart, $colorEnd, 45
$g.FillPath($brush, $path)

# Subtle border
$borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 255, 255, 255)), 1.5
$g.DrawPath($borderPen, $path)

# Draw box seam icon:
# Top face, left face, right face, seams
# Center is (32, 32)
$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 2.4
$pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

# Box isometric outline points:
# Center top: (32, 16)
# Right top: (48, 25)
# Right bottom: (48, 43)
# Bottom center: (32, 52)
# Left bottom: (16, 43)
# Left top: (16, 25)
# Center junction: (32, 34)

$ptsOuter = @(
    (New-Object System.Drawing.PointF 32, 16),
    (New-Object System.Drawing.PointF 48, 25),
    (New-Object System.Drawing.PointF 48, 43),
    (New-Object System.Drawing.PointF 32, 52),
    (New-Object System.Drawing.PointF 16, 43),
    (New-Object System.Drawing.PointF 16, 25)
)
$g.DrawPolygon($pen, $ptsOuter)

# Y-split inside:
# Center (32, 34) to Center top (32, 16) -- seam
# Center (32, 34) to Bottom center (32, 52)
# Center (32, 34) to Left top (16, 25)
# Center (32, 34) to Right top (48, 25)

$g.DrawLine($pen, 32, 34, 32, 52)
$g.DrawLine($pen, 32, 34, 16, 25)
$g.DrawLine($pen, 32, 34, 48, 25)

# Box seams (tape lines across top)
$seamPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(230, 255, 255, 255)), 2
$g.DrawLine($seamPen, 32, 16, 32, 34)
$g.DrawLine($seamPen, 24, 20.5, 40, 29.5)

# Save PNG
$bmp.Save("assets/images/favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save("assets/images/apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Output "Successfully generated assets/images/favicon.png and apple-touch-icon.png"
