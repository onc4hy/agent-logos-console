import { Module } from '@nestjs/common'
import { PointsService } from './points.service'
import { PointsController } from './points.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [PointsService],
  controllers: [PointsController],
})
export class PointsModule {}
