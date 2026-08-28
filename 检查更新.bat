@echo off
chcp 65001 >nul
title 课游工坊 — 检查更新

cd /d "%~dp0"

echo ========================================
echo   课游工坊 — 检查更新
echo ========================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
  echo [提示] 未检测到 git，这是正常的。
  echo.
  echo 在线版永远是最新版，请直接打开：
  echo   https://ke-you-gong-fang-1thc.vercel.app/
  echo.
  pause
  exit /b 0
)

echo 正在拉取最新代码...
echo.

git pull origin main
if %errorlevel% neq 0 (
  echo.
  echo [错误] 拉取失败，请检查网络连接。
  pause
  exit /b 1
)

echo.
echo 拉取完成。正在重新构建...
echo.

where npm >nul 2>nul
if %errorlevel% equ 0 (
  call npm install 2>&1 | findstr "built in"
  call npm run build 2>&1
  if %errorlevel% equ 0 (
    echo.
    echo ✓ 更新完成！
    echo.
    echo 在线版永远最新：https://ke-you-gong-fang-1thc.vercel.app/
  ) else (
    echo.
    echo [警告] 构建失败，不影响在线使用。
  )
) else (
  echo.
  echo [提示] 未检测到 npm，跳过本地构建。
  echo.
  echo 直接访问在线版即可，永远是最新版：
  echo   https://ke-you-gong-fang-1thc.vercel.app/
)

echo.
pause
