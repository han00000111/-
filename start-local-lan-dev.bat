@echo off
chcp 65001 >nul
title 机器人综合管理平台 - 局域网开发服务

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo ========================================
echo 机器人综合管理平台 - 局域网开发服务
echo ========================================
echo 当前目录：%PROJECT_DIR%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，请先安装 Node.js LTS。
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 npm，请确认 Node.js 安装正确。
  pause
  exit /b 1
)

if not exist node_modules (
  call npm install
)

echo [启动] Vite 局域网开发服务启动中...
echo 请在同一局域网设备中访问：
echo http://本机IP:5173/robot-integrated-management-platform/
echo.

call npm run dev:lan

pause
