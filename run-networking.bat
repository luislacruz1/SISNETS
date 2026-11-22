@echo off
setlocal
title Networking de Trabajadores Sociales - Frontend
color 0B

echo ============================================================
echo   NETWORKING DE TRABAJADORES SOCIALES - REACT 19 + VITE
echo   Tecnologia Identica a SISGEIN
echo ============================================================
echo.

set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

if exist "node_modules" goto :START_SERVER

echo [!] Instalando dependencias de Node...
call npm install

:START_SERVER
echo.
echo ============================================================
echo   Iniciando Servidor Web en Desarrollo...
echo ============================================================
echo.
echo   - Aplicacion Web: http://localhost:5180
echo.

call npm run dev
pause
