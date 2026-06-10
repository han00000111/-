@echo off
chcp 65001 >nul
title 取消开机自动启动 - 机器人综合管理平台开发服务

set STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
set SHORTCUT_PATH=%STARTUP_DIR%\机器人综合管理平台-本地开发服务.lnk

if exist "%SHORTCUT_PATH%" (
  del "%SHORTCUT_PATH%"
  echo [完成] 已删除开机启动项。
) else (
  echo [提示] 未找到开机启动项，无需删除。
)

pause
