@echo off
chcp 65001 >nul
title 安装开机自动启动 - 机器人综合管理平台开发服务

set PROJECT_DIR=%~dp0
set TARGET_BAT=%PROJECT_DIR%start-local-dev.bat
set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set SHORTCUT_PATH=%STARTUP_DIR%\机器人综合管理平台-本地开发服务.lnk

if not exist "%TARGET_BAT%" (
  echo [错误] 未找到 start-local-dev.bat
  echo 请确认 install-dev-autostart.bat 和 start-local-dev.bat 都在项目根目录。
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT_PATH%'); $Shortcut.TargetPath = '%TARGET_BAT%'; $Shortcut.WorkingDirectory = '%PROJECT_DIR%'; $Shortcut.WindowStyle = 1; $Shortcut.Description = '机器人综合管理平台本地开发服务'; $Shortcut.Save()"

if errorlevel 1 (
  echo [错误] 创建开机启动快捷方式失败。
  pause
  exit /b 1
)

echo [完成] 已添加到 Windows 开机启动项。
echo 启动项位置：
echo %SHORTCUT_PATH%
echo.
echo 重启电脑后会自动启动本地开发服务。
echo 固定访问地址：
echo http://127.0.0.1:5173/robot-integrated-management-platform/
pause
