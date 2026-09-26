@echo off
title AI Food Waste Management System - Launcher
echo ===================================================
echo   🚀 Starting AI Food Waste Management System
echo ===================================================
echo.

set SCRIPT_DIR=%~dp0

echo [1/3] Seeding Backend Database Engine...
cd /d "%SCRIPT_DIR%server"
call node seed.js
echo.

echo [2/3] Launching Express & Socket.IO Backend (Port 5000)...
start "NourishAI Backend Server" cmd /k "cd /d %SCRIPT_DIR%server && npm start"

echo [3/3] Launching React Vite Frontend (Port 5173)...
start "NourishAI Frontend Client" cmd /k "cd /d %SCRIPT_DIR%client && npm run dev"

echo.
echo ===================================================
echo   ✅ Both Server and Client are running!
echo   Opening http://localhost:5173 in browser...
echo ===================================================
timeout /t 3 >nul
start http://localhost:5173

pause
