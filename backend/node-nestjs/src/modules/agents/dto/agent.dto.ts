// agent.dto.ts
export class CreateAgentDto {
  name: string
  description: string
  personality?: string
  knowledge?: string
  isPublic?: boolean
}

export class UpdateAgentDto {
  name?: string
  description?: string
  personality?: string
  knowledge?: string
  isPublic?: boolean
}

export class DeployAgentDto {
  agentId: number
  platforms: string[] // 要部署到的平台列表，如 ['coze', 'dify']
}
