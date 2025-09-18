import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { AgentService } from './agent.service'
import { CreateAgentDto, UpdateAgentDto, DeployAgentDto } from './dto/agent.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { DeployAgentResponse } from './agent.service'

// 定义请求对象类型
interface AuthenticatedRequest {
  user: {
    id: number
    email: string
    name: string
  }
}

@ApiTags('智能体')
@Controller('agents')
export class AgentController {
  constructor(private agentService: AgentService) {}

  @ApiOperation({ summary: '创建智能体' })
  @ApiResponse({ status: 201, description: '智能体创建成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createAgentDto: CreateAgentDto,
  ) {
    return this.agentService.create(req.user.id, createAgentDto)
  }

  @ApiOperation({ summary: '获取所有智能体' })
  @ApiResponse({ status: 200, description: '获取智能体列表成功' })
  @Get()
  async findAll() {
    return this.agentService.findAll()
  }

  @ApiOperation({ summary: '获取指定智能体' })
  @ApiResponse({ status: 200, description: '获取智能体成功' })
  @ApiResponse({ status: 404, description: '智能体不存在' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.agentService.findOne(+id)
  }

  @ApiOperation({ summary: '更新智能体' })
  @ApiResponse({ status: 200, description: '更新智能体成功' })
  @ApiResponse({ status: 404, description: '智能体不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    return this.agentService.update(+id, updateAgentDto)
  }

  @ApiOperation({ summary: '删除智能体' })
  @ApiResponse({ status: 200, description: '删除智能体成功' })
  @ApiResponse({ status: 404, description: '智能体不存在' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.agentService.remove(+id)
  }

  @ApiOperation({ summary: '获取当前用户的所有智能体' })
  @ApiResponse({ status: 200, description: '获取智能体列表成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-agents')
  async findByUser(@Request() req: AuthenticatedRequest) {
    return this.agentService.findByUser(req.user.id)
  }

  @ApiOperation({ summary: '部署智能体到第三方平台' })
  @ApiResponse({ status: 200, description: '部署成功' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('deploy')
  async deployAgent(
    @Body() deployAgentDto: DeployAgentDto,
  ): Promise<DeployAgentResponse> {
    return this.agentService.deployAgent(deployAgentDto)
  }
}
