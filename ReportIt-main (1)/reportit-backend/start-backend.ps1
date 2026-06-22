# Starts ReportIt backend (H2 local DB by default — no MySQL required)
$mvn = "$env:TEMP\apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvn)) {
    Write-Host "Maven not found. Run from project README or install Maven 3.9+."
    exit 1
}

$root = $PSScriptRoot
$profile = if ($env:SPRING_PROFILES_ACTIVE) { $env:SPRING_PROFILES_ACTIVE } else { "mysql" }
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

Write-Host "Starting auth-service (8081) with profile: $profile"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\auth-service'; `$env:SPRING_PROFILES_ACTIVE='$profile'; & '$mvn' spring-boot:run"

Start-Sleep -Seconds 12

Write-Host "Starting user-management-service (8082) with profile: $profile"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\user-management-service'; `$env:SPRING_PROFILES_ACTIVE='$profile'; & '$mvn' spring-boot:run"

Write-Host ""
Write-Host "Demo accounts:"
Write-Host "  Admin:   admin@reportit.com / admin123"
Write-Host "  Officer: officer@reportit.com / officer123"
Write-Host "  Citizen: register via signup page"
