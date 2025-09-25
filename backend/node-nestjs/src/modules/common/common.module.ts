import { Module } from '@nestjs/common'
import { CommonController } from './common.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  controllers: [CommonController],
  providers: [],
  exports: [],
})
export class CommonModule {}
