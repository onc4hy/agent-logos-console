# MCP (Model Context Protocol) 模块

MCP (Model Context Protocol) 模块提供与 ChatGLM Web Search API 集成的功能，支持网络搜索和上下文管理。

## 功能特性

1. 与 ChatGLM Web Search API 集成
2. 支持网络搜索功能
3. 上下文管理协议实现
4. 流式响应支持 (SSE)
5. 完整的错误处理机制
6. Swagger API 文档支持

## 环境变量配置

在使用 MCP 模块之前，需要在 `.env` 文件中配置以下环境变量：

```env
# ChatGLM API 密钥 (必需)
CHATGLM_API_KEY=your_api_key_here

# ChatGLM API 基础 URL (可选，默认为官方地址)
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
  "query": "人工智能的最新发展",
  "model": "glm-4", // 可选，默认为 glm-4
  "temperature": 0.8, // 可选，默认为 0.8
  "top_p": 0.8 // 可选，默认为 0.8
}
```

- **响应**: SSE 流式响应

## 使用示例

### 前端使用 SSE 连接示例

```javascript
const eventSource = new EventSource('/mcp/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: "人工智能的最新发展"
  })
});

eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

eventSource.onerror = function(event) {
  console.error('Error:', event);
};
```

## 注意事项

1. 需要有效的 ChatGLM API 密钥才能使用此功能
2. 确保网络可以访问 ChatGLM API 服务
3. 流式响应需要客户端支持 SSE