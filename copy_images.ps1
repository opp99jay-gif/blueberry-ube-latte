$ErrorActionPreference = "Stop"
$sourceDir = "$PSScriptRoot\ezgif-3ce4fd91f0c74502-jpg"
$destDir = "$PSScriptRoot\latte-landing\public\sequence"

if (-Not (Test-Path $destDir)) {
    mkdir $destDir -Force | Out-Null
}

$files = Get-ChildItem -Path "$sourceDir\*.jpg" | Sort-Object Name
$totalFrames = 120
$sourceFrames = $files.Count

for ($i = 0; $i -lt $totalFrames; $i++) {
    $idx = [Math]::Min([Math]::Floor(($i / $totalFrames) * $sourceFrames), $sourceFrames - 1)
    $sourceFile = $files[$idx].FullName
    $destFile = Join-Path $destDir "latte_frame_$i.webp"
    
    Copy-Item -Path $sourceFile -Destination $destFile -Force
}

Write-Host "Images copied successfully using PowerShell."
