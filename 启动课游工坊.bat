@echo off
chcp 65001 >nul
title 课游工坊 — 课堂互动游戏生成器

cd /d "%~dp0"

echo ========================================
echo   课游工坊 — 课堂互动游戏生成器
echo ========================================
echo.

if not exist "dist" (
  echo [错误] 未找到 dist 目录，请确认文件完整。
  pause
  exit /b 1
)

echo 正在启动服务...
echo 浏览器即将自动打开，请勿关闭此窗口。
echo 使用完毕后关闭此窗口即可停止服务。
echo.

:: 方案1：尝试 Python
where python >nul 2>nul
if %errorlevel%==0 (
  timeout /t 1 >nul
  start "" "http://localhost:5173"
  cd dist
  python -m http.server 5173
  goto :eof
)

where python3 >nul 2>nul
if %errorlevel%==0 (
  timeout /t 1 >nul
  start "" "http://localhost:5173"
  cd dist
  python3 -m http.server 5173
  goto :eof
)

:: 方案2：用 PowerShell 启动服务（所有 Windows 自带 PowerShell）
echo 未检测到 Python，使用 PowerShell 启动服务...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0启动服务-PowerShell.ps1"
if %errorlevel%==0 goto :eof

:: 方案3：直接用浏览器打开 HTML 文件（最后手段）
echo.
echo PowerShell 服务启动失败，尝试直接打开网页...
start "" "%~dp0dist\index.html"
echo.
echo 网页已打开。如果 AI 出题功能不可用，
echo 请安装 Python 后重新双击启动器：
echo   https://www.python.org/downloads/
echo 安装时请勾选 "Add Python to PATH"
echo.
pause
