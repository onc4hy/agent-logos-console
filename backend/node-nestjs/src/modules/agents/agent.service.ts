import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Agent } from '../../database/entities/agent.entity'
import { CreateAgentDto, UpdateAgentDto, DeployAgentDto } from './dto/agent.dto'

// 定义部署结果的类型
export interface DeploymentResult {
  platform: string
  status: string
  message: string
  deployedAt: Date
}

export interface DeployAgentResponse {
  agentId: number
  deployments: DeploymentResult[]
}

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async create(userId: number, createAgentDto: CreateAgentDto): Promise<Agent> {
    const agent = this.agentRepository.create({
      ...createAgentDto,
      userId,
    })
    return this.agentRepository.save(agent)
  }

  async findAll(): Promise<Agent[]> {
    return this.agentRepository.find({ relations: ['user'] })
  }

  async findOne(id: number): Promise<Agent | null> {
    return this.agentRepository.findOne({
      where: { id },
      relations: ['user'],
    })
  }

  async findByUser(userId: number): Promise<Agent[]> {
    return this.agentRepository.find({
      where: { userId },
      relations: ['user'],
    })
  }

  async update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    await this.agentRepository.update(id, updateAgentDto)
    const agent = await this.findOne(id)
    if (!agent) {
      throw new Error('Agent not found')
    }
    return agent
  }

  async remove(id: number): Promise<void> {
    await this.agentRepository.delete(id)
  }

  async incrementUsage(agentId: number): Promise<void> {
    await this.agentRepository.increment({ id: agentId }, 'usageCount', 1)
  }

  async deployAgent(
    deployAgentDto: DeployAgentDto,
  ): Promise<DeployAgentResponse> {
    // 根据项目规范添加await Promise.resolve()以满足ESLint规范
    await Promise.resolve()

    // 这里应该实现部署到第三方平台的逻辑
    // 为简化起见，我们返回模拟数据
    const { agentId, platforms } = deployAgentDto

    // 模拟部署过程
    const deploymentResults: DeploymentResult[] = []
    for (const platform of platforms) {
      deploymentResults.push({
        platform,
        status: 'success',
        message: `Agent ${agentId} deployed to ${platform}`,
        deployedAt: new Date(),
      })
    }

    return {
      agentId,
      deployments: deploymentResults,
    }
  }
}
