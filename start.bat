@echo off
setlocal
cd /d "%~dp0"
title PackWise AI Launcher
echo PackWise AI - automatic setup and launch
echo First run needs internet. Keep this window open during installation.
where node >nul 2>nul
if errorlevel 1 (
 echo ERROR: Install Node.js 18 or newer with npm, then try again.
 goto fail
)
where npm >nul 2>nul
if errorlevel 1 (
 echo ERROR: npm was not found. Reinstall Node.js with npm.
 goto fail
)
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 18 ? 0 : 1)"
if errorlevel 1 (
 echo ERROR: Node.js 18 or newer is required.
 goto fail
)
if exist ".venv\Scripts\python.exe" goto checkpython
py -3 -c "import sys; sys.exit(0 if sys.version_info >= (3,10) else 1)" >nul 2>nul
if errorlevel 1 goto trypython
py -3 -m venv .venv
if errorlevel 1 goto fail
goto checkpython
:trypython
python -c "import sys; sys.exit(0 if sys.version_info >= (3,10) else 1)" >nul 2>nul
if errorlevel 1 (
 echo ERROR: Install Python 3.10 or newer and enable Add Python to PATH.
 goto fail
)
python -m venv .venv
if errorlevel 1 goto fail
:checkpython
".venv\Scripts\python.exe" -c "import sys; sys.exit(0 if sys.version_info >= (3,10) else 1)"
if errorlevel 1 (
 echo ERROR: The existing .venv needs Python 3.10 or newer.
 goto fail
)
fc /b "backend\requirements.txt" ".venv\packwise-requirements.txt" >nul 2>nul
if errorlevel 1 goto installpython
".venv\Scripts\python.exe" -c "import fastapi, uvicorn, pydantic, jose, passlib, reportlab, qrcode, jinja2, multipart" >nul 2>nul
if errorlevel 1 goto installpython
goto frontend
:installpython
echo Installing Python dependencies...
".venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
if errorlevel 1 goto fail
copy /y "backend\requirements.txt" ".venv\packwise-requirements.txt" >nul
if errorlevel 1 goto fail
:frontend
if not exist "frontend\node_modules\.bin\vite.cmd" goto installnpm
fc /b "frontend\package.json" "frontend\node_modules\packwise-package.json" >nul 2>nul
if errorlevel 1 goto installnpm
if not exist "frontend\package-lock.json" goto launch
fc /b "frontend\package-lock.json" "frontend\node_modules\packwise-package-lock.json" >nul 2>nul
if errorlevel 1 goto installnpm
goto launch
:installnpm
echo Installing frontend dependencies...
pushd frontend
call npm install
if errorlevel 1 (
 popd
 goto fail
)
copy /y "package.json" "node_modules\packwise-package.json" >nul
if exist "package-lock.json" copy /y "package-lock.json" "node_modules\packwise-package-lock.json" >nul
popd
:launch
".venv\Scripts\python.exe" "scripts\open_browser.py" --check-ports
if errorlevel 1 goto fail
echo Starting backend and frontend...
start "PackWise Backend" cmd /k ".venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"
start "PackWise Frontend" cmd /k "cd /d frontend && npm run dev -- --host 127.0.0.1 --port 3000 --strictPort"
".venv\Scripts\python.exe" "scripts\open_browser.py"
if errorlevel 1 goto fail
echo Website opened. Keep both server windows open while using the app.
exit /b 0
:fail
echo.
echo Setup or launch failed. Read the error above, resolve it, and run start.bat again.
echo No need to delete successful installations.
pause
exit /b 1
