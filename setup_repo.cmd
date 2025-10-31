@echo off
setlocal

REM === 사용자 설정 ===
set REPO_URL=https://github.com/rlwjd5454/sambohtest.git

REM === 현재 스크립트 위치로 이동 ===
cd /d "%~dp0"

REM === 깃 초기화 (이미 init 되어 있다면 오류 무시) ===
git init

REM === 기본 브랜치 main으로 통일 ===
git branch -M main 2>nul

REM === 원격 추가/재설정 ===
git remote remove origin 2>nul
git remote add origin %REPO_URL%

REM === .gitignore 생성(없으면) - 웹/노드 작업에 흔한 잡파일 제외 ===
if not exist .gitignore (
  > .gitignore echo node_modules/
  >> .gitignore echo dist/
  >> .gitignore echo .DS_Store
  >> .gitignore echo Thumbs.db
  >> .gitignore echo .env
)

REM === 첫 커밋 준비 ===
git add -A
git commit -m "chore: initial commit from setup_repo.cmd" 2>nul

REM === 원격에 푸시 ===
git push -u origin main

echo.
echo [OK] 초기 설정 및 첫 푸시 완료: %REPO_URL%
echo.
echo * 앞으로는 "samboh-dev.cmd" 를 더블클릭해서 개발/자동백업을 사용하세요.
endlocal
