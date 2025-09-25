import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppDataSource } from './database/data-source'
import { AuthModule } from './modules/auth/auth.module'
import { AgentModule } from './modules/agents/agent.module'
import { CommunityModule } from './modules/community/community.module'
import { PointsModule } from './modules/points/points.module'
import { PaymentModule } from './modules/payment/payment.module'
import { VoiceModule } from './modules/voice/voice.module'
import { BackupModule } from './modules/backup/backup.module'
import { CommonModule } from './modules/common/common.module'
import { McpModule } from './modules/mcp/mcp.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    AgentModule,
    CommunityModule,
    PointsModule,
    PaymentModule,
    VoiceModule,
    BackupModule,
    CommonModule,
    McpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
