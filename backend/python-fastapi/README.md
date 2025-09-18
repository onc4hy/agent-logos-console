# Agent Table - FastAPI Backend

这是一个使用FastAPI、SQLAlchemy和SQLite3实现的后端服务，对应Node.js NestJS版本的功能。

## 功能模块

- 用户认证（注册、登录、JWT）
- 智能体管理
- 社区功能
- 积分系统
- 支付模块
- 语音通信
- 备份功能

## 技术栈

- FastAPI - 现代、快速（高性能）的Web框架
- SQLAlchemy - Python SQL工具包和ORM
- SQLite - 轻量级数据库
- Pydantic - 数据验证和设置管理

## 目录结构

```
python-fastapi/
├── app/                 # 应用主目录
│   ├── api/            # API路由
│   ├── core/           # 核心配置和安全
│   ├── database/       # 数据库配置
│   ├── models/         # 数据模型
│   ├── schemas/        # Pydantic模型
│   └── main.py         # 应用入口
├── requirements.txt     # 依赖列表
├── .env.example         # 环境变量示例
├── README.md            # 说明文档
├── start_server.py      # 启动脚本
└── test_installation.py # 安装测试脚本
```

## 安装依赖

### 方法1：使用pip（传统方式）

```bash
# 创建虚拟环境（推荐）
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 方法2：使用uv（推荐方式）

```bash
# 安装uv（如果尚未安装）
pip install uv

# 创建虚拟环境并安装依赖
uv venv
source .venv/bin/activate  # Linux/macOS
# 或 .venv\Scripts\activate  # Windows

# 使用uv安装依赖
uv pip install -r requirements.txt

# 或者使用新的pyproject.toml（推荐）
uv pip install .
```

## 环境配置

复制 `.env.example` 文件并重命名为 `.env`，然后根据需要修改配置：

```bash
cp .env.example .env
```

## 运行应用

### 方法1：使用启动脚本（推荐）

```bash
python start_server.py
```

### 方法2：直接使用uvicorn

```bash
uvicorn app.main:app --reload
```

### 方法3：使用Python模块

```bash
python -m uvicorn app.main:app --reload
```

应用将运行在 http://localhost:8000

## API文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 测试安装

运行测试脚本验证安装是否正确：

```bash
python test_installation.py
```

## 主要API端点

### 认证模块
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 邮箱密码登录
- `POST /auth/login-phone` - 手机验证码登录
- `POST /auth/send-email-code` - 发送邮箱验证码
- `POST /auth/send-phone-code` - 发送手机验证码

### 智能体模块
- `POST /agents/` - 创建智能体
- `GET /agents/` - 获取所有智能体
- `GET /agents/{id}` - 获取指定智能体
- `PUT /agents/{id}` - 更新智能体
- `DELETE /agents/{id}` - 删除智能体
- `GET /agents/my-agents` - 获取当前用户的所有智能体
- `POST /agents/deploy` - 部署智能体

### 社区模块
- `POST /community/posts` - 创建帖子
- `GET /community/posts` - 获取所有帖子
- `GET /community/posts/{id}` - 获取指定帖子
- `PUT /community/posts/{id}` - 更新帖子
- `DELETE /community/posts/{id}` - 删除帖子
- `POST /community/comments` - 创建评论
- `GET /community/posts/{id}/comments` - 获取帖子的所有评论

### 积分模块
- `POST /points/checkin` - 签到获取积分
- `GET /points/balance` - 获取积分余额

## 数据库

应用使用SQLite数据库，默认存储在 `app.db` 文件中。首次运行时会自动创建数据库和表结构。

## 开发

### 代码结构说明

1. **models/** - SQLAlchemy数据模型
2. **schemas/** - Pydantic数据验证模型
3. **api/** - FastAPI路由和业务逻辑
4. **core/** - 安全、配置等核心功能
5. **database.py** - 数据库连接和会话管理

### 添加新功能

1. 在 `models/` 中创建数据模型
2. 在 `schemas/` 中创建Pydantic模型
3. 在 `api/` 中创建路由和业务逻辑
4. 在 `app/main.py` 中注册新路由

### 使用uv进行开发

```bash
# 安装开发依赖
uv pip install -e .[dev]

# 运行测试
uv run pytest

# 格式化代码
uv run black .

# 类型检查
uv run mypy .
```

## 生产部署

在生产环境中，请确保：

1. 设置强密钥和安全配置
2. 使用生产级数据库（如PostgreSQL）
3. 配置适当的日志记录
4. 设置适当的错误处理
5. 使用HTTPS
6. 配置适当的CORS策略