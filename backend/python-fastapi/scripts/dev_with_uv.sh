#!/bin/bash

# Agent Table FastAPI 后端 - 使用uv的开发脚本

echo "🚀 启动 Agent Table FastAPI 开发环境 (使用 uv)"

# 检查uv是否已安装
if ! command -v uv &> /dev/null
then
    echo "⚠️  uv 未找到，正在安装..."
    pip install uv
fi

# 检查虚拟环境是否存在
if [ ! -d ".venv" ]; then
    echo "🔧 创建虚拟环境..."
    uv venv
fi

echo "🔧 激活虚拟环境..."
source .venv/bin/activate

echo "🔧 安装/更新依赖..."
uv pip install -e .[dev]

echo "🔄 启动开发服务器..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000