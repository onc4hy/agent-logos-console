import {
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// MCP 核心接口定义

export class InitializeRequestDto {
  @ApiProperty({
    description: '协议版本',
    example: '2024-05-18',
  })
  @IsString()
  @IsNotEmpty()
  protocolVersion: string

  @ApiProperty({
    description: '客户端能力列表',
    example: ['resources', 'tools', 'prompts'],
  })
  @IsArray()
  @IsString({ each: true })
  capabilities: string[]

  @ApiPropertyOptional({
    description: '客户端信息',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  clientInfo?: Record<string, any>

  @ApiPropertyOptional({
    description: '服务器信息',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  serverInfo?: Record<string, any>
}

export class InitializeResponseDto {
  @ApiProperty({
    description: '协议版本',
    example: '2024-05-18',
  })
  @IsString()
  protocolVersion: string

  @ApiProperty({
    description: '服务器能力列表',
    example: ['resources', 'tools', 'prompts'],
  })
  @IsArray()
  @IsString({ each: true })
  capabilities: string[]

  @ApiPropertyOptional({
    description: '服务器信息',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  serverInfo?: Record<string, any>
}

export class ReadResourceRequestDto {
  @ApiProperty({
    description: '资源 URI',
    example: 'file:///path/to/file.txt',
  })
  @IsString()
  @IsNotEmpty()
  uri: string
}

export class ReadResourceResponseDto {
  @ApiProperty({
    description: '资源内容',
    example: '文件内容',
  })
  @IsString()
  contents: string
}

export class ListResourcesRequestDto {
  @ApiPropertyOptional({
    description: '资源类型',
    example: 'file',
  })
  @IsOptional()
  @IsString()
  type?: string

  @ApiPropertyOptional({
    description: '资源 URI 模式',
    example: 'file:///**/*.txt',
  })
  @IsOptional()
  @IsString()
  pattern?: string
}

export class ResourceDto {
  @ApiProperty({
    description: '资源 URI',
    example: 'file:///path/to/file.txt',
  })
  @IsString()
  uri: string

  @ApiPropertyOptional({
    description: '资源名称',
    example: 'file.txt',
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    description: '资源类型',
    example: 'file',
  })
  @IsOptional()
  @IsString()
  type?: string

  @ApiPropertyOptional({
    description: '资源纯文本内容',
    example: '文件内容',
  })
  @IsOptional()
  @IsString()
  text?: string
}

export class ListResourcesResponseDto {
  @ApiProperty({
    description: '资源列表',
    type: [ResourceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceDto)
  resources: ResourceDto[]
}

export class ListPromptsRequestDto {
  @ApiPropertyOptional({
    description: '提示词名称模式',
    example: '*',
  })
  @IsOptional()
  @IsString()
  name?: string
}

export class PromptArgumentDto {
  @ApiProperty({
    description: '参数名称',
    example: 'topic',
  })
  @IsString()
  name: string

  @ApiPropertyOptional({
    description: '参数描述',
    example: '讨论的主题',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    description: '是否必需',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean
}

export class PromptDto {
  @ApiProperty({
    description: '提示词名称',
    example: 'qa-prompt',
  })
  @IsString()
  name: string

  @ApiPropertyOptional({
    description: '提示词描述',
    example: '问答提示词模板',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: '提示词参数',
    type: [PromptArgumentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromptArgumentDto)
  arguments: PromptArgumentDto[]
}

export class ListPromptsResponseDto {
  @ApiProperty({
    description: '提示词列表',
    type: [PromptDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromptDto)
  prompts: PromptDto[]
}

export class GetPromptRequestDto {
  @ApiProperty({
    description: '提示词名称',
    example: 'qa-prompt',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    description: '提示词参数值',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  arguments?: Record<string, any>
}

export class GetPromptResponseDto {
  @ApiProperty({
    description: '提示词内容',
    example: '请回答以下问题：{question}',
  })
  @IsString()
  content: string
}

export class ToolDto {
  @ApiProperty({
    description: '工具名称',
    example: 'web-search',
  })
  @IsString()
  name: string

  @ApiPropertyOptional({
    description: '工具描述',
    example: '网络搜索工具',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: '工具输入参数',
    type: Object,
  })
  @IsObject()
  inputSchema: Record<string, any>
}

export class ListToolsRequestDto {
  @ApiPropertyOptional({
    description: '工具名称模式',
    example: '*',
  })
  @IsOptional()
  @IsString()
  name?: string
}

export class ListToolsResponseDto {
  @ApiProperty({
    description: '工具列表',
    type: [ToolDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolDto)
  tools: ToolDto[]
}

export class CallToolRequestDto {
  @ApiProperty({
    description: '工具名称',
    example: 'web-search',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    description: '工具参数',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  arguments?: Record<string, any>
}

export class CallToolResponseDto {
  @ApiProperty({
    description: '工具调用结果',
    type: Object,
  })
  @IsObject()
  content: Record<string, any>

  @ApiPropertyOptional({
    description: '是否为错误响应',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isError?: boolean
}
