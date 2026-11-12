@echo off
title Mamtha Creations - Phone & PC Billing Server
color 0A
cls

cd /d "%~dp0"

echo ============================================================
echo   MAMTHA CREATIONS - BOUTIQUE BILLING & INVOICING SYSTEM
echo   Bespoke Fashion ^& Bridal Stitching Studio
echo   Patancheru, Hyderabad ^| Phone: +91 9515072693
echo ============================================================
echo.
echo Starting Mamtha Creations billing server...
echo.

node server.js
if %errorlevel% neq 0 (
    echo.
    echo Node.js not found, falling back to Python...
    start "" "http://localhost:8081/index.html"
    python -m http.server 8081 --bind 0.0.0.0 --directory "%~dp0"
)
pause
