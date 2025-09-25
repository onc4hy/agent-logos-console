import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MessageDto {
  @ApiProperty({ description: '角色', example: 'user' })
  @IsString()
  @IsNotEmpty()
  role: string

  @ApiProperty({ description: '消息内容', example: '你好，介绍一下你自己' })
  @IsString()
  @IsNotEmpty()
  content: string
}

export class ChatRequestDto {
  @ApiProperty({
    description: '消息历史',
    type: [MessageDto],
    example: [{ role: 'user', content: '你好，介绍一下你自己' }],
  })
  @IsArray()
  @IsNotEmpty()
  messages: MessageDto[]

  @ApiPropertyOptional({
    description: '模型名称',
    example: 'glm-4',
  })
  @IsOptional()
  @IsString()
  model?: string

  @ApiPropertyOptional({
    description: '温度参数，控制生成文本的随机性',
    example: 0.8,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number

  @ApiPropertyOptional({
    description: 'top_p参数，控制生成文本的多样性',
    example: 0.8,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  top_p?: number
}

export class SearchRequestDto {
  @ApiProperty({
    description: '搜索查询',
    example: '人工智能的最新发展',
  })
  @IsString()
  @IsNotEmpty()
  query: string

  @ApiPropertyOptional({
    description: '模型名称',
    example: 'glm-4',
  })
  @IsOptional()
  @IsString()
  model?: string

  @ApiPropertyOptional({
    description: '温度参数，控制生成文本的随机性',
    example: 0.8,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number

  @ApiPropertyOptional({
    description: 'top_p参数，控制生成文本的多样性',
    example: 0.8,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  top_p?: number
}
