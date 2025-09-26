#!/bin/bash

# 测试MCP服务的脚本

echo "测试MCP初始化..."
curl -X POST http://localhost:3000/mcp/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "protocolVersion": "2024-05-18",
    "capabilities": ["tools"]
  }'

echo -e "\n\n测试列出工具..."
curl -X POST http://localhost:3000/mcp/tools/list \
  -H "Content-Type: application/json" \
  -d '{}'

echo -e "\n\n测试调用搜索工具..."
curl -X POST http://localhost:3000/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "web-search",
    "arguments": {
      "query": "人工智能的最新发展"
    }
  }'

echo -e "\n\n测试直接搜索API..."
curl -X POST http://localhost:3000/mcp/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "人工智能的最新发展"
  }'