import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { FetchJsonDto } from './dto/fetch-json.dto'
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBadGatewayResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger'

@Controller('common')
@ApiTags('Common')
export class CommonController {
  constructor(private readonly httpService: HttpService) {}

  @Get('fetch-json')
  @ApiOperation({ summary: '从远程URL获取JSON数据' })
  @ApiQuery({
    name: 'url',
    description: '远程JSON数据的URL地址',
    required: true,
    type: String,
  })
  @ApiOkResponse({ description: '成功获取并返回JSON数据' })
  @ApiBadRequestResponse({ description: '请求参数错误或URL不返回JSON数据' })
  @ApiBadGatewayResponse({ description: '无法连接到提供的URL' })
  @ApiInternalServerErrorResponse({ description: '服务器内部错误' })
  async fetchJsonFromUrl(
    @Query(new ValidationPipe({ transform: true })) query: FetchJsonDto,
  ) {
    const { url } = query

    try {
      // 发送 GET 请求获取 JSON 数据
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Accept: 'application/json',
          },
          timeout: 10000, // 10秒超时
        }),
      )

      // 检查响应是否为JSON格式
      const contentType = response.headers['content-type']
      if (!contentType || !contentType.includes('application/json')) {
        throw new HttpException(
          'The URL does not return JSON data',
          HttpStatus.BAD_REQUEST,
        )
      }

      // 返回获取到的 JSON 数据
      return response.data
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new HttpException(
          'Unable to connect to the provided URL',
          HttpStatus.BAD_GATEWAY,
        )
      }

      if (error.code === 'ECONNABORTED') {
        throw new HttpException('Request timeout', HttpStatus.REQUEST_TIMEOUT)
      }

      throw new HttpException(
        `Failed to fetch JSON data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
