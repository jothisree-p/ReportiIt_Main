# Auth service only (port 8081) - keep this window open until Tomcat starts.
$mvn = "$env:TEMP\apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvn)) {
    $mvn = "C:\Users\jothi\Downloads\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd"
}

if (-not (Test-Path $mvn)) {
    Write-Host "Maven not found. Install Maven or update this script's Maven path." -ForegroundColor Red
    exit 1
}

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

Write-Host "Stopping old auth-service or anything listening on port 8081..." -ForegroundColor Yellow
$authProcesses = Get-CimInstance Win32_Process -Filter "Name = 'java.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -like "*auth-service*" } |
    Select-Object -ExpandProperty ProcessId

$portProcesses = @()
try {
    $portProcesses = Get-NetTCPConnection -LocalPort 8081 -State Listen -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique
} catch {
    $portProcesses = @()
}

@($authProcesses + $portProcesses) |
    Where-Object { $_ } |
    Select-Object -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

Set-Location "$PSScriptRoot\auth-service"
Write-Host "Starting auth-service on 8081..." -ForegroundColor Cyan
Write-Host "SMTP: $env:REPORTIT_MAIL_USERNAME via $env:REPORTIT_MAIL_HOST:$env:REPORTIT_MAIL_PORT" -ForegroundColor Cyan
& $mvn spring-boot:run
