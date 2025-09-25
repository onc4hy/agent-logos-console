import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
  ValidationPipe,
} from '@nestjs/common'
import type { Response } from 'express'
import { McpService } from './mcp.service'
import { ChatRequestDto, SearchRequestDto } from './dto/chat-request.dto'
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'
import { IncomingMessage } from 'http'

@ApiTags('MCP')
@Controller('mcp')
export class McpController {
  constructor(private readonly mcpService: McpService) {}

  @Post('chat')
  @ApiOperation({ summary: '与 ChatGLM 模型进行聊天对话' })
  @ApiBody({ type: ChatRequestDto })
  @ApiOkResponse({ description: '成功返回 SSE 流式响应' })
  @ApiBadRequestResponse({ description: '请求参数错误' })
  @ApiUnauthorizedResponse({ description: 'API 密钥无效' })
  @ApiInternalServerErrorResponse({ description: '服务器内部错误' })
  async chatWithModel(
    @Body(new ValidationPipe({ transform: true })) chatRequest: ChatRequestDto,
    @Res() res: Response,
  ) {
    try {
      // 设置 SSE 响应头
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('Access-Control-Allow-Origin', '*')

      // 调用服务获取流式响应
      const stream: IncomingMessage =
        await this.mcpService.chatWithModel(chatRequest)

      // 监听流数据并发送给客户端
      stream.on('data', (chunk: any) => {
        res.write(chunk)
      })

      // 流结束时关闭连接
      stream.on('end', () => {
        res.end()
      })

      // 处理流错误
      stream.on('error', (error: Error) => {
        console.error('Stream error:', error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          error: 'Stream error occurred',
          message: error.message,
        })
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        `处理聊天请求时发生错误: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Post('search')
  @ApiOperation({ summary: '使用 ChatGLM Web Search API 进行网络搜索' })
  @ApiBody({ type: SearchRequestDto })
  @ApiOkResponse({ description: '成功返回 SSE 流式响应' })
  @ApiBadRequestResponse({ description: '请求参数错误' })
  @ApiUnauthorizedResponse({ description: 'API 密钥无效' })
  @ApiInternalServerErrorResponse({ description: '服务器内部错误' })
  async searchWithWeb(
    @Body(new ValidationPipe({ transform: true }))
    searchRequest: SearchRequestDto,
    @Res() res: Response,
  ) {
    try {
      // 设置 SSE 响应头
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('Access-Control-Allow-Origin', '*')

      // 调用服务获取流式响应
      const stream: IncomingMessage =
        await this.mcpService.searchWithWeb(searchRequest)

      // 监听流数据并发送给客户端
      stream.on('data', (chunk: any) => {
        res.write(chunk)
      })

      // 流结束时关闭连接
      stream.on('end', () => {
        res.end()
      })

      // 处理流错误
      stream.on('error', (error: Error) => {
        console.error('Stream error:', error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          error: 'Stream error occurred',
          message: error.message,
        })
      })
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        `处理搜索请求时发生错误: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
