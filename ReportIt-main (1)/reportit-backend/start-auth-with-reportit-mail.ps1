$mvn = "$env:TEMP\apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvn)) {
    $mvn = "C:\Users\jothi\Downloads\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd"
}

if (-not (Test-Path $mvn)) {
    Write-Host "Maven not found. Install Maven or update this script's Maven path."
    exit 1
}

# Fill these with your real ReportIt mailbox SMTP details.
# Example for Gmail SMTP with an App Password:
#   REPORTIT_MAIL_HOST=smtp.gmail.com
#   REPORTIT_MAIL_PORT=587
#   REPORTIT_MAIL_USERNAME=reportit.noreply@gmail.com
#   REPORTIT_MAIL_PASSWORD=<gmail app password>
#   REPORTIT_MAIL_FROM=reportit.noreply@gmail.com
$env:REPORTIT_MAIL_HOST = if ($env:REPORTIT_MAIL_HOST) { $env:REPORTIT_MAIL_HOST } else { "smtp.gmail.com" }
$env:REPORTIT_MAIL_PORT = if ($env:REPORTIT_MAIL_PORT) { $env:REPORTIT_MAIL_PORT } else { "587" }
$env:REPORTIT_MAIL_USERNAME = if ($env:REPORTIT_MAIL_USERNAME) { $env:REPORTIT_MAIL_USERNAME } else { "reportit.noreply@gmail.com" }
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
$env:REPORTIT_MAIL_FROM = if ($env:REPORTIT_MAIL_FROM) { $env:REPORTIT_MAIL_FROM } else { $env:REPORTIT_MAIL_USERNAME }

if ([string]::IsNullOrWhiteSpace($env:REPORTIT_MAIL_USERNAME) -or [string]::IsNullOrWhiteSpace($env:REPORTIT_MAIL_PASSWORD)) {
    Write-Host "ReportIt SMTP is not configured."
    Write-Host "Set REPORTIT_MAIL_PASSWORD to your Gmail App Password before starting auth-service."
    Write-Host "Example:"
    Write-Host '  $env:REPORTIT_MAIL_HOST="smtp.gmail.com"'
    Write-Host '  $env:REPORTIT_MAIL_PORT="587"'
    Write-Host '  $env:REPORTIT_MAIL_USERNAME="reportit.noreply@gmail.com"'
    Write-Host '  $env:REPORTIT_MAIL_PASSWORD="your-gmail-app-password"'
    Write-Host '  $env:REPORTIT_MAIL_FROM="reportit.noreply@gmail.com"'
    exit 1
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$root\auth-service"
$env:SPRING_PROFILES_ACTIVE = if ($env:SPRING_PROFILES_ACTIVE) { $env:SPRING_PROFILES_ACTIVE } else { "mysql" }
& $mvn spring-boot:run
