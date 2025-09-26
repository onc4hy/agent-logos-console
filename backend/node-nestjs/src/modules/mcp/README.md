# MCP (Model Context Protocol) 模块

MCP (Model Context Protocol) 模块提供与 ChatGLM Web Search API 集成的功能，支持网络搜索和上下文管理。

## 功能特性

1. 与 ChatGLM Web Search API 集成
2. 支持网络搜索功能
3. 上下文管理协议实现
4. 流式响应支持 (SSE)
5. 完整的错误处理机制
6. Swagger API 文档支持
7. 符合Model Context Protocol协议的API端点

## 环境变量配置

在使用本模块之前，请确保设置了以下环境变量：

```bash
CHATGLM_API_KEY=your_api_key_here
CHATGLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
```

## API 接口

### 使用 ChatGLM Web Search API 进行搜索

- **URL**: `/mcp/search`
- **方法**: `POST`
- **请求头**: `Content-Type: application/json`
- **请求体**:

```json
{
  "query": "搜索查询",      // 必需
  "model": "glm-4",        // 可选，默认为 glm-4
  "temperature": 0.8,      // 可选，默认为 0.8
  "top_p": 0.8             // 可选，默认为 0.8
}
```

### MCP协议端点

#### 初始化连接

- **URL**: `/mcp/initialize`
- **方法**: `POST`
- **请求体**: 初始化请求对象
- **响应**: 服务器能力列表

#### 列出工具

- **URL**: `/mcp/tools/list`
- **方法**: `POST`
- **请求体**: 列出工具请求对象
- **响应**: 可用工具列表

#### 调用工具

- **URL**: `/mcp/tools/call`
- **方法**: `POST`
- **请求体**: 调用工具请求对象
- **响应**: 工具调用结果

## 使用示例

### 前端使用 SSE 连接示例

```javascript
const eventSource = new EventSource('/mcp/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: '人工智能的最新发展',
    model: 'glm-4',
    temperature: 0.8,
    top_p: 0.8
  })
});
```

### 使用MCP协议示例

```javascript
// 初始化MCP连接
const initResponse = await fetch('/mcp/initialize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    protocolVersion: '2024-05-18',
    capabilities: ['tools', 'resources']
  })
});

// 列出可用工具
const toolsResponse = await fetch('/mcp/tools/list', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
});

// 调用搜索工具
const searchResponse = await fetch('/mcp/tools/call', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'web-search',
    arguments: {
      query: '人工智能的最新发展'
    }
  })
});
```