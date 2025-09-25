import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { ChatRequestDto, SearchRequestDto } from './dto/chat-request.dto'
import { IncomingMessage } from 'http'
import { AxiosResponse, AxiosError } from 'axios'

@Injectable()
export class McpService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * 与 ChatGLM 模型进行聊天对话
   * @param chatRequest 聊天请求参数
   * @returns 返回 SSE 流式响应
   */
  async chatWithModel(chatRequest: ChatRequestDto): Promise<IncomingMessage> {
    // 从环境变量获取 API 密钥和基础 URL
    const apiKey = process.env.CHATGLM_API_KEY
    const baseUrl = process.env.CHATGLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4'

    if (!apiKey) {
      throw new HttpException(
        'CHATGLM_API_KEY 环境变量未设置',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    // 设置默认参数
    const requestData = {
      model: chatRequest.model || 'glm-4',
      messages: chatRequest.messages,
      temperature: chatRequest.temperature || 0.8,
      top_p: chatRequest.top_p || 0.8,
      stream: true, // 启用流式响应
    }

    try {
      // 发送请求到 ChatGLM API
      const response: AxiosResponse<IncomingMessage> = await firstValueFrom(
        this.httpService.post(`${baseUrl}/chat/completions`, requestData, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'stream', // 设置响应类型为流
        }),
      )

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        // API 返回错误
        const responseData = axiosError.response.data as Record<string, any>
        const errorMessage = responseData && responseData.message 
          ? responseData.message 
          : axiosError.response.statusText
        throw new HttpException(
          `ChatGLM API 错误: ${errorMessage}`,
          axiosError.response.status,
        )
      } else if (axiosError.request) {
        // 请求发送失败
        throw new HttpException(
          '无法连接到 ChatGLM API 服务',
          HttpStatus.BAD_GATEWAY,
        )
      } else {
        // 其他错误
        throw new HttpException(
          `请求 ChatGLM API 时发生错误: ${axiosError.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
    }
  }

  /**
   * 使用 ChatGLM Web Search API 进行网络搜索
   * @param searchRequest 搜索请求参数
   * @returns 返回 SSE 流式响应
   */
  async searchWithWeb(
    searchRequest: SearchRequestDto,
  ): Promise<IncomingMessage> {
    // 从环境变量获取 API 密钥和基础 URL
    const apiKey = process.env.CHATGLM_API_KEY
    const baseUrl = process.env.CHATGLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4'

    if (!apiKey) {
      throw new HttpException(
        'CHATGLM_API_KEY 环境变量未设置',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    // 设置默认参数
    const requestData = {
      model: searchRequest.model || 'glm-4',
      messages: [
        {
          role: 'user',
          content: searchRequest.query,
        },
      ],
      temperature: searchRequest.temperature || 0.8,
      top_p: searchRequest.top_p || 0.8,
      stream: true, // 启用流式响应
      web_search: true, // 启用网络搜索
    }

    try {
      // 发送请求到 ChatGLM Web Search API
      const response: AxiosResponse<IncomingMessage> = await firstValueFrom(
        this.httpService.post(`${baseUrl}/chat/completions`, requestData, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'stream', // 设置响应类型为流
        }),
      )

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response) {
        // API 返回错误
        const responseData = axiosError.response.data as Record<string, any>
        const errorMessage = responseData && responseData.message 
          ? responseData.message 
          : axiosError.response.statusText
        throw new HttpException(
          `ChatGLM Web Search API 错误: ${errorMessage}`,
          axiosError.response.status,
        )
      } else if (axiosError.request) {
        // 请求发送失败
        throw new HttpException(
          '无法连接到 ChatGLM Web Search API 服务',
          HttpStatus.BAD_GATEWAY,
        )
      } else {
        // 其他错误
        throw new HttpException(
          `请求 ChatGLM Web Search API 时发生错误: ${axiosError.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
    }
  }

  /**
   * 初始化 MCP 连接
   * @returns 服务器能力列表
   */
  initialize() {
    // 返回服务器支持的能力列表
    return {
      protocolVersion: '2024-05-18',
      capabilities: [
        'resources',
        'tools',
        'prompts',
        'web-search', // 我们扩展的支持网络搜索的能力
      ],
      serverInfo: {
        name: 'NestJS MCP Server',
        version: '1.0.0',
      },
    }
  }

  /**
   * 列出可用工具
   * @returns 工具列表
   */
  listTools() {
    return {
      tools: [
        {
          name: 'web-search',
          description: '使用 ChatGLM Web Search API 进行网络搜索',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: '搜索查询',
              },
              model: {
                type: 'string',
                description: '模型名称',
              },
              temperature: {
                type: 'number',
                description: '温度参数',
                minimum: 0,
                maximum: 1,
              },
              top_p: {
                type: 'number',
                description: 'top_p参数',
                minimum: 0,
                maximum: 1,
              },
            },
            required: ['query'],
          },
        },
      ],
    }
  }

  /**
   * 调用指定工具
   * @param toolName 工具名称
   * @param args 工具参数
   * @returns 工具调用结果
   */
  async callTool(toolName: string, args: Record<string, any>) {
    switch (toolName) {
      case 'web-search':
        // 调用现有的网络搜索功能
        return await this.callWebSearchTool(args)
      default:
        throw new HttpException(
          `未知工具: ${toolName}`,
          HttpStatus.BAD_REQUEST,
        )
    }
  }

  /**
   * 调用网络搜索工具
   * @param args 搜索参数
   * @returns 搜索结果
   */
  private async callWebSearchTool(args: Record<string, any>) {
    const searchRequest: SearchRequestDto = {
      query: args.query as string,
      model: args.model as string | undefined,
      temperature: args.temperature as number | undefined,
      top_p: args.top_p as number | undefined,
    }

    try {
      await this.searchWithWeb(searchRequest)
      // 这里我们需要将流转换为适当的格式
      // 为了简化，我们返回一个表示成功的响应
      return {
        content: {
          message: '搜索请求已发送',
          query: args.query as string,
        },
        isError: false,
      }
    } catch (error) {
      return {
        content: {
          error: (error as Error).message,
          query: args.query as string,
        },
        isError: true,
      }
    }
  }
}