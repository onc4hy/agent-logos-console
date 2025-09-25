import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { ChatRequestDto } from './dto/chat-request.dto'
import { IncomingMessage } from 'http'

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
      );
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
      const response = await firstValueFrom(
        this.httpService.post(`${baseUrl}/chat/completions`, requestData, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'stream', // 设置响应类型为流
        }),
      );

      return response.data
    } catch (error) {
      if (error.response) {
        // API 返回错误
        throw new HttpException(
          `ChatGLM API 错误: ${error.response.data?.message || error.response.statusText}`,
          error.response.status,
        );
      } else if (error.request) {
        // 请求发送失败
        throw new HttpException(
          '无法连接到 ChatGLM API 服务',
          HttpStatus.BAD_GATEWAY,
        );
      } else {
        // 其他错误
        throw new HttpException(
          `请求 ChatGLM API 时发生错误: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}