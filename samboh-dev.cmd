@echo off
setlocal enabledelayedexpansion

:: ===== 경로/리포 =====
set ROOT=C:\samboh
set WEB=%ROOT%\samboh-web
set TOOLS=%ROOT%\tools
set REPO_URL=https://github.com/rlwjd5454/samboh-test.git
set BRANCH=main

cd /d "%ROOT%" || (echo [ERROR] %ROOT% 없음 & pause & exit /b 1)

:: ===== nested .git 제거(서브모듈 방지) =====
if exist "%WEB%\.git"  rmdir /s /q "%WEB%\.git"
if exist "%TOOLS%\.git" rmdir /s /q "%TOOLS%\.git"

:: ===== git 초기화/remote =====
if not exist "%ROOT%\.git" (
  git init
  git branch -M %BRANCH%
)
for /f "tokens=*" %%u in ('git remote get-url origin 2^>nul') do set CUR_REMOTE=%%u
if not defined CUR_REMOTE (git remote add origin %REPO_URL%) else (git remote set-url origin %REPO_URL%)

:: ===== .gitignore(없을 때만) =====
if not exist "%ROOT%\.gitignore" (
  > ".gitignore" echo node_modules/
  >>".gitignore" echo dist/
  >>".gitignore" echo .cache/
  >>".gitignore" echo .DS_Store
  >>".gitignore" echo Thumbs.db
  >>".gitignore" echo *.log
  >>".gitignore" echo **/.env*
  >>".gitignore" echo coverage/
)

:: ===== 1회 백업(변경분만 커밋) =====
git add -A
git diff --cached --quiet || git commit -m "auto: backup %date% %time%"
git rev-parse --abbrev-ref --symbolic-full-name @{u} 1>nul 2>nul
if %errorlevel% neq 0 (git push -u origin %BRANCH%) else (git push)

:: ===== 자동 백업 루프 스크립트 생성(없을 때만) =====
if not exist "%ROOT%\samboh-auto-10min.cmd" (
  >"%ROOT%\samboh-auto-10min.cmd" echo @echo off
  >>"%ROOT%\samboh-auto-10min.cmd" echo setlocal
  >>"%ROOT%\samboh-auto-10min.cmd" echo cd /d "%ROOT%"
  >>"%ROOT%\samboh-auto-10min.cmd" echo :loop
  >>"%ROOT%\samboh-auto-10min.cmd" echo git add -A
  >>"%ROOT%\samboh-auto-10min.cmd" echo git diff --cached --quiet ^|^| git commit -m "auto: backup %%date%% %%time%%"
  >>"%ROOT%\samboh-auto-10min.cmd" echo git push
  >>"%ROOT%\samboh-auto-10min.cmd" echo timeout /t 600 /nobreak ^>nul
  >>"%ROOT%\samboh-auto-10min.cmd" echo goto loop
)

:: ===== 자동 백업 창 중복 실행 방지 후 실행 =====
for /f "tokens=*" %%P in ('tasklist /v ^| findstr /I "samboh AUTO BACKUP (10min)"') do set ABRUN=1
if not defined ABRUN (
  start "samboh AUTO BACKUP (10min)" cmd /k "cd /d "%ROOT%" && call samboh-auto-10min.cmd"
) else (
  echo [INFO] 자동 백업 창 이미 실행 중
)

:: ===== 개발용 CMD 실행 =====
if exist "%WEB%\package.json" (
  if not exist "%WEB%\node_modules" (
    start "samboh-web DEV" cmd /k "cd /d "%WEB%" && npm install && npm run dev"
  ) else (
    start "samboh-web DEV" cmd /k "cd /d "%WEB%" && npm run dev"
  )
) else (
  start "samboh-web" cmd /k "cd /d "%WEB%""
)

echo [READY] DEV 창 + 10분 자동백업 창 실행됨.
exit /b 0
