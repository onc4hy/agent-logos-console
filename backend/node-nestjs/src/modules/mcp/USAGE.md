# MCP 模块使用指南

MCP (Model Context Protocol) 模块提供与 ChatGLM Web Search API 集成的功能，支持网络搜索和上下文管理。

## API 端点

### 1. 与 ChatGLM 模型聊天

- **URL**: `/mcp/chat`
- **方法**: `POST`
- **请求头**: 
  - `Content-Type: application/json`
- **请求体**:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "你好，介绍一下你自己"
    }
  ],
  "model": "glm-4",        // 可选，默认为 glm-4
  "temperature": 0.8,      // 可选，默认为 0.8
  "top_p": 0.8             // 可选，默认为 0.8
}
```

### 2. 使用 ChatGLM Web Search API 进行网络搜索

- **URL**: `/mcp/search`
- **方法**: `POST`
- **请求头**: 
  - `Content-Type: application/json`
- **请求体**:

```json
{
  "query": "人工智能的最新发展",
  "model": "glm-4",        // 可选，默认为 glm-4
  "temperature": 0.8,      // 可选，默认为 0.8
  "top_p": 0.8             // 可选，默认为 0.8
}
```

## 使用示例

### cURL 示例

#### 聊天对话
```bash
curl -X POST http://localhost:3000/mcp/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "你好，介绍一下你自己"
      }
    ],
    "model": "glm-4",
    "temperature": 0.8,
    "top_p": 0.8
  }'
```

#### 网络搜索
```bash
curl -X POST http://localhost:3000/mcp/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "人工智能的最新发展",
    "model": "glm-4",
    "temperature": 0.8,
    "top_p": 0.8
  }'
```

### JavaScript (Fetch API) 示例

```javascript
// 聊天对话
const chatResponse = await fetch('/mcp/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      {
        role: 'user',
        content: '你好，介绍一下你自己'
      }
    ],
    model: 'glm-4',
    temperature: 0.8,
    top_p: 0.8
  })
});

// 网络搜索
const searchResponse = await fetch('/mcp/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: '人工智能的最新发展',
    model: 'glm-4',
    temperature: 0.8,
    top_p: 0.8
  })
});

// 处理 SSE 流式响应
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  console.log('Received:', chunk);
  
  // 如果需要解析 SSE 格式的数据
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6); // 移除 'data: ' 前缀
      if (data === '[DONE]') {
        // 流结束
        break;
      }
      try {
        const jsonData = JSON.parse(data);
        console.log('Parsed data:', jsonData);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    }
  }
}
```

## 响应格式

API 返回 SSE (Server-Sent Events) 格式的流式响应。每个数据块以 `data: ` 开头，包含 JSON 格式的响应数据。

示例响应：

```
data: {"id":"chat-123","created":1234567890,"model":"glm-4","choices":[{"index":0,"delta":{"role":"assistant","content":"你好"},"finish_reason":null}]}

data: {"id":"chat-123","created":1234567890,"model":"glm-4","choices":[{"index":0,"delta":{"content":"！"},"finish_reason":null}]}

data: {"id":"chat-123","created":1234567890,"model":"glm-4","choices":[{"index":0,"delta":{"content":"我是"},"finish_reason":null}]}

data: [DONE]
```

## 错误处理

API 可能返回以下 HTTP 状态码：

- `200`: 成功（流式响应）
- `400`: 请求参数错误
- `401`: API 密钥无效
- `500`: 服务器内部错误
- `502`: 无法连接到 ChatGLM API 服务

错误响应格式：

```json
{
  "statusCode": 400,
  "message": "请求参数错误",
  "error": "Bad Request"
}
```

## 配置要求

使用此功能需要在环境变量中配置以下参数：

```env
CHATGLM_API_KEY=your_chatglm_api_key_here
```

可选配置：

```env
CHATGLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4  # 默认值
```