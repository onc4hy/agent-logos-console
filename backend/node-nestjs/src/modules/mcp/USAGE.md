# MCP 模块使用指南

MCP (Model Chat Provider) 模块提供与 ChatGLM 最新模型服务聊天对话的功能，并支持返回 SSE (Server-Sent Events) 数据流。

## API 端点

### 与 ChatGLM 模型聊天

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

## 使用示例

### cURL 示例

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

### JavaScript (Fetch API) 示例

```javascript
const response = await fetch('/mcp/chat', {
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

// 处理 SSE 流式响应
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  console.log('Received:', chunk);
}
```

### JavaScript (EventSource) 示例

```javascript
// 注意：EventSource 通常用于 GET 请求，对于 POST 请求需要使用 Fetch API
// 以下是一个使用 Fetch API 处理 SSE 的示例

async function chatWithModel() {
  const response = await fetch('/mcp/chat', {
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
      ]
    })
  });

  // 检查响应是否成功
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // 处理流式响应
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      // 处理接收到的数据块
      console.log('Received chunk:', chunk);
      
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
  } catch (error) {
    console.error('Error reading stream:', error);
  } finally {
    reader.releaseLock();
  }
}

// 调用函数
chatWithModel();
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