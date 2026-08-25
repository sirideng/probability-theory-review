@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PROB_NODE=C:\Users\Siri\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if not exist "%PROB_NODE%" (
  echo 未找到 Codex 自带的 Node.js 运行环境。
  echo 请安装 Node.js 后，在当前文件夹运行 npm install 和 npm run dev。
  pause
  exit /b 1
)

if not exist "node_modules\vite\bin\vite.js" (
  echo 项目依赖尚未安装，请先运行 pnpm install。
  pause
  exit /b 1
)

echo 正在启动概率论学习网站...
echo 浏览器地址：http://127.0.0.1:5173
start "" "http://127.0.0.1:5173"
"%PROB_NODE%" ".\node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173

