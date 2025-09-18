#!/bin/bash

# Agent Table FastAPI 后端 - 使用uv设置脚本

echo "🚀 设置 Agent Table FastAPI 后端环境 (使用 uv)"

# 检查uv是否已安装
if ! command -v uv &> /dev/null
then
    echo "⚠️  uv 未找到，正在安装..."
    pip install uv
fi

echo "🔧 创建虚拟环境..."
uv venv

echo "🔧 激活虚拟环境..."
source .venv/bin/activate

echo "🔧 安装项目依赖..."
uv pip install .

echo "🔧 安装开发依赖..."
uv pip install -e .[dev]

echo "✅ 环境设置完成！"
echo "💡 要激活环境，请运行: source .venv/bin/activate"
echo "💡 要运行服务器，请运行: python start_server.py"
echo "💡 要运行测试，请运行: pytest"