@echo off
setlocal

set "MVN_VERSION=3.9.8"
set "MVN_CACHE_DIR=%LOCALAPPDATA%\maven"
set "MVN_HOME=%MVN_CACHE_DIR%\apache-maven-%MVN_VERSION%"

if exist "%MVN_HOME%\bin\mvn.cmd" goto :run_mvn

echo Maven %MVN_VERSION% no encontrado. Descargando...
if not exist "%MVN_CACHE_DIR%" mkdir "%MVN_CACHE_DIR%"

set "MVN_URL=https://archive.apache.org/dist/maven/maven-3/%MVN_VERSION%/binaries/apache-maven-%MVN_VERSION%-bin.zip"
set "ZIP_FILE=%TEMP%\maven-%MVN_VERSION%.zip"

powershell -Command "try { Invoke-WebRequest -Uri '%MVN_URL%' -OutFile '%ZIP_FILE%' -UseBasicParsing } catch { exit 1 }"
if errorlevel 1 (
    echo ERROR: No se pudo descargar Maven. Verifica tu conexion a internet.
    exit /b 1
)

powershell -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%MVN_CACHE_DIR%' -Force"
del "%ZIP_FILE%"

if not exist "%MVN_HOME%\bin\mvn.cmd" (
    echo ERROR: No se pudo extraer Maven correctamente.
    exit /b 1
)

echo Maven %MVN_VERSION% descargado en %MVN_HOME%

:run_mvn
"%MVN_HOME%\bin\mvn.cmd" %*
