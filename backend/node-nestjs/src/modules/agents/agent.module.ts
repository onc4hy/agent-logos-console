import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Agent } from '../../database/entities/agent.entity'
import { AgentService } from './agent.service'
import { AgentController } from './agent.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  providers: [AgentService],
  controllers: [AgentController],
  exports: [AgentService],
})
export class AgentModule {}
