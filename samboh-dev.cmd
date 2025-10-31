@echo off
setlocal

REM === 프로젝트 루트로 이동 ===
cd /d "%~dp0"

REM (옵션) Node 프로젝트면 의존성 설치
if exist package.json (
  echo [INFO] package.json detected. Running npm install (first time may take a while)...
  call npm install
)

REM === PowerShell 실행 정책 완화(현재 세션 한정) 후 watcher.ps1 실행 ===
start "SAMBOH-AutoBackup" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0watcher.ps1" -PathToWatch "%~dp0" -DebounceSec 8 -Branch main

REM === 웹 개발 서버 실행(있으면). 없으면 index.html을 브라우저로 오픈 ===
if exist package.json (
  if not exist node_modules (
    echo [WARN] node_modules not found, attempting npm install...
    call npm install
  )
  REM dev 스크립트가 있으면 dev 서버 기동
  for /f "delims=" %%A in ('powershell -NoProfile -Command "(Get-Content package.json) -join ''"') do set "PKG=%%A"
  echo %PKG% | findstr /i "\"dev\":" >nul
  if %errorlevel%==0 (
    start "SAMBOH-WebDev" cmd /k "npm run dev"
  ) else (
    echo [INFO] package.json은 있지만 "dev" 스크립트가 없네요. index.html을 엽니다.
    if exist index.html start "" "%CD%\index.html"
  )
) else (
  echo [INFO] package.json이 없네요. 정적 페이지라면 index.html을 엽니다.
  if exist index.html start "" "%CD%\index.html"
)

REM === 수동 작업/명령용 CMD 창 ===
start "SAMBOH-ManualCMD" cmd /k "title SAMBOH Manual CMD & echo Ready. Here you can run git log, npm run build, etc."

echo.
echo [READY] samboh-dev 환경이 열렸습니다.
echo - AutoBackup 창: 변경 감지 시 자동 커밋/푸시
echo - WebDev 창: npm run dev(있으면) 실행됨
echo - ManualCMD 창: 수동 명령/편집용
echo.
endlocal
