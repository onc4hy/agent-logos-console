import { Module } from '@nestjs/common'
import { VoiceGateway } from './voice.gateway'
import { AgentModule } from '../agents/agent.module'

@Module({
  imports: [AgentModule],
  providers: [VoiceGateway],
})
export class VoiceModule {}
