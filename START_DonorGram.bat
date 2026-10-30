@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Install Node.js 20 LTS first & pause & exit /b 1)
if not exist .env (
  copy .env.example .env
  echo Fill Firebase settings in .env, then run this file again.
  notepad .env
  pause
  exit /b 0
)
if not exist node_modules call npm install
call npm run dev
pause
