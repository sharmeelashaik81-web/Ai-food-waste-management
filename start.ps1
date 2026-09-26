# AI Food Waste Management System - PowerShell Launcher

Write-Host "===================================================" -ForegroundColor Green
Write-Host "  🚀 Starting AI Food Waste Management System" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/3] Seeding Backend Database Engine..." -ForegroundColor Cyan
Set-Location "$scriptDir\server"
node seed.js

Write-Host "`n[2/3] Launching Express & Socket.IO Backend (Port 5000)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k cd /d `"$scriptDir\server`" && npm start"

Write-Host "`n[3/3] Launching React Vite Frontend (Port 5173)..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k cd /d `"$scriptDir\client`" && npm run dev"

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host "`n✅ Platform launched successfully! Access at http://localhost:5173" -ForegroundColor Green
