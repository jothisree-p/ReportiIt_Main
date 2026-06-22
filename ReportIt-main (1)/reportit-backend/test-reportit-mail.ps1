$ErrorActionPreference = "Stop"

$smtpHost = "smtp.gmail.com"
$smtpPort = 587
$username = "reportit.noreply@gmail.com"
$from = "reportit.noreply@gmail.com"

$to = Read-Host "Send test mail to"
if ([string]::IsNullOrWhiteSpace($to)) {
    Write-Host "Recipient email is required." -ForegroundColor Red
    exit 1
}

$securePassword = Read-Host "Enter Gmail App Password for $username" -AsSecureString
$passwordPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
try {
    $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPtr)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPtr)
}

$password = $password -replace "\s", ""
if ($password.Length -lt 16) {
    Write-Host "Invalid Gmail App Password. It must be the 16-character Google App Password." -ForegroundColor Red
    exit 1
}

$credential = New-Object System.Management.Automation.PSCredential($username, (ConvertTo-SecureString $password -AsPlainText -Force))

Write-Host "Sending ReportIt SMTP test mail..." -ForegroundColor Cyan
Send-MailMessage `
    -SmtpServer $smtpHost `
    -Port $smtpPort `
    -UseSsl `
    -Credential $credential `
    -From $from `
    -To $to `
    -Subject "ReportIt SMTP Test" `
    -Body "ReportIt Gmail SMTP is working. You can now request OTP from the app."

Write-Host "Mail sent. Check the recipient inbox/spam folder." -ForegroundColor Green
