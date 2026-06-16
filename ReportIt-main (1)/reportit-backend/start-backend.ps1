# Starts ReportIt backend (H2 local DB by default — no MySQL required)
$mvn = "$env:TEMP\apache-maven-3.9.6\bin\mvn.cmd"
if (-not (Test-Path $mvn)) {
    Write-Host "Maven not found. Run from project README or install Maven 3.9+."
    exit 1
}

$root = $PSScriptRoot
$profile = if ($env:SPRING_PROFILES_ACTIVE) { $env:SPRING_PROFILES_ACTIVE } else { "mysql" }

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
