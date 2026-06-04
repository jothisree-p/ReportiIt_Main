# Run React app the way Vite expects (required for UI fixes + API proxy).
# Do NOT open index.html directly in Visual Studio — that skips Vite and shows old/broken UI.

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

Write-Host ""
Write-Host "ReportIt frontend" -ForegroundColor Cyan
Write-Host "  Folder: $here"
Write-Host "  URL:    http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "If Visual Studio browser looks wrong, use Edge/Chrome at the URL above after this starts."
Write-Host "Hard refresh: Ctrl+Shift+R" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path "node_modules")) {
  Write-Host "Installing npm packages..." -ForegroundColor Yellow
  npm install
}

npm run dev
