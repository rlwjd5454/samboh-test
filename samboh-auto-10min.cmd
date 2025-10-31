@echo off
setlocal
cd /d "C:\samboh"
:loop
git add -A
git diff --cached --quiet || git commit -m "auto: backup %date% %time%"
git push
timeout /t 600 /nobreak >nul
goto loop
