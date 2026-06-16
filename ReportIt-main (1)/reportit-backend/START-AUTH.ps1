# Auth service only (port 8081) — keep window OPEN until you see Tomcat started
$mvn = "$env:TEMP\apache-maven-3.9.6\bin\mvn.cmd"
Set-Location $PSScriptRoot\auth-service
$env:SPRING_PROFILES_ACTIVE = "mysql"
Write-Host "Starting auth-service on 8081..." -ForegroundColor Cyan
& $mvn spring-boot:run
