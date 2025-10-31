@echo off
setlocal enabledelayedexpansion

:: ===== 경로/리포 설정 =====
set ROOT=C:\samboh
set WEB=%ROOT%\samboh-web
set TOOLS=%ROOT%\tools
set REPO_URL=https://github.com/rlwjd5454/samboh-test.git
set BRANCH=main

:: ===== 루트로 이동 =====
cd /d "%ROOT%" || (echo [ERROR] %ROOT% 없음 & pause & exit /b 1)

:: ===== git 초기화 및 브랜치 =====
if not exist "%ROOT%\.git" (
  git init
  git branch -M %BRANCH%
)

:: ===== remote 설정 =====
for /f "tokens=*" %%u in ('git remote get-url origin 2^>nul') do set CUR_REMOTE=%%u
if not defined CUR_REMOTE (
  git remote add origin %REPO_URL%
) else (
  git remote set-url origin %REPO_URL%
)

:: ===== .gitignore 자동 생성(없을 때만) =====
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

:: 이미 추적 중인 node_modules 제거(있을 경우)
if exist "%WEB%\node_modules" git rm -r --cached "%WEB%\node_modules" 2>nul

:: ===== 스테이징/커밋/푸시 =====
git add -A

:: 변경 없으면 커밋 생략
git diff --cached --quiet
if %errorlevel%==0 (
  echo [INFO] 변경 없음. 푸시만 시도.
) else (
  for /f "tokens=1-3 delims=.:/ " %%a in ("%date% %time%") do set TS=%%a-%%b-%%c_!time:~0,2!!time:~3,2!!
  git commit -m "auto: backup !TS!"
)

:: 첫 푸시 시 업스트림 연결
git rev-parse --abbrev-ref --symbolic-full-name @{u} 1>nul 2>nul
if %errorlevel% neq 0 (
  git push -u origin %BRANCH%
) else (
  git push
)

:: ===== 개발용 CMD 창 열기 =====
if exist "%WEB%\package.json" (
  :: node_modules 없으면 설치부터. 설치 띄우고 dev 실행.
  if not exist "%WEB%\node_modules" (
    start "samboh-web DEV" cmd /k "cd /d "%WEB%" && npm install && npm run dev"
  ) else (
    start "samboh-web DEV" cmd /k "cd /d "%WEB%" && npm run dev"
  )
) else (
  start "samboh-web" cmd /k "cd /d "%WEB%""
)

echo [DONE]
exit /b 0
