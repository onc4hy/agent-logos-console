# Agent Table FastAPI 后端 - Makefile

# 默认目标
.PHONY: help
help:
	@echo "Agent Table FastAPI 后端 - 开发命令"
	@echo ""
	@echo "命令列表:"
	@echo "  setup-uv     - 使用 uv 设置开发环境"
	@echo "  dev-uv       - 使用 uv 启动开发服务器"
	@echo "  test         - 运行测试"
	@echo "  format       - 格式化代码"
	@echo "  lint         - 代码检查"
	@echo "  type-check   - 类型检查"
	@echo "  clean        - 清理临时文件"
	@echo "  install-uv   - 安装 uv (如果尚未安装)"

# 安装 uv
.PHONY: install-uv
install-uv:
	@echo "📦 安装 uv..."
	pip install uv

# 使用 uv 设置开发环境
.PHONY: setup-uv
setup-uv:
	@echo "🔧 使用 uv 设置开发环境..."
	./scripts/setup_with_uv.sh

# 使用 uv 启动开发服务器
.PHONY: dev-uv
dev-uv:
	@echo "🚀 使用 uv 启动开发服务器..."
	./scripts/dev_with_uv.sh

# 运行测试
.PHONY: test
test:
	@echo "🧪 运行测试..."
	uv run pytest

# 格式化代码
.PHONY: format
format:
	@echo "🎨 格式化代码..."
	uv run black .

# 代码检查
.PHONY: lint
lint:
	@echo "🔍 代码检查..."
	uv run flake8 .

# 类型检查
.PHONY: type-check
type-check:
	@echo "_typeDefinition 类型检查..."
	uv run mypy .

# 清理临时文件
.PHONY: clean
clean:
	@echo "🧹 清理临时文件..."
	rm -rf .venv
	rm -rf __pycache__
	rm -rf */__pycache__
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete