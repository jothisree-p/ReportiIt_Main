# ReportIt — start backend (run this FIRST, wait for both ports, then start frontend)
$ErrorActionPreference = "Stop"

$mvn = "$env:TEMP\apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvn)) {
    Write-Host "Downloading Maven..."
    $zip = "$env:TEMP\apache-maven.zip"
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath $env:TEMP -Force
}

$root = $PSScriptRoot
$env:SPRING_PROFILES_ACTIVE = "mysql"
$env:REPORTIT_MAIL_HOST = if ($env:REPORTIT_MAIL_HOST) { $env:REPORTIT_MAIL_HOST } else { "smtp.gmail.com" }
$env:REPORTIT_MAIL_PORT = if ($env:REPORTIT_MAIL_PORT) { $env:REPORTIT_MAIL_PORT } else { "587" }
$env:REPORTIT_MAIL_USERNAME = if ($env:REPORTIT_MAIL_USERNAME) { $env:REPORTIT_MAIL_USERNAME } else { "reportit.noreply@gmail.com" }
$env:REPORTIT_MAIL_FROM = if ($env:REPORTIT_MAIL_FROM) { $env:REPORTIT_MAIL_FROM } else { $env:REPORTIT_MAIL_USERNAME }

if ([string]::IsNullOrWhiteSpace($env:REPORTIT_MAIL_PASSWORD)) {
    $securePassword = Read-Host "Enter Gmail App Password for $env:REPORTIT_MAIL_USERNAME" -AsSecureString
    $passwordPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    try {
        $env:REPORTIT_MAIL_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPtr)
    } finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPtr)
    }
}

$env:REPORTIT_MAIL_PASSWORD = $env:REPORTIT_MAIL_PASSWORD -replace "\s", ""
if ($env:REPORTIT_MAIL_PASSWORD.Length -lt 16) {
    Write-Host "Invalid Gmail App Password. Paste the 16-character App Password, not your Gmail login password." -ForegroundColor Red
    exit 1
}

Write-Host "=== Step 1: Starting auth-service on port 8081 ===" -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "cd '$root\auth-service'; `$env:SPRING_PROFILES_ACTIVE='mysql'; Write-Host 'AUTH SERVICE - wait for Tomcat started on port 8081'; & '$mvn' spring-boot:run"
)

Write-Host "Waiting 20 seconds for auth-service..."
Start-Sleep -Seconds 20

Write-Host "=== Step 2: Starting user-management on port 8082 ===" -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
    "-NoExit", "-Command",
    "cd '$root\user-management-service'; `$env:SPRING_PROFILES_ACTIVE='mysql'; Write-Host 'USER MANAGEMENT - wait for Tomcat started on port 8082'; & '$mvn' spring-boot:run"
)

Write-Host ""
Write-Host "=== Step 3: When BOTH windows show 'Tomcat started', run frontend ===" -ForegroundColor Green
Write-Host @"

  cd `"$root\..\ReportIt-main (1)\ReportIt-main`"
  npm install
  npm run dev

"@ -ForegroundColor Yellow

Write-Host "=== Test logins ===" -ForegroundColor Green
Write-Host "  Admin:   admin@reportit.com / admin123"
Write-Host "  Officer: officer@reportit.com / officer123"
Write-Host "  URL:     http://localhost:5173/admin-login"
