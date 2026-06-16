# User-management only (port 8082) — keep window OPEN until you see Tomcat started
$mvn = "$env:TEMP\apache-maven-3.9.6\bin\mvn.cmd"
Set-Location $PSScriptRoot\user-management-service
$env:SPRING_PROFILES_ACTIVE = "mysql"
Write-Host "Starting user-management on 8082..." -ForegroundColor Cyan
& $mvn spring-boot:run
