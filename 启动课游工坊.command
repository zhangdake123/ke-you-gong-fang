#!/bin/bash
# ============================================
# 课游工坊 — macOS 启动器
# 双击此文件即可打开网页使用
# ============================================

cd "$(dirname "$0")"

echo "========================================"
echo "  课游工坊 — 课堂互动游戏生成器"
echo "========================================"
echo ""

# 检查 dist 目录
if [ ! -d "dist" ]; then
  echo "[错误] 未找到 dist 目录，请确认文件完整。"
  read -p "按回车键退出..."
  exit 1
fi

# 尝试 Python3（macOS 自带）
if command -v python3 &>/dev/null; then
  echo "正在启动服务..."
  echo "浏览器即将自动打开，请勿关闭此窗口。"
  echo "使用完毕后关闭此窗口即可停止服务。"
  echo ""
  sleep 1
  open "http://localhost:5173"
  cd dist
  python3 -m http.server 5173
else
  # 兜底方案：直接打开 HTML 文件
  echo "未检测到 Python3，尝试直接打开网页..."
  open "dist/index.html"
  echo ""
  echo "网页已在浏览器中打开。"
  echo "如果页面显示正常但 AI 出题功能不可用，"
  echo "请安装命令行工具：打开终端输入 xcode-select --install"
  echo "安装完成后重新双击此文件即可。"
  echo ""
  read -p "按回车键退出..."
fi
