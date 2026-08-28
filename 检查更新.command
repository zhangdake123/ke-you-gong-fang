#!/bin/bash
# ============================================
# 课游工坊 — 检查更新脚本
# ============================================

cd "$(dirname "$0")"

echo "========================================"
echo "  课游工坊 — 检查更新"
echo "========================================"
echo ""

# 检查 git
if ! command -v git &>/dev/null; then
  echo "[提示] 未检测到 git，这是正常的。"
  echo "在线版：https://ke-you-gong-fang-1thc.vercel.app/"
  echo ""
  echo "你可以直接打开这个网址，永远使用最新版。"
  echo "本地更新需要安装 git：https://git-scm.com/downloads"
  echo ""
  read -p "按回车键退出..."
  exit 0
fi

echo "正在拉取最新代码..."
echo ""

git pull origin main 2>&1

if [ $? -ne 0 ]; then
  echo ""
  echo "[错误] 拉取失败，请检查网络连接。"
  read -p "按回车键退出..."
  exit 1
fi

echo ""
echo "拉取完成。正在重新构建..."
echo ""

if command -v npm &>/dev/null; then
  npm install 2>&1 | tail -3
  npm run build 2>&1
  if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 更新完成！"
    echo ""
    echo "在线版：https://ke-you-gong-fang-1thc.vercel.app/"
    echo "你可以直接打开在线版使用，永远是最新版。"
  else
    echo ""
    echo "[警告] 构建失败，不影响在线使用。"
  fi
else
  echo ""
  echo "[提示] 未检测到 npm，跳过本地构建。"
  echo ""
  echo "你已经有源码了，在线版永远是最新版："
  echo "  https://ke-you-gong-fang-1thc.vercel.app/"
fi

echo ""
read -p "按回车键退出..."
