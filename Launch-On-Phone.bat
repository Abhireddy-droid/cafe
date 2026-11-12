@echo off
title Mamtha Creations - Phone & PC Billing Server
color 0A
cls

:: Always change directory to the folder where this batch file is located
cd /d "%~dp0"

echo ============================================================
echo   MAMTHA CREATIONS - BOUTIQUE BILLING & INVOICING SYSTEM
echo   Bespoke Fashion ^& Bridal Stitching Studio
echo   Patancheru, Hyderabad ^| Phone: +91 9515072693
echo ============================================================
echo.
echo Serving App From: %~dp0
echo.
echo Detecting your Wi-Fi / Local Network IP address...

set IP=192.168.1.4
for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0 ^| findstr /v "0.0.0.0.*0.0.0.0"') do (
    set IP=%%a
)

echo.
echo ============================================================
echo   HOW TO OPEN ON YOUR MOBILE PHONE (Android / iPhone):
echo.
echo   1. Connect your phone to the SAME Wi-Fi network as this PC.
echo   2. Open Chrome (Android) or Safari (iPhone) on your phone.
echo   3. Type this address in your phone's browser:
echo.
echo      http://%IP%:8080/index.html
echo.
echo   4. To install as an app on your phone:
echo      - On Android Chrome: Tap menu (3 dots) -^> "Install app" / "Add to Home screen"
echo      - On iPhone Safari: Tap Share icon -^> "Add to Home Screen"
echo ============================================================
echo.
echo Also launching in your PC browser right now...
start "" "http://localhost:8080/index.html"
echo.
echo Server is running! Keep this black window OPEN while using on your phone.
echo Press Ctrl + C to stop the server anytime.
echo.
python -m http.server 8080 --bind 0.0.0.0 --directory "%~dp0"
pause
