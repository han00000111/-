@echo off
chcp 65001 >nul
title 机器人综合管理平台 - 本地开发服务

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo ========================================
echo 机器人综合管理平台 - 本地开发服务
echo ========================================
echo 当前目录：%PROJECT_DIR%
echo 固定地址：http://127.0.0.1:5173/robot-integrated-management-platform/
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
  echo [初始化] 未检测到 node_modules，开始安装依赖...
  call npm install
  if errorlevel 1 (
    echo [错误] npm install 失败。
    pause
    exit /b 1
  )
)

echo [检查] 检查 5173 端口是否被占用...
netstat -ano | findstr ":5173" >nul
if not errorlevel 1 (
  echo [提示] 5173 端口可能已被占用。
  echo 如果项目已经启动，请直接访问：
  echo http://127.0.0.1:5173/robot-integrated-management-platform/
  echo.
  echo 如果页面打不开，请关闭旧的 node / cmd 窗口后重试。
  echo.
)

echo [启动] Vite 本地开发服务启动中...
echo 保存代码后，页面会自动热更新。
echo.

timeout /t 2 >nul
start "" "http://127.0.0.1:5173/robot-integrated-management-platform/"

call npm run dev:local

pause
