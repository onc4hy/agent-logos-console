# 智能体调音台 - 安装和使用说明

## 项目开发缘起

AI Coding已经进入到代理型Coding的成熟时代，
为了正式的体验和测试AI Coding的边界，所以就有了这个项目。
至于针对功能，是随手找了一个有实际需求的目标，项目就这么产生了。
至少到代码的目前阶段，无论前后端，无论是几种类型，
都是在对话中由AI Coding 工具生成的。
可以快速的看到AI Coding 的效果.

### AI Coding 的体验报告

可浏览随手发布在 juejin.cn 上的文章 

## 项目概述

基本由AI Coding工具驱动和代码生成的智能体调音台是一个为个人或公司提供创建、编辑、配置和部署AI智能体到第三方平台的SaaS服务平台。该项目包含前端和后端两个部分。目前已具备前端:vue3(element-plus),后端:node(nestjs),python(fastapi)的实现版本。

## 前端 (frontend)

### 技术栈
- Vue 3
- Vite
- TypeScript
- Element Plus
- Tailwind CSS v4
- Pinia (状态管理)
- Vue Router

### 配色方案
项目采用Google Material Design 3风格的配色体系：
- 主色 (Primary): #0D47A1 (Ocean Deep Blue)
- 主色容器 (Primary Container): #1565C0 (Quantum Blue)
- 辅助色 (Secondary): #00B0FF (Electric Cyan)
- 辅助色容器 (Secondary Container): #26C6DA (Cyber Teal)
- 强调色 (Accent): #64DD17 (Neon Signal Green)
- 表面色 (Surface): #F5F5F7 (UI Surface)
- 错误色: #CF6679
- 成功色: #4CAF50

### 安装步骤
1. 进入前端目录：
   ```bash
   cd frontend/vue3-element-plus
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 启动开发服务器：
   ```bash
   pnpm run dev
   ```

4. 构建生产版本：
   ```bash
   pnpm run build
   ```

### 目录结构
```
frontend/vue3-element-plus
├── src/
│   ├── assets/           # 静态资源
│   ├── components/       # 组件
│   │   └── layout/       # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/           # 状态管理
│   ├── styles/           # 样式文件
│   ├── views/            # 页面视图
│   │   ├── auth/         # 认证相关页面
│   │   ├── dashboard/    # 控制台页面
│   │   ├── agents/       # 智能体相关页面
│   │   ├── chat/         # 聊天页面
│   │   ├── community/    # 社区页面
│   │   ├── points/       # 积分页面
│   │   ├── PricingView.vue  # 价格页面
│   │   ├── FaqView.vue      # 常见问题页面
│   │   └── CheckoutView.vue # 购买页面
│   └── main.ts           # 入口文件
├── public/               # 公共文件
└── index.html            # HTML模板
```

## 后端 (backend)

### 技术栈
项目包含两个后端实现：

1. **Node.js NestJS版本** (推荐用于生产环境)
   - NestJS
   - TypeORM
   - SQLite
     (使用sql.js驱动，原因是避免客户端部署时需要编译驱动)
   - WebSocket
   - Swagger

2. **Python FastAPI版本** (目前还在Node版本之后同步实现)
   - FastAPI
   - SQLAlchemy
   - SQLite
   - Uvicorn

### 功能模块
1. 认证模块 - 用户注册/登录、JWT认证
2. 智能体模块 - 智能体管理、部署到第三方平台
3. 社区模块 - 帖子发布/评论、点赞功能
4. 积分模块 - 签到、积分管理
5. 支付模块 - 支付订单、验证
6. 语音模块 - WebSocket语音通信
7. 备份模块 - 数据备份功能

### Node.js NestJS后端

#### 安装步骤
1. 进入后端目录：
   ```bash
   cd backend/node-nestjs
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 启动开发服务器：
   ```bash
   pnpm run start:dev
   ```

4. 构建生产版本：
   ```bash
   pnpm run build
   ```

#### API文档
启动后端服务后，访问 `http://localhost:3000/api` 查看Swagger API文档。

#### 数据库
项目使用SQLite数据库，运行时会自动创建数据库文件 `database.sqlite`。

### Python FastAPI后端

#### 安装步骤

##### 方法1：使用传统pip方式
1. 进入后端目录：
   ```bash
   cd backend/python-fastapi
   ```

2. 创建虚拟环境：
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   # 或 venv\Scripts\activate  # Windows
   ```

3. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

4. 启动开发服务器：
   ```bash
   python start_server.py
   ```

##### 方法2：使用uv方式（推荐）
1. 进入后端目录：
   ```bash
   cd backend/python-fastapi
   ```

2. 使用Makefile命令设置环境：
   ```bash
   make setup-uv
   ```

3. 启动开发服务器：
   ```bash
   make dev-uv
   ```

#### API文档
启动后端服务后，访问以下URL查看API文档：
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

#### 数据库
项目使用SQLite数据库，默认存储在 `app.db` 文件中。

#### uv包管理器支持
项目已配置uv包管理器支持，通过以下方式使用：
- `pyproject.toml`: 项目依赖和元数据定义
- `uv.lock`: 依赖版本锁定文件
- `Makefile`: 封装常用uv命令
- `scripts/`: uv相关脚本目录

常用uv命令：
```bash
# 设置环境
make setup-uv

# 启动开发服务器
make dev-uv

# 运行测试
make test

# 格式化代码
make format
```

## 开发指南

### 前端开发
1. 使用Tailwind CSS进行样式开发
2. 使用Element Plus组件库
3. 遵循Vue 3 Composition API模式
4. 使用Pinia进行状态管理

### 后端开发

#### Node.js NestJS版本
1. 遵循NestJS模块化架构
2. 使用TypeORM进行数据库操作
3. 使用Swagger生成API文档
4. 使用JWT进行身份认证

#### Python FastAPI版本
1. 遵循FastAPI路由架构
2. 使用SQLAlchemy进行数据库操作
3. 使用Pydantic进行数据验证
4. 使用JWT进行身份认证

## 部署说明

### 前端部署
1. 构建生产版本：
   ```bash
   cd frontend/vue3-element-plus
   pnpm run build
   ```
2. 将 `dist` 目录中的文件部署到Web服务器

### 后端部署

#### Node.js NestJS版本
1. 构建生产版本：
   ```bash
   cd backend/node-nestjs
   pnpm run build
   ```
2. 部署 `dist` 目录和 `database.sqlite` 文件到服务器
3. 设置环境变量
4. 启动服务：
   ```bash
   node dist/main.js
   ```

#### Python FastAPI版本
1. 安装依赖：
   ```bash
   cd backend/python-fastapi
   pip install -r requirements.txt
   ```
2. 部署 `app.db` 数据库文件到服务器
3. 设置环境变量
4. 启动服务：
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

## 注意事项
1. 请确保使用pnpm作为Node.js项目的包管理器
2. 前端使用Tailwind CSS v4，不要使用v3的配置
3. Node.js后端API端口默认为3000
4. Python后端API端口默认为8000
5. 前端开发服务器端口默认为5173