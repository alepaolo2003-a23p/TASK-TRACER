@echo off
title Task Tracker
echo ============================================
echo  Task Tracker - Iniciando aplicacion
echo ============================================
echo.

echo [1/2] Arrancando backend (puerto 8080)...
start "TaskTracker-Backend" cmd /k "cd /d %~dp0backend && .\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local"

timeout /t 30 /nobreak >nul

echo [2/2] Arrancando frontend (puerto 5173)...
start "TaskTracker-Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ============================================
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:8080
echo  Swagger:  http://localhost:8080/swagger-ui.html
echo ============================================
echo.
echo Cerrando esta ventana no detiene los procesos.
echo Para detenerlos, cierra las ventanas de backend y frontend.
pause
